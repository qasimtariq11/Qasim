const Feedback = require('../models/Feedback');

// ✅ Submit Feedback (Any Authenticated User)
exports.submitFeedback = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ success: false, message: 'Feedback message cannot be empty' });
        }

        const feedback = await Feedback.create({ user: req.user.id, message });
        res.status(201).json({ success: true, feedback });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// ✅ Get All Feedbacks (Admin Only)
exports.getAllFeedbacks = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }

        const feedbacks = await Feedback.find().populate('user', 'name email');
        res.status(200).json({ success: true, feedbacks });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};
