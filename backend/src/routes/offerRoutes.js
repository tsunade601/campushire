const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', authenticateToken, offerController.listOffers);
router.post('/', authenticateToken, requireRole('admin', 'company'), offerController.createOffer);
router.patch('/:id/respond', authenticateToken, offerController.respondToOffer);

module.exports = router;
