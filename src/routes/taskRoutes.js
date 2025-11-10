const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', taskController.getTasks);
router.post('/', [body('title').notEmpty()], taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.delete('/softdelete/:id', taskController.SoftDelete);
module.exports = router;
