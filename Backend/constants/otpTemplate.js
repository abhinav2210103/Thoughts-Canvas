const otpTemplate = (otp, fullName) => `
  <div>
    <p>Hello ${fullName},</p>
    <p>We received a request to reset your password. Use the following OTP to proceed with resetting your password:</p>
    <h1>${otp}</h1>
    <p>If you did not request this change, please ignore this email.</p>
    <p>Thank you!</p>
    <p>Team Opinio</p>
  </div>
`;

module.exports = { otpTemplate };
