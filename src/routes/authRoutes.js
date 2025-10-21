const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', [body('username').notEmpty(), body('password').isLength({ min: 5 })], authController.register);
router.post('/login', authController.login);
module.exports = router;