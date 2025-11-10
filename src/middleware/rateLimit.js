const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many login attempts. Please try again in 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
