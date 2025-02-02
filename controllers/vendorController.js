const Vendor = require('../models/Vendor');

// Add New Vendor (Any Authenticated User)
exports.addVendor = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const existingVendor = await Vendor.findOne({ email });

        if (existingVendor) {
            return res.status(400).json({ message: 'Vendor already exists' });
        }

        const newVendor = await Vendor.create({ name, email, phone, address });
        res.status(201).json({ success: true, vendor: newVendor });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// Get All Vendors (Admin Only)
exports.getVendors = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }

        const vendors = await Vendor.find();
        res.status(200).json({ success: true, vendors });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// Get Vendor By ID (Any Authenticated User)
exports.getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        res.status(200).json({ success: true, vendor });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};

// Delete Vendor (Admin Only)
exports.deleteVendor = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }

        const vendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        res.status(200).json({ success: true, message: 'Vendor deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};
