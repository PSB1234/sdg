// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  markTaskComplete,
  rescheduleTask,
  deleteTask
} = require('../controllers/taskController');
const { authenticateToken, requirePermission } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', requirePermission('task:read'), getTasks);
router.post('/', requirePermission('task:write'), createTask);
router.put('/:id', requirePermission('task:write'), updateTask);
router.patch('/:id/complete', requirePermission('task:write'), markTaskComplete);
router.patch('/:id/reschedule', requirePermission('task:write'), rescheduleTask);
router.delete('/:id', requirePermission('task:delete'), deleteTask);

module.exports = router;