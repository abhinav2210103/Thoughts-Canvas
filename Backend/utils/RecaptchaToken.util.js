const axios = require('axios');

async function verifyRecaptchaToken(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    throw new Error('RECAPTCHA_SECRET_KEY is not set in environment variables.');
  }
  const formData = `secret=${secretKey}&response=${token}`;
  const response = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  console.log(response.data);
  return response.data;
}

module.exports = {
  verifyRecaptchaToken,
};
