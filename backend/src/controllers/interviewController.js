const { query, pool } = require('../config/db');

async function scheduleInterview(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      application_id,
      round_number = 1,
      round_type = 'Technical Round 1',
      scheduled_at,
      duration_minutes = 45,
      location_or_link,
      interviewer_name = 'Technical Panel'
    } = req.body;

    await connection.beginTransaction();

    // Verify application exists
    const [apps] = await connection.execute(
      'SELECT id, status FROM applications WHERE id = ? FOR UPDATE',
      [application_id]
    );

    if (apps.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Target application not found.' });
    }

    // Insert interview round
    const [result] = await connection.execute(
      `INSERT INTO interviews 
        (application_id, round_number, round_type, scheduled_at, duration_minutes, location_or_link, interviewer_name, result)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Scheduled')`,
      [application_id, round_number, round_type, scheduled_at, duration_minutes, location_or_link, interviewer_name]
    );

    // Advance application status to 'Interview Scheduled' if not already offered
    if (apps[0].status !== 'Offered' && apps[0].status !== 'Accepted') {
      await connection.execute(
        "UPDATE applications SET status = 'Interview Scheduled', updated_at = NOW() WHERE id = ?",
        [application_id]
      );
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Interview round scheduled successfully.',
      interviewId: result.insertId
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

async function listInterviews(req, res, next) {
  try {
    const { application_id, result } = req.query;
    const where = ['1=1'];
    const params = [];

    if (req.user.role === 'student' && req.student) {
      where.push('a.student_id = ?');
      params.push(req.student.id);
    } else if (req.user.role === 'company' && req.company) {
      where.push('i.company_id = ?');
      params.push(req.company.id);
    }

    if (application_id) {
      where.push('inv.application_id = ?');
      params.push(application_id);
    }
    if (result) {
      where.push('inv.result = ?');
      params.push(result);
    }

    const interviews = await query(
      `SELECT 
         inv.*,
         a.student_id,
         CONCAT(s.first_name, ' ', s.last_name) AS student_name,
         s.roll_number,
         i.title AS internship_title,
         c.name AS company_name
       FROM interviews inv
       JOIN applications a ON inv.application_id = a.id
       JOIN students s ON a.student_id = s.id
       JOIN internships i ON a.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       WHERE ${where.join(' AND ')}
       ORDER BY inv.scheduled_at ASC`,
      params
    );

    return res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    next(error);
  }
}

async function updateInterviewResult(req, res, next) {
  try {
    const id = req.params.id;
    const { result, feedback, rating } = req.body;

    const allowedResults = ['Scheduled', 'Passed', 'Failed', 'No Show', 'Cancelled'];
    if (!allowedResults.includes(result)) {
      return res.status(400).json({ success: false, message: 'Invalid result value.' });
    }

    await query(
      `UPDATE interviews 
       SET result = ?, feedback = COALESCE(?, feedback), rating = COALESCE(?, rating), updated_at = NOW()
       WHERE id = ?`,
      [result, feedback, rating, id]
    );

    return res.status(200).json({ success: true, message: 'Interview outcome recorded.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  scheduleInterview,
  listInterviews,
  updateInterviewResult
};
