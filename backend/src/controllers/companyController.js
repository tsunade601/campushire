const { query } = require('../config/db');

async function listCompanies(req, res, next) {
  try {
    const { industry_id, city, status = 'approved', search } = req.query;
    const where = ['1=1'];
    const params = [];

    if (status && status !== 'All') {
      where.push('c.status = ?');
      params.push(status);
    }
    if (industry_id) {
      where.push('c.industry_id = ?');
      params.push(industry_id);
    }
    if (city) {
      where.push('c.city = ?');
      params.push(city);
    }
    if (search) {
      where.push('(c.name LIKE ? OR c.description LIKE ? OR c.city LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const companies = await query(
      `SELECT 
         c.*,
         ind.name AS industry_name,
         (SELECT COUNT(*) FROM internships i WHERE i.company_id = c.id) AS total_postings,
         (SELECT COUNT(*) FROM internships i WHERE i.company_id = c.id AND i.status = 'Open') AS active_postings
       FROM companies c
       JOIN industries ind ON c.industry_id = ind.id
       WHERE ${where.join(' AND ')}
       ORDER BY c.name ASC`,
      params
    );

    return res.status(200).json({ success: true, data: companies });
  } catch (error) {
    next(error);
  }
}

async function getCompanyDetails(req, res, next) {
  try {
    const id = req.params.id;
    const companies = await query(
      `SELECT c.*, ind.name AS industry_name, ind.description AS industry_description
       FROM companies c
       JOIN industries ind ON c.industry_id = ind.id
       WHERE c.id = ?`,
      [id]
    );

    if (companies.length === 0) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    const company = companies[0];

    // Postings
    const postings = await query(
      `SELECT i.*, (SELECT COUNT(*) FROM applications a WHERE a.internship_id = i.id) AS total_applicants
       FROM internships i
       WHERE i.company_id = ?
       ORDER BY i.created_at DESC`,
      [id]
    );

    company.internships = postings;

    return res.status(200).json({ success: true, company });
  } catch (error) {
    next(error);
  }
}

async function createCompany(req, res, next) {
  try {
    const {
      name,
      industry_id,
      website = '',
      logo_url = '',
      description = '',
      address = '',
      city = 'Bengaluru',
      country = 'India',
      hr_name,
      hr_email,
      hr_phone = '',
      status = 'approved'
    } = req.body;

    const [insert] = await query(
      `INSERT INTO companies 
        (name, industry_id, website, logo_url, description, address, city, country, hr_name, hr_email, hr_phone, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, industry_id, website, logo_url, description, address, city, country, hr_name, hr_email, hr_phone, status]
    );

    return res.status(201).json({
      success: true,
      message: 'Company profile created successfully.',
      companyId: insert.insertId
    });
  } catch (error) {
    next(error);
  }
}

async function updateCompany(req, res, next) {
  try {
    const id = req.params.id;
    const {
      name,
      industry_id,
      website,
      logo_url,
      description,
      address,
      city,
      hr_name,
      hr_email,
      hr_phone,
      status
    } = req.body;

    await query(
      `UPDATE companies 
       SET name = COALESCE(?, name),
           industry_id = COALESCE(?, industry_id),
           website = COALESCE(?, website),
           logo_url = COALESCE(?, logo_url),
           description = COALESCE(?, description),
           address = COALESCE(?, address),
           city = COALESCE(?, city),
           hr_name = COALESCE(?, hr_name),
           hr_email = COALESCE(?, hr_email),
           hr_phone = COALESCE(?, hr_phone),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [name, industry_id, website, logo_url, description, address, city, hr_name, hr_email, hr_phone, status, id]
    );

    return res.status(200).json({ success: true, message: 'Company updated.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCompanies,
  getCompanyDetails,
  createCompany,
  updateCompany
};
