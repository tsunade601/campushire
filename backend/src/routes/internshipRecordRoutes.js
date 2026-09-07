const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/internshipRecordController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, recordsController.listRecords);
router.patch('/:id/status', authenticateToken, requireRole('admin'), recordsController.updateRecordStatus);

module.exports = router;
