const nodemailer = require('nodemailer');

// Configure the Ethereal transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'favian.bradtke74@ethereal.email',
        pass: '1aSePyMywTm42RmZbU'
    }
});

// Send OTP email
exports.sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: 'noreply@example.com', // Sender email (can be arbitrary)
        to: to, // Recipient email
        subject: 'Your OTP for Password Reset',
        text: `Your OTP for resetting your password is: ${otp}. It is valid for 10 minutes.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`); // Generate preview URL
    } catch (err) {
        console.error(`Error sending email: ${err.message}`);
        throw new Error('Email sending failed');
    }
};
