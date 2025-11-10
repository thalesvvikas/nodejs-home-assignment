const { validationResult } = require('express-validator');
const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { username, password, role } = req.body;
    const user = await authService.register(username, password, role);
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
