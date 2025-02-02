const express = require('express');
const { getReports } = require('../controllers/reportsController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getReports); // Get reports

module.exports = router;
