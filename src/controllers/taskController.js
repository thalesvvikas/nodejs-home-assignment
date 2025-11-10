const { validationResult } = require('express-validator');
const { Task } = require('../models');

exports.getTasks = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, status = 'pending', userId } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const where = {};

    if (req.user.role === 'admin') {
      if (userId) where.userId = userId;
    } else {
      where.userId = req.user.id;
    }

    if (status) where.status = status;

    const [tasks, total] = await Promise.all([
      Task.findAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        attributes: [
          'id',
          'title',
          'description',
          'status',
          'userId',
          'createdAt',
        ],
      }),
      Task.count({ where }),
    ]);

    res.status(200).json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      tasks,
    });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { title, description } = req.body;
    const task = await Task.create({ title, description, userId: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

exports.SoftDelete = async (req, res) => {
  const task = await Task.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.status = 'deleted';
  task.deletedAt = new Date();
  await task.save();

  res.json({ message: 'Task Deleted', task });
};
