const { validateToken } = require('../services/authentication');

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
      next();
    } catch (error) {
      console.error('Invalid Token:', error);
      return res.status(401).json({ message: 'Invalid Token' });
    }
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
