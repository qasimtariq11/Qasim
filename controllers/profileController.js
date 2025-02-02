const User = require('../models/User');

// Get User Profile (Authenticated Users)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();

        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
