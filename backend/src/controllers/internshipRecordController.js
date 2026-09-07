const { query } = require('../config/db');

async function listRecords(req, res, next) {
  try {
    const { status } = req.query;
    const where = ['1=1'];
    const params = [];

    if (req.user.role === 'student' && req.student) {
      where.push('r.student_id = ?');
      params.push(req.student.id);
    } else if (req.user.role === 'company' && req.company) {
      where.push('i.company_id = ?');
      params.push(req.company.id);
    }

    if (status && status !== 'All') {
      where.push('r.status = ?');
      params.push(status);
    }

    const records = await query(
      `SELECT 
         r.*,
         s.roll_number,
         CONCAT(s.first_name, ' ', s.last_name) AS student_name,
         d.code AS department_code,
         i.title AS role_title,
         c.name AS company_name,
         c.logo_url AS company_logo,
         e.overall_score,
         e.ppo_offered
       FROM internship_records r
       JOIN students s ON r.student_id = s.id
       JOIN departments d ON s.department_id = d.id
       JOIN internships i ON r.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       LEFT JOIN evaluations e ON r.id = e.internship_record_id
       WHERE ${where.join(' AND ')}
       ORDER BY r.created_at DESC`,
      params
    );

    return res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
}

async function updateRecordStatus(req, res, next) {
  try {
    const id = req.params.id;
    const { status, completion_notes } = req.body;

    const allowed = ['Active', 'Completed', 'Terminated', 'Extended'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    await query(
      'UPDATE internship_records SET status = ?, completion_notes = COALESCE(?, completion_notes), updated_at = NOW() WHERE id = ?',
      [status, completion_notes, id]
    );

    return res.status(200).json({ success: true, message: `Internship record status updated to ${status}.` });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listRecords,
  updateRecordStatus
};
