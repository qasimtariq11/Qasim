const express = require('express');
const { getBillingInfo } = require('../controllers/billingController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getBillingInfo); // Get billing info

module.exports = router;
