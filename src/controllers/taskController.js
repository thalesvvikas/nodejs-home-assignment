const { validationResult } = require('express-validator');
const { Task, User } = require('../models'); 
const emailQueue = require('../queues/emailQueue')

exports.getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let userTaskStatus = {};

    if (req.user.role !== 'admin') {
      // Non-admin: filter by their own tasks
      userTaskStatus.userId = req.user.id;
    }

    if (status) {
      // Apply status filter for everyone
      userTaskStatus.status = status;
    }

    const { rows: tasks, count: totalTasks } = await Task.findAndCountAll({
      where: userTaskStatus,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      paranoid: false
    });

    res.json({
      page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      tasks,
    });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description,status, userId: req.user.id });

    // Fetch user's email
    const user = await User.findByPk(req.user.id);

    if (user && user.email) {
      // Add a job to email queue
      await emailQueue.add('taskCreated', {
        to: user.email,
        subject: 'New Task Created',
        text: `Your task "${task.title}" has been created.`,
      });
    }

    res.status(201).json(task);
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await task.update(req.body);

     // Fetch user's email
     const user = await User.findByPk(req.user.id);

     if (user && user.email) {
      // Add a job to email queue
      await emailQueue.add('taskUpdated', {
        to: user.email,
        subject: 'Task Updated',
        text: `Your task "${task.title}" has been updated.`,
      });
    }

    res.json(task);
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
};