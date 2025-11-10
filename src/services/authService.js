const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.register = async (username, password, role = 'user') => {
  const existing = await User.findOne({ where: { username } });
  if (existing) throw new Error('Username already exists');
  const newUser = await User.create({ username, password, role });
  const { password: _, ...safeUser } = newUser.toJSON();
  return safeUser;
};

exports.login = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (!user) throw new Error('User not found');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, role: user.role };
};
