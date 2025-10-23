const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'done'),
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['pending', 'in-progress', 'done']],
        msg: 'Status must be one of: pending, in-progress, done'
      }
    }
  },
}, {
  paranoid: true, // Enables soft delete
  timestamps: true,
  deletedAt: 'deletedAt',
});

Task.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;