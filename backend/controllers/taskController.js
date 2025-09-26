// controllers/taskController.js
const Task = require('../models/task');
const Lead = require('../models/lead');

const getTasks = async (req, res) => {
  try {
    const query = { assignedTo: req.user._id };
    const { view = 'list', startDate, endDate } = req.query;

    if (view === 'calendar') {
      if (startDate) query.dueDate = { $gte: new Date(startDate) };
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const tasks = await Task.find(query)
      .populate('leadId', 'customerName');

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { leadId, description, dueDate } = req.body;
    if (!leadId || !description || !dueDate) return res.status(400).json({ message: 'Required fields missing' });

    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (!await req.user.hasRole(['SUPERADMIN']) && !lead.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = new Task({
      ...req.body,
      assignedTo: req.user._id,
      createdBy: req.user._id
    });
    await task.save();

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.assignedTo.equals(req.user._id)) return res.status(403).json({ message: 'Not assigned to you' });

    Object.assign(task, req.body);
    await task.save();

    res.json({ message: 'Task updated', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markTaskComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.assignedTo.equals(req.user._id)) return res.status(403).json({ message: 'Not assigned to you' });

    task.status = 'Completed';
    await task.save();

    // Auto-log to lead interactions
    const lead = await Lead.findById(task.leadId);
    if (lead) {
      lead.interactions.push({
        type: 'note',
        details: `Task completed: ${task.description}`,
        createdBy: req.user._id
      });
      await lead.save();
    }

    res.json({ message: 'Task completed', task });
  } catch (error) {
    console.error('Mark complete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const rescheduleTask = async (req, res) => {
  try {
    const { newDueDate } = req.body;
    if (!newDueDate) return res.status(400).json({ message: 'New due date required' });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.assignedTo.equals(req.user._id)) return res.status(403).json({ message: 'Not assigned to you' });

    task.dueDate = new Date(newDueDate);
    task.status = 'Pending';
    await task.save();

    res.json({ message: 'Task rescheduled', task });
  } catch (error) {
    console.error('Reschedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.assignedTo.equals(req.user._id) && !await req.user.hasRole(['SUPERADMIN'])) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  markTaskComplete,
  rescheduleTask,
  deleteTask
};