const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, interviewController.listInterviews);
router.post('/', authenticateToken, requireRole('admin', 'company'), interviewController.scheduleInterview);
router.patch('/:id/result', authenticateToken, requireRole('admin', 'company'), interviewController.updateInterviewResult);

module.exports = router;
