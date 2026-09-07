const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/overview', authenticateToken, requireRole('admin'), analyticsController.getPlacementOverview);
router.get('/departments', authenticateToken, requireRole('admin'), analyticsController.getDepartmentStats);
router.get('/top-skills', authenticateToken, requireRole('admin'), analyticsController.getSkillDemandStats);
router.get('/companies', authenticateToken, requireRole('admin'), analyticsController.getCompanyFunnelStats);
router.get('/trends', authenticateToken, requireRole('admin'), analyticsController.getMonthlyTrends);

module.exports = router;
