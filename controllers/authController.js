const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/email');

// Store invalidated tokens (For real-world apps, use Redis)
const blacklistedTokens = new Set();

// Generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        // Prevent unauthorized admin creation
        const userCount = await User.countDocuments();
        const adminFlag = userCount === 0 ? true : isAdmin || false;

        const user = await User.create({ name, email, password, isAdmin: adminFlag });

        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Account already exists with this email' });
        }

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ success: false, error: messages });
        }

        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ success: true, token, isAdmin: user.isAdmin });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Promote User to Admin (Admin Only)
exports.promoteToAdmin = async (req, res) => {
    try {
        const { email } = req.body;

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isAdmin = true;
        await user.save();

        res.status(200).json({ message: `${user.name} is now an admin.` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        // Generate OTP and set expiry
        const otp = generateOtp();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        user.resetToken = otp;
        user.resetTokenExpiry = otpExpiry;
        await user.save();

        await sendOtpEmail(user.email, otp);

        res.status(200).json({ success: true, message: 'OTP sent to your email.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to send OTP. Please try again later.' });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (user.resetToken !== otp || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        user.isOtpVerified = true;
        await user.save();

        res.status(200).json({ success: true, message: 'OTP verified successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'OTP verification failed. Please try again.' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (!user.isOtpVerified) {
            return res.status(400).json({ success: false, error: 'You must verify OTP before resetting your password.' });
        }

        user.password = password;
        user.isOtpVerified = false;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Password reset failed.' });
    }
};

// Logout (Blacklisting JWT Token)
exports.logout = (req, res) => {
    try {
        const token = req.header('Authorization');
        if (token) {
            blacklistedTokens.add(token);
        }
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging out' });
    }
};
