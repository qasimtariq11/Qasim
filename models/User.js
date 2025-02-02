const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address',
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: function (value) {
                return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
            },
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        },
    },
    isAdmin: {
        type: Boolean,
        default: false, // Default to regular user; can be set manually in the database
    },
    resetToken: String,
    resetTokenExpiry: Date,
    isOtpVerified: { type: Boolean, default: false },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Exclude sensitive fields in JSON response
userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.resetToken;
        delete ret.resetTokenExpiry;
        return ret;
    },
});

module.exports = mongoose.model('User', userSchema);
