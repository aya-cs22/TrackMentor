const express = require('express');
const lessonController = require('../controllers/lessonController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Create a new lesson
router.post('/', authenticate, lessonController.createLesson);

// Get all lessons
router.get('/', lessonController.getAllLessons);

// Get a single lesson by ID
router.get('/:id', lessonController.getLessonById);

// Get lessons by language ID
router.get('/language/:languageId', lessonController.getLessonsByLanguageId);

// Update a lesson by ID
router.put('/:id', authenticate, lessonController.updateLessonById);

// Delete a lesson by ID
router.delete('/:id', authenticate, lessonController.deleteLessonById);

module.exports = router;
