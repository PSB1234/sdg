// models/lead.js
const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['call', 'email', 'visit', 'note'], required: true },
  details: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  productType: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New', 'In Progress', 'Converted', 'Dropped'], 
    default: 'New' 
  },
  priorityScore: { type: Number, min: 0, max: 100, default: 50 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  zone: { type: String }, // For nodal officers/super admins
  lastUpdated: { type: Date, default: Date.now },
  customerDetails: {
    location: { type: String },
    creditScore: { type: Number },
    source: { type: String, enum: ['campaign', 'branch', 'online'] }
  },
  documents: [{ type: String }], // Array of document URLs or names
  interactions: [interactionSchema],
  comments: [commentSchema],
  aiRecommendations: {
    nextBestAction: { type: String },
    dropOffRisk: { type: Number, min: 0, max: 100 }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Update lastUpdated on save
leadSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Lead', leadSchema);