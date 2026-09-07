const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/me', authenticateToken, studentController.getProfile);
router.put('/me', authenticateToken, studentController.updateProfile);
router.get('/dashboard', authenticateToken, studentController.getDashboard);
router.get('/skills', authenticateToken, studentController.getSkills);
router.post('/skills', authenticateToken, studentController.addSkill);
router.delete('/skills/:skillId', authenticateToken, studentController.removeSkill);

// Admin route
router.get('/', authenticateToken, requireRole('admin'), studentController.listAllStudents);
router.get('/:id', authenticateToken, requireRole('admin'), studentController.getProfile);

module.exports = router;
