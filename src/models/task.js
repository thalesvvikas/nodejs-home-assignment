const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'done', 'deleted'),
    defaultValue: 'pending',
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Task.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;
