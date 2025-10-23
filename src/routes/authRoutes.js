const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/rateLimiter')

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */

router.post(
    '/register',
    [
      body('username')
        .notEmpty().withMessage('Username is required')
        .isString().withMessage('Username must be a string'),
      body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
      body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin')
    ],
    authController.register
  );

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 *       400:
 *         description: Invalid credentials
 */

router.post('/login',loginLimiter, authController.login);
module.exports = router;