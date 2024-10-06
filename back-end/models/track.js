const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field before saving
trackSchema.pre('save', function (next) {
  if (!this.isNew) { 
    this.updatedAt = Date.now();
  }
  next();
});

// Create and export Track model
const Track = mongoose.model('Track', trackSchema);
module.exports = Track;
