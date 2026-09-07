const { query, pool } = require('../config/db');

async function createOffer(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      application_id,
      offer_letter_url = '',
      stipend_offered,
      benefits_description = '',
      joining_date,
      offer_valid_until
    } = req.body;

    await connection.beginTransaction();

    // Check application exists
    const [apps] = await connection.execute(
      'SELECT id, student_id, internship_id, status FROM applications WHERE id = ? FOR UPDATE',
      [application_id]
    );

    if (apps.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Check if offer already issued
    const [existing] = await connection.execute(
      'SELECT id FROM offers WHERE application_id = ?',
      [application_id]
    );
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({ success: false, message: 'An offer has already been generated for this application.' });
    }

    const [offerRes] = await connection.execute(
      `INSERT INTO offers 
        (application_id, offer_letter_url, stipend_offered, benefits_description, joining_date, offer_valid_until, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Issued')`,
      [application_id, offer_letter_url, stipend_offered, benefits_description, joining_date, offer_valid_until]
    );

    // Update application to 'Offered'
    await connection.execute(
      "UPDATE applications SET status = 'Offered', updated_at = NOW() WHERE id = ?",
      [application_id]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Recruitment offer extended successfully!',
      offerId: offerRes.insertId
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

async function listOffers(req, res, next) {
  try {
    const { status } = req.query;
    const where = ['1=1'];
    const params = [];

    if (req.user.role === 'student' && req.student) {
      where.push('a.student_id = ?');
      params.push(req.student.id);
    } else if (req.user.role === 'company' && req.company) {
      where.push('i.company_id = ?');
      params.push(req.company.id);
    }

    if (status && status !== 'All') {
      where.push('o.status = ?');
      params.push(status);
    }

    const offers = await query(
      `SELECT 
         o.*,
         a.student_id,
         CONCAT(s.first_name, ' ', s.last_name) AS student_name,
         s.roll_number,
         d.code AS department_code,
         i.title AS role_title,
         c.name AS company_name,
         c.logo_url AS company_logo,
         c.city AS company_city,
         DATEDIFF(o.offer_valid_until, CURDATE()) AS days_valid_remaining
       FROM offers o
       JOIN applications a ON o.application_id = a.id
       JOIN students s ON a.student_id = s.id
       JOIN departments d ON s.department_id = d.id
       JOIN internships i ON a.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       WHERE ${where.join(' AND ')}
       ORDER BY o.created_at DESC`,
      params
    );

    return res.status(200).json({ success: true, data: offers });
  } catch (error) {
    next(error);
  }
}

async function respondToOffer(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const offerId = req.params.id;
    const { action } = req.body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: "Action must be 'accept' or 'reject'." });
    }

    await connection.beginTransaction();

    const [offers] = await connection.execute(
      `SELECT o.*, a.student_id, a.internship_id, i.start_date, i.end_date, c.hr_name, c.hr_email
       FROM offers o
       JOIN applications a ON o.application_id = a.id
       JOIN internships i ON a.internship_id = i.id
       JOIN companies c ON i.company_id = c.id
       WHERE o.id = ? FOR UPDATE`,
      [offerId]
    );

    if (offers.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Offer not found.' });
    }

    const offer = offers[0];

    // Authorization: student can only respond to their own offer
    if (req.user.role === 'student' && req.student && offer.student_id !== req.student.id) {
      await connection.rollback();
      return res.status(403).json({ success: false, message: 'Unauthorized to act on this offer.' });
    }

    if (offer.status !== 'Issued') {
      await connection.rollback();
      return res.status(400).json({ success: false, message: `Offer is already marked as ${offer.status}.` });
    }

    const newOfferStatus = action === 'accept' ? 'Accepted' : 'Rejected';
    const newAppStatus = action === 'accept' ? 'Accepted' : 'Declined';

    // 1. Update offer
    await connection.execute(
      'UPDATE offers SET status = ?, responded_at = NOW(), updated_at = NOW() WHERE id = ?',
      [newOfferStatus, offerId]
    );

    // 2. Update application
    await connection.execute(
      'UPDATE applications SET status = ?, updated_at = NOW() WHERE id = ?',
      [newAppStatus, offer.application_id]
    );

    // 3. If accepted, automatically provision internship record (ACID transaction)
    if (action === 'accept') {
      await connection.execute(
        `INSERT INTO internship_records 
          (offer_id, student_id, internship_id, official_start_date, official_end_date, supervisor_name, supervisor_email, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`,
        [
          offer.id,
          offer.student_id,
          offer.internship_id,
          offer.joining_date || offer.start_date,
          offer.end_date,
          offer.hr_name || 'Assigned Mentor',
          offer.hr_email || 'mentor@company.com'
        ]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: `Offer ${action === 'accept' ? 'accepted! Congratulations on your internship.' : 'declined.'}`
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

module.exports = {
  createOffer,
  listOffers,
  respondToOffer
};
