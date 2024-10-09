const express = require('express');
const quizController = require('../controllers/quizController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Create a new quiz
router.post('/', authenticate, quizController.createQuiz);

// Get all quizzes
router.get('/', quizController.getAllQuizzes);

// Get quizzes by lesson ID
router.get('/lessons/:lessonId', quizController.getQuizzesByLessonId);

// Update a quiz by ID
router.put('/:id', authenticate, quizController.updateQuizById);

// Delete a quiz by ID
router.delete('/:id', authenticate, quizController.deleteQuizById);

module.exports = router;
