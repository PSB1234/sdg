const mongoose = require('mongoose');
const crypto = require('crypto');

// Interaction sub-schema
const interactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['call', 'email', 'visit', 'note'], required: true },
  details: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});

// Comment sub-schema
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});

// Notification sub-schema
const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});

// Lead schema
const leadSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { 
    type: String, 
    lowercase: true, 
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] 
  },
  phoneNumber: { type: String },
  address: { type: String },
  productType: { 
    type: String, 
    enum: ['Home Loan', 'Car Loan', 'Credit Card', 'Personal Loan', 'Business Loan'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['New', 'In Progress', 'Converted', 'Dropped'], 
    default: 'New' 
  },
  priorityScore: { type: Number, min: 0, max: 100, default: 50 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  zone: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  customerDetails: {
    location: { type: String },
    creditScore: { type: Number },
    source: { type: String, enum: ['campaign', 'branch', 'online'] }
  },
  existingRelationship: { type: String },
  aadharCard: { type: String },
  loanAmount: { type: Number },
  creditScore: { type: Number },
  annualIncome: { type: Number },
  documents: [{ type: String }],
  interactions: [interactionSchema],
  comments: [commentSchema],
  notifications: [notificationSchema],
  aiRecommendations: {
    nextBestAction: { type: String },
    dropOffRisk: { type: Number, min: 0, max: 100 }
  },
  trackingToken: { type: String, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Removed required: true
  isCustomer: { type: Boolean, default: false } // flag to indicate customer lead
}, { timestamps: true });

// Update lastUpdated on save
leadSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Generate trackingToken if not present
leadSchema.pre('save', async function(next) {
  if (!this.trackingToken) {
    this.trackingToken = crypto.randomBytes(16).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema);
