const sequelize = require('../config/db');
const User = require('./user');
const Task = require('./task');
module.exports = {
  sequelize,
  User,
  Task,
};
