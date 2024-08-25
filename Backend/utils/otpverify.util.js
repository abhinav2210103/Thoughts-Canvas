const nodemailer = require('nodemailer');
require('dotenv').config();
const { otpTemplate } = require('../constants/otpTemplate');

const sendPasswordResetEmail = async (email, otp, fullName) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlcontent = otpTemplate(otp, fullName);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP for Thoughts Canvas',
        html: htmlcontent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent.");
    } catch (err) {
        console.error("Error sending password reset email:", err);
    }
};

module.exports = { sendPasswordResetEmail };
