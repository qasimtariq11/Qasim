const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getProfile); // Get user profile
router.put('/update', authMiddleware, updateProfile); // Update profile

module.exports = router;
