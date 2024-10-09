const express = require("express");
const trackController = require('../controllers/trackController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Create a new track
router.post('/', authenticate, trackController.createTrack);
// Read all tracks
router.get('/', trackController.getAllTracks);
// Read a single track by ID
router.get('/:id', trackController.getTrackById);
// Update a track by ID
router.put('/:id', authenticate, trackController.updateTrackById);
// Delete a track by ID
router.delete('/:id', authenticate, trackController.deleteTrackById);

module.exports = router;
