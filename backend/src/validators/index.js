const { body, query: queryParam, param, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed for request parameters.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
}

const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid university or official email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('first_name').trim().notEmpty().withMessage('First name is required.'),
  body('last_name').trim().notEmpty().withMessage('Last name is required.'),
  body('roll_number').trim().notEmpty().withMessage('University roll number is required.'),
  body('department_id').isInt({ min: 1 }).withMessage('Valid department ID is required.'),
  body('batch_year').isInt({ min: 2020, max: 2035 }).withMessage('Valid graduation batch year is required.'),
  body('cgpa').isFloat({ min: 0.0, max: 10.0 }).withMessage('CGPA must be between 0.00 and 10.00.'),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
  body('password').notEmpty().withMessage('Password cannot be empty.'),
  handleValidationErrors
];

const applyValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid internship ID is required.'),
  body('cover_letter').optional().isString().trim(),
  body('resume_url').optional().isString().trim(),
  handleValidationErrors
];

const internshipCreateValidation = [
  body('company_id').isInt({ min: 1 }).withMessage('Valid company ID is required.'),
  body('title').trim().notEmpty().withMessage('Internship title is required.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('location').trim().notEmpty().withMessage('Location is required.'),
  body('work_mode').isIn(['On-site', 'Remote', 'Hybrid']).withMessage('Work mode must be On-site, Remote, or Hybrid.'),
  body('duration_weeks').isInt({ min: 1 }).withMessage('Duration in weeks must be positive.'),
  body('stipend_amount').isFloat({ min: 0 }).withMessage('Stipend amount must be >= 0.'),
  body('openings').isInt({ min: 1 }).withMessage('Openings must be >= 1.'),
  body('deadline').isISO8601().toDate().withMessage('Valid deadline date required.'),
  body('start_date').isISO8601().toDate().withMessage('Valid start date required.'),
  body('end_date').isISO8601().toDate().withMessage('Valid end date required.'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  applyValidation,
  internshipCreateValidation
};
