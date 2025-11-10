const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimit');

router.post(
  '/register',
  [body('username').notEmpty(), body('password').isLength({ min: 5 })],
  authController.register
);
router.post('/login', loginLimiter, authController.login);
module.exports = router;
