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
googleId: { type: String }  ,// Optionally store Google profile ID
  refreshTokens: [{
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 604800 } // expires after 7 days
  }]
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

module.exports = mongoose.model('User', userSchema);
