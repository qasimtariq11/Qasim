exports.getReports = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'Reports retrieved successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
