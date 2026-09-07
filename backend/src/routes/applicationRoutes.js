const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, applicationController.listApplications);
router.get('/:id', authenticateToken, applicationController.getApplicationDetails);
router.patch('/:id/status', authenticateToken, requireRole('admin', 'company'), applicationController.updateStatus);

module.exports = router;
