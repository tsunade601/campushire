const { query, pool } = require('../config/db');

async function apply(req, res, next) {
  const connection = await pool.getConnection();
  try {
    if (!req.student) {
      return res.status(403).json({ success: false, message: 'Only registered students can apply for internships.' });
    }

    const studentId = req.student.id;
    const internshipId = parseInt(req.params.id, 10);
    const { cover_letter = '', resume_url = '' } = req.body;

    await connection.beginTransaction();

    // 1. Lock and check internship status & deadline
    const [internships] = await connection.execute(
      'SELECT id, title, deadline, status FROM internships WHERE id = ? FOR UPDATE',
      [internshipId]
    );

    if (internships.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    const internship = internships[0];

    if (internship.status !== 'Open') {
      await connection.rollback();
      return res.status(400).json({ success: false, message: `Cannot apply. Internship posting is currently ${internship.status}.` });
    }

    const now = new Date();
    const deadlineDate = new Date(internship.deadline);
    // End of deadline day check
    deadlineDate.setHours(23, 59, 59, 999);
    if (now > deadlineDate) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'The application deadline has passed for this internship.' });
    }

    // 2. Check for duplicate application
    const [existingApps] = await connection.execute(
      'SELECT id, status FROM applications WHERE student_id = ? AND internship_id = ?',
      [studentId, internshipId]
    );

    if (existingApps.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this internship.'
      });
    }

    // 3. Insert application atomically
    const effectiveResume = resume_url || req.student.resume_url || '';
    const [insertResult] = await connection.execute(
      'INSERT INTO applications (student_id, internship_id, status, cover_letter, resume_url) VALUES (?, ?, ?, ?, ?)',
      [studentId, internshipId, 'Applied', cover_letter, effectiveResume]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: insertResult.insertId
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

async function listApplications(req, res, next) {
  try {
    const { status, internship_id, department_id, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const whereConditions = ['1=1'];
    const params = [];

    // Scope to student if student role
    if (req.user.role === 'student' && req.student) {
      whereConditions.push('a.student_id = ?');
      params.push(req.student.id);
    } else if (req.user.role === 'company' && req.company) {
      whereConditions.push('i.company_id = ?');
      params.push(req.company.id);
    }

    if (status && status !== 'All') {
      whereConditions.push('a.status = ?');
      params.push(status);
    }
    if (internship_id) {
      whereConditions.push('a.internship_id = ?');
      params.push(internship_id);
    }
    if (department_id) {
      whereConditions.push('s.department_id = ?');
      params.push(department_id);
    }
    if (search) {
      whereConditions.push('(s.first_name LIKE ? OR s.last_name LIKE ? OR s.roll_number LIKE ? OR i.title LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const whereSql = whereConditions.join(' AND ');

    const [countRows] = await query(
      `SELECT COUNT(*) AS total
       FROM applications a
       JOIN students s ON a.student_id = s.id
       JOIN internships i ON a.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       WHERE ${whereSql}`,
      params
    );
    const total = countRows.total;

    const applications = await query(
      `SELECT 
         a.*,
         s.roll_number,
         CONCAT(s.first_name, ' ', s.last_name) AS student_name,
         s.cgpa,
         s.phone AS student_phone,
         d.code AS department_code,
         d.name AS department_name,
         i.title AS internship_title,
         i.location,
         i.stipend_amount,
         c.name AS company_name,
         c.logo_url AS company_logo,
         (SELECT COUNT(*) FROM interviews inv WHERE inv.application_id = a.id) AS interview_count,
         (SELECT o.status FROM offers o WHERE o.application_id = a.id LIMIT 1) AS offer_status
       FROM applications a
       JOIN students s ON a.student_id = s.id
       JOIN departments d ON s.department_id = d.id
       JOIN internships i ON a.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       WHERE ${whereSql}
       ORDER BY a.applied_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), parseInt(offset, 10)]
    );

    return res.status(200).json({
      success: true,
      data: applications,
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

async function getApplicationDetails(req, res, next) {
  try {
    const id = req.params.id;

    const apps = await query(
      `SELECT 
         a.*,
         s.roll_number,
         s.first_name,
         s.last_name,
         s.cgpa,
         s.current_semester,
         s.batch_year,
         s.linkedin_url,
         s.github_url,
         s.resume_url AS profile_resume,
         u.email AS student_email,
         d.name AS department_name,
         d.code AS department_code,
         i.title AS internship_title,
         i.location,
         i.stipend_amount,
         i.work_mode,
         i.duration_weeks,
         c.name AS company_name
       FROM applications a
       JOIN students s ON a.student_id = s.id
       JOIN users u ON s.user_id = u.id
       JOIN departments d ON s.department_id = d.id
       JOIN internships i ON a.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       WHERE a.id = ?`,
      [id]
    );

    if (apps.length === 0) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const application = apps[0];

    // Authorization check
    if (req.user.role === 'student' && req.student && application.student_id !== req.student.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this application.' });
    }

    // Interviews
    const interviews = await query(
      'SELECT * FROM interviews WHERE application_id = ? ORDER BY round_number ASC',
      [id]
    );

    // Offers
    const offers = await query(
      'SELECT * FROM offers WHERE application_id = ?',
      [id]
    );

    // Student Skills
    const skills = await query(
      `SELECT sk.name, sk.category, ss.proficiency
       FROM student_skills ss
       JOIN skills sk ON ss.skill_id = sk.id
       WHERE ss.student_id = ?`,
      [application.student_id]
    );

    return res.status(200).json({
      success: true,
      application: {
        ...application,
        interviews,
        offer: offers[0] || null,
        skills
      }
    });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const id = req.params.id;
    const { status, notes } = req.body;

    const allowed = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Offered', 'Accepted', 'Declined', 'Withdrawn'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    await query(
      'UPDATE applications SET status = ?, notes = COALESCE(?, notes), updated_at = NOW() WHERE id = ?',
      [status, notes, id]
    );

    return res.status(200).json({ success: true, message: `Application status changed to ${status}.` });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  apply,
  listApplications,
  getApplicationDetails,
  updateStatus
};
