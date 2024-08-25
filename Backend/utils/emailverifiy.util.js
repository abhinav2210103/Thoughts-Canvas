const nodemailer = require('nodemailer');
require('dotenv').config();
const {mailTemplate} = require('../constants/mailTemplate')
const sendVerificationEmail = async (email, verificationLink , fullName) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const htmlcontent = mailTemplate(verificationLink,fullName);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email for Thoughts Canvas',
        html: htmlcontent,
        };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent.");
    } catch (err) {
        console.error("Error sending verification email:", err);
    }
};

module.exports = { sendVerificationEmail };
