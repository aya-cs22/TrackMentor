const mongoose = require('mongoose');
// creat a schema for Languages
const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tracks'
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
languageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
// creat and export lesson module
const Language = mongoose.model('Language', languageSchema);
module.exports = Language;
