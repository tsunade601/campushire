const { query, pool } = require('../config/db');

async function listInternships(req, res, next) {
  try {
    const {
      search,
      company_id,
      industry_id,
      location,
      work_mode,
      min_stipend,
      duration_weeks,
      skill_id,
      status = 'Open',
      sort_by = 'deadline',
      sort_order = 'ASC',
      page = 1,
      limit = 12
    } = req.query;

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const whereConditions = ['1=1'];
    const params = [];

    if (status && status !== 'All') {
      whereConditions.push('i.status = ?');
      params.push(status);
    }
    if (company_id) {
      whereConditions.push('i.company_id = ?');
      params.push(company_id);
    }
    if (industry_id) {
      whereConditions.push('c.industry_id = ?');
      params.push(industry_id);
    }
    if (location) {
      whereConditions.push('i.location LIKE ?');
      params.push(`%${location}%`);
    }
    if (work_mode) {
      whereConditions.push('i.work_mode = ?');
      params.push(work_mode);
    }
    if (min_stipend) {
      whereConditions.push('i.stipend_amount >= ?');
      params.push(min_stipend);
    }
    if (duration_weeks) {
      whereConditions.push('i.duration_weeks <= ?');
      params.push(duration_weeks);
    }
    if (search) {
      whereConditions.push('(i.title LIKE ? OR i.description LIKE ? OR c.name LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (skill_id) {
      whereConditions.push('EXISTS (SELECT 1 FROM internship_skills isk WHERE isk.internship_id = i.id AND isk.skill_id = ?)');
      params.push(skill_id);
    }

    const whereSql = whereConditions.join(' AND ');

    // Count
    const countResult = await query(
      `SELECT COUNT(DISTINCT i.id) AS total
       FROM internships i
       JOIN companies c ON i.company_id = c.id
       WHERE ${whereSql}`,
      params
    );
    const total = countResult[0].total;

    // Allowed sorts
    const allowedSortCols = {
      deadline: 'i.deadline',
      stipend: 'i.stipend_amount',
      created: 'i.created_at',
      title: 'i.title'
    };
    const sortCol = allowedSortCols[sort_by] || 'i.deadline';
    const sortDir = sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const items = await query(
      `SELECT 
         i.*,
         c.name AS company_name,
         c.city AS company_city,
         c.logo_url AS company_logo,
         ind.name AS industry_name,
         (SELECT COUNT(*) FROM applications a WHERE a.internship_id = i.id) AS total_applicants,
         DATEDIFF(i.deadline, CURDATE()) AS days_left
       FROM internships i
       JOIN companies c ON i.company_id = c.id
       JOIN industries ind ON c.industry_id = ind.id
       WHERE ${whereSql}
       ORDER BY ${sortCol} ${sortDir}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), parseInt(offset, 10)]
    );

    // Attach required skills for cards
    if (items.length > 0) {
      const ids = items.map(x => x.id);
      const skills = await query(
        `SELECT isk.internship_id, sk.id, sk.name, sk.category, isk.is_required
         FROM internship_skills isk
         JOIN skills sk ON isk.skill_id = sk.id
         WHERE isk.internship_id IN (${ids.map(() => '?').join(',')})`,
        ids
      );

      const skillMap = {};
      skills.forEach(s => {
        if (!skillMap[s.internship_id]) skillMap[s.internship_id] = [];
        skillMap[s.internship_id].push(s);
      });

      items.forEach(item => {
        item.skills = skillMap[item.id] || [];
      });
    }

    return res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getInternshipDetails(req, res, next) {
  try {
    const id = req.params.id;

    const items = await query(
      `SELECT 
         i.*,
         c.name AS company_name,
         c.website AS company_website,
         c.logo_url AS company_logo,
         c.description AS company_description,
         c.city AS company_city,
         c.hr_name,
         c.hr_email,
         ind.name AS industry_name,
         DATEDIFF(i.deadline, CURDATE()) AS days_left,
         (SELECT COUNT(*) FROM applications WHERE internship_id = i.id) AS application_count
       FROM internships i
       JOIN companies c ON i.company_id = c.id
       JOIN industries ind ON c.industry_id = ind.id
       WHERE i.id = ?`,
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: 'Internship posting not found.' });
    }

    const internship = items[0];

    const requiredSkills = await query(
      `SELECT sk.id, sk.name, sk.category, isk.is_required
       FROM internship_skills isk
       JOIN skills sk ON isk.skill_id = sk.id
       WHERE isk.internship_id = ?
       ORDER BY isk.is_required DESC, sk.name ASC`,
      [id]
    );

    internship.skills = requiredSkills;

    // Check if authenticated student has already applied
    let studentApplication = null;
    if (req.student) {
      const apps = await query(
        'SELECT id, status, applied_at FROM applications WHERE student_id = ? AND internship_id = ?',
        [req.student.id, id]
      );
      if (apps.length > 0) studentApplication = apps[0];
    }

    internship.hasApplied = !!studentApplication;
    internship.userApplication = studentApplication;

    return res.status(200).json({
      success: true,
      internship
    });
  } catch (error) {
    next(error);
  }
}

async function createInternship(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      company_id,
      title,
      description,
      requirements,
      location,
      work_mode,
      duration_weeks,
      stipend_amount,
      openings,
      deadline,
      start_date,
      end_date,
      status = 'Open',
      skills = []
    } = req.body;

    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO internships 
        (company_id, title, description, requirements, location, work_mode, duration_weeks, stipend_amount, openings, deadline, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [company_id, title, description, requirements, location, work_mode, duration_weeks, stipend_amount, openings, deadline, start_date, end_date, status]
    );

    const newId = result.insertId;

    if (skills && Array.isArray(skills) && skills.length > 0) {
      for (const s of skills) {
        const skillId = typeof s === 'object' ? s.id : s;
        const isReq = typeof s === 'object' && s.is_required !== undefined ? s.is_required : true;
        await connection.execute(
          'INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES (?, ?, ?)',
          [newId, skillId, isReq]
        );
      }
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Internship posting published successfully.',
      internshipId: newId
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

async function updateInternship(req, res, next) {
  try {
    const id = req.params.id;
    const {
      title,
      description,
      requirements,
      location,
      work_mode,
      duration_weeks,
      stipend_amount,
      openings,
      deadline,
      start_date,
      end_date,
      status
    } = req.body;

    await query(
      `UPDATE internships 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           requirements = COALESCE(?, requirements),
           location = COALESCE(?, location),
           work_mode = COALESCE(?, work_mode),
           duration_weeks = COALESCE(?, duration_weeks),
           stipend_amount = COALESCE(?, stipend_amount),
           openings = COALESCE(?, openings),
           deadline = COALESCE(?, deadline),
           start_date = COALESCE(?, start_date),
           end_date = COALESCE(?, end_date),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [title, description, requirements, location, work_mode, duration_weeks, stipend_amount, openings, deadline, start_date, end_date, status, id]
    );

    return res.status(200).json({ success: true, message: 'Internship posting updated.' });
  } catch (error) {
    next(error);
  }
}

async function deleteInternship(req, res, next) {
  try {
    const id = req.params.id;
    await query('DELETE FROM internships WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Internship deleted.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInternships,
  getInternshipDetails,
  createInternship,
  updateInternship,
  deleteInternship
};
