exports.getBillingInfo = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'Billing information retrieved successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};
