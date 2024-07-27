const JWT = require('jsonwebtoken');
const secret = process.env.SECRET_KEY_TOKEN;

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
