const express = require('express');
const languageController = require('../controllers/languageController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Create a new language
router.post('/', authenticate, languageController.createLanguage);

// Get all languages
router.get('/', languageController.getAllLanguages);

// Get a single language by ID
router.get('/:id', languageController.getLanguageById);
// Get languages by track ID
router.get('/track/:trackId', languageController.getLanguagesByTrackId);

// Update a language by ID
router.put('/:id', authenticate, languageController.updateLanguageById);

// Delete a language
router.delete('/:id', authenticate, languageController.deleteLanguageById);


module.exports = router;
