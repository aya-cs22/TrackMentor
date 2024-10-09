const mongoose = require('mongoose');
// creat a schema for lesson
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  languageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
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

lessonSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
// creat and export lesson module
const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
