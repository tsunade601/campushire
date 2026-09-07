const { query, pool } = require('../config/db');

async function getProfile(req, res, next) {
  try {
    const studentId = req.student ? req.student.id : req.params.id;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID missing.' });
    }

    const students = await query(
      `SELECT s.*, d.name AS department_name, d.code AS department_code, u.email
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN departments d ON s.department_id = d.id
       WHERE s.id = ?`,
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const skills = await query(
      `SELECT sk.id, sk.name, sk.category, ss.proficiency
       FROM student_skills ss
       JOIN skills sk ON ss.skill_id = sk.id
       WHERE ss.student_id = ?
       ORDER BY sk.category, sk.name`,
      [studentId]
    );

    return res.status(200).json({
      success: true,
      student: {
        ...students[0],
        skills
      }
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    if (!req.student) {
      return res.status(403).json({ success: false, message: 'Only students can update their profile.' });
    }

    const {
      first_name,
      last_name,
      phone,
      address,
      linkedin_url,
      github_url,
      resume_url,
      bio,
      current_semester
    } = req.body;

    await query(
      `UPDATE students 
       SET first_name = COALESCE(?, first_name),
           last_name = COALESCE(?, last_name),
           phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           linkedin_url = COALESCE(?, linkedin_url),
           github_url = COALESCE(?, github_url),
           resume_url = COALESCE(?, resume_url),
           bio = COALESCE(?, bio),
           current_semester = COALESCE(?, current_semester)
       WHERE id = ?`,
      [first_name, last_name, phone, address, linkedin_url, github_url, resume_url, bio, current_semester, req.student.id]
    );

    return res.status(200).json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    next(error);
  }
}

async function getSkills(req, res, next) {
  try {
    const allSkills = await query('SELECT * FROM skills ORDER BY category, name');
    let studentSkills = [];

    if (req.student) {
      studentSkills = await query(
        `SELECT sk.id, sk.name, sk.category, ss.proficiency
         FROM student_skills ss
         JOIN skills sk ON ss.skill_id = sk.id
         WHERE ss.student_id = ?`,
        [req.student.id]
      );
    }

    return res.status(200).json({
      success: true,
      catalog: allSkills,
      studentSkills
    });
  } catch (error) {
    next(error);
  }
}

async function addSkill(req, res, next) {
  try {
    if (!req.student) {
      return res.status(403).json({ success: false, message: 'Student access only.' });
    }
    const { skill_id, proficiency = 'Intermediate' } = req.body;

    await query(
      `INSERT INTO student_skills (student_id, skill_id, proficiency)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE proficiency = VALUES(proficiency)`,
      [req.student.id, skill_id, proficiency]
    );

    return res.status(200).json({ success: true, message: 'Skill saved to profile.' });
  } catch (error) {
    next(error);
  }
}

async function removeSkill(req, res, next) {
  try {
    if (!req.student) {
      return res.status(403).json({ success: false, message: 'Student access only.' });
    }
    const skillId = req.params.skillId;

    await query(
      'DELETE FROM student_skills WHERE student_id = ? AND skill_id = ?',
      [req.student.id, skillId]
    );

    return res.status(200).json({ success: true, message: 'Skill removed from profile.' });
  } catch (error) {
    next(error);
  }
}

async function getDashboard(req, res, next) {
  try {
    if (!req.student) {
      return res.status(403).json({ success: false, message: 'Student context required.' });
    }
    const sId = req.student.id;

    // Applications count by status
    const [counts] = await query(
      `SELECT 
         COUNT(*) AS total_applied,
         SUM(CASE WHEN status IN ('Applied', 'Under Review') THEN 1 ELSE 0 END) AS in_review,
         SUM(CASE WHEN status = 'Shortlisted' THEN 1 ELSE 0 END) AS shortlisted,
         SUM(CASE WHEN status = 'Interview Scheduled' THEN 1 ELSE 0 END) AS interview_count,
         SUM(CASE WHEN status = 'Offered' THEN 1 ELSE 0 END) AS offers_count,
         SUM(CASE WHEN status = 'Accepted' THEN 1 ELSE 0 END) AS accepted_count
       FROM applications 
       WHERE student_id = ?`,
      [sId]
    );

    // Upcoming interviews
    const upcomingInterviews = await query(
      `SELECT i.*, a.internship_id, intn.title AS role_title, c.name AS company_name
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       JOIN internships intn ON a.internship_id = intn.id
       JOIN companies c ON intn.company_id = c.id
       WHERE a.student_id = ? AND i.result = 'Scheduled'
       ORDER BY i.scheduled_at ASC
       LIMIT 5`,
      [sId]
    );

    // Active offers
    const activeOffers = await query(
      `SELECT o.*, intn.title AS role_title, c.name AS company_name
       FROM offers o
       JOIN applications a ON o.application_id = a.id
       JOIN internships intn ON a.internship_id = intn.id
       JOIN companies c ON intn.company_id = c.id
       WHERE a.student_id = ? AND o.status = 'Issued'
       ORDER BY o.offer_valid_until ASC`,
      [sId]
    );

    // Recent applications
    const recentApps = await query(
      `SELECT a.id, a.status, a.applied_at, intn.title, c.name AS company_name, intn.location, intn.stipend_amount
       FROM applications a
       JOIN internships intn ON a.internship_id = intn.id
       JOIN companies c ON intn.company_id = c.id
       WHERE a.student_id = ?
       ORDER BY a.applied_at DESC
       LIMIT 5`,
      [sId]
    );

    return res.status(200).json({
      success: true,
      stats: counts || { total_applied: 0, in_review: 0, shortlisted: 0, interview_count: 0, offers_count: 0, accepted_count: 0 },
      upcomingInterviews,
      activeOffers,
      recentApplications: recentApps
    });
  } catch (error) {
    next(error);
  }
}

async function listAllStudents(req, res, next) {
  try {
    const { department_id, search, min_cgpa, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const params = [];

    let whereClause = 'WHERE 1=1';
    if (department_id) {
      whereClause += ' AND s.department_id = ?';
      params.push(department_id);
    }
    if (min_cgpa) {
      whereClause += ' AND s.cgpa >= ?';
      params.push(min_cgpa);
    }
    if (search) {
      whereClause += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.roll_number LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const countRows = await query(
      `SELECT COUNT(*) AS total FROM students s ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const students = await query(
      `SELECT s.*, d.name AS department_name, d.code AS department_code, u.email,
              (SELECT COUNT(*) FROM applications a WHERE a.student_id = s.id) AS application_count
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN departments d ON s.department_id = d.id
       ${whereClause}
       ORDER BY s.cgpa DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), parseInt(offset, 10)]
    );

    return res.status(200).json({
      success: true,
      data: students,
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

module.exports = {
  getProfile,
  updateProfile,
  getSkills,
  addSkill,
  removeSkill,
  getDashboard,
  listAllStudents
};
