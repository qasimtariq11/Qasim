const express = require('express');
const { addVendor, getVendors, getVendorById, deleteVendor } = require('../controllers/vendorController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, addVendor); // Any authenticated user can add a vendor
router.get('/', authMiddleware, adminMiddleware, getVendors); // Only admins can get all vendors
router.get('/:id', authMiddleware, getVendorById); // Any authenticated user can view a vendor by ID
router.delete('/:id', authMiddleware, adminMiddleware, deleteVendor); // Only admins can delete vendors

module.exports = router;
