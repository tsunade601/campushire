const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { query } = require('../config/db');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Fetch fresh user state from database
    const users = await query(
      'SELECT id, email, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!users || users.length === 0 || !users[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or account deactivated.'
      });
    }

    req.user = users[0];

    // If role is student, attach student profile ID
    if (req.user.role === 'student') {
      const students = await query(
        'SELECT id, roll_number, department_id, first_name, last_name FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (students.length > 0) {
        req.student = students[0];
      }
    }

    // If role is company, attach company ID
    if (req.user.role === 'company') {
      const companies = await query(
        'SELECT id, name, status FROM companies WHERE user_id = ?',
        [req.user.id]
      );
      if (companies.length > 0) {
        req.company = companies[0];
      }
    }

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. This action requires one of the following roles: ${roles.join(', ')}`
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
