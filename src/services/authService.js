const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const emailQueue = require('../queues/emailQueue')

exports.register = async (username, password, email, role = 'user') => {
  const existing = await User.findOne({ where: { username } });
  if (existing) throw new Error('Username already exists');

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) throw new Error('Email already exists');

  if (!['user', 'admin'].includes(role)) {
    throw new Error('Invalid role');
  }
  const user = await User.create({ username, password, email, role });

  // Add a job to email queue
  if (user.email) {
    await emailQueue.add('userRegistered', {
      to: user.email,
      subject: 'Welcome to Task Manager!',
      text: `Hi ${user.username},\n\nThank you for registering. Your account has been successfully created.`,
    });
  }

  return user;
};

exports.login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error('User not found');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role  },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
};