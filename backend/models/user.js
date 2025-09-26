const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  age: { type: Number, required: true, min: 1, max: 120 },
  password: { type: String, required: function() { return !this.googleId; }, minlength: 6 },
  googleId: { type: String },
  refreshTokens: [{
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 604800 } // expires after 7 days
  }],
  roles: [{ type: String, uppercase: true }], // Store roles as strings
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Number }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false; // No password set for OAuth users
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasRole = function(roles) {
  return this.roles.some(role => roles.includes(role));
};

userSchema.methods.getAllPermissions = function() {
  const { DEFAULT_ROLES } = require('../config/roles');
  const permissions = this.roles.reduce((perms, role) => {
    if (role === 'SUPERADMIN') return ['*'];
    return [...perms, ...(DEFAULT_ROLES[role]?.permissions || [])];
  }, []);
  return [...new Set(permissions)]; // Remove duplicates
};

userSchema.methods.incLoginAttempts = async function() {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 3600000; // Lock for 1 hour
  }
  await this.save();
};

userSchema.methods.resetLoginAttempts = async function() {
  this.loginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model('User', userSchema);