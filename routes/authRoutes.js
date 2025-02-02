const express = require('express');
const {
    signup,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword,
    promoteToAdmin,
    logout,
} = require('../controllers/authController');

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/promote', authMiddleware, adminMiddleware, promoteToAdmin);
router.post('/logout', logout);

module.exports = router;
