const express = require('express');
const { submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/submit', authMiddleware, submitFeedback); // Any logged-in user can submit feedback
router.get('/all', authMiddleware, adminMiddleware, getAllFeedbacks); // Only admins can view all feedback

module.exports = router;
