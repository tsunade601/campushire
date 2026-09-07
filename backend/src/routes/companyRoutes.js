const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', companyController.listCompanies);
router.get('/:id', companyController.getCompanyDetails);
router.post('/', authenticateToken, requireRole('admin'), companyController.createCompany);
router.put('/:id', authenticateToken, requireRole('admin', 'company'), companyController.updateCompany);

module.exports = router;
