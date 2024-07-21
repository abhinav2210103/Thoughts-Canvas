const nodemailer = require('nodemailer');
require('dotenv').config();

const sendVerificationEmail = async (email, verificationLink) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `<p>Hello,</p>
               <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
               <a href="${verificationLink}">Verify Email</a>
               <p>If you did not sign up for this account, please ignore this email.</p>
               <p>Best regards,<br>Team Thoughts Canvas</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent.");
    } catch (err) {
        console.error("Error sending verification email:", err);
    }
};

module.exports = { sendVerificationEmail };
