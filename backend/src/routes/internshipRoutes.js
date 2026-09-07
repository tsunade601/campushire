const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const applicationController = require('../controllers/applicationController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { applyValidation, internshipCreateValidation } = require('../validators');

// Public / Authenticated discovery
router.get('/', internshipController.listInternships);
router.get('/:id', (req, res, next) => {
  // Optional auth to attach user's application state
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, () => internshipController.getInternshipDetails(req, res, next));
  }
  return internshipController.getInternshipDetails(req, res, next);
});

// Student application
router.post('/:id/apply', authenticateToken, applyValidation, applicationController.apply);

// Admin / Recruiter management
router.post('/', authenticateToken, requireRole('admin', 'company'), internshipCreateValidation, internshipController.createInternship);
router.put('/:id', authenticateToken, requireRole('admin', 'company'), internshipController.updateInternship);
router.delete('/:id', authenticateToken, requireRole('admin'), internshipController.deleteInternship);

module.exports = router;
