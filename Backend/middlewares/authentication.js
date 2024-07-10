const { validateToken } = require('../services/authentication');

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
      next();
    } catch (error) {
      console.error('Invalid Token:', error);
      return next();
    }
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
