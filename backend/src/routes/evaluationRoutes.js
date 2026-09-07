const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/record/:recordId', authenticateToken, evaluationController.getEvaluationByRecord);
router.post('/', authenticateToken, requireRole('admin', 'company'), evaluationController.createEvaluation);

module.exports = router;
