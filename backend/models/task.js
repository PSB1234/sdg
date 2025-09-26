// models/task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Overdue'], default: 'Pending' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reminders: [{ type: Date }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Auto-update status if overdue
taskSchema.pre('save', function(next) {
  if (this.dueDate < Date.now() && this.status === 'Pending') {
    this.status = 'Overdue';
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);