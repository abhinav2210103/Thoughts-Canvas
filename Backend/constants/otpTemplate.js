const otpTemplate = (otp, fullName) => `
  <div>
    <p>Hello ${fullName},</p>
    <p>We received a request to reset your password. Use the following OTP to proceed with resetting your password:</p>
    <h2>${otp}</h2>
    <p>If you did not request this change, please ignore this email.</p>
    <p>Thank you!</p>
  </div>
`;

module.exports = { otpTemplate };
