const Track = require('../models/track');
const { body, validationResult } = require('express-validator'); 

// Create a new track
exports.createTrack = [
  body('name').notEmpty().withMessage('Name is required'),
  async (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    try {
      const newTrack = new Track(req.body);
      await newTrack.save();
      res.status(201).json(newTrack);
    } catch (error) {
      console.error('Error creating track:', error); 
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Read all tracks
exports.getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.find();
    res.status(200).json(tracks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message }); 
  }
};

// Read tracks by id
exports.getTrackById = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    res.status(200).json(track);
  } catch (error) {
    console.error('Error fetching track:', error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update track by ID
exports.updateTrackById = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'), 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    try {
      const updatedTrack = await Track.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedTrack) {
        return res.status(404).json({ message: 'Track not found' });
      }
      res.status(200).json(updatedTrack); 
    } catch (error) {
      console.error('Error updating track:', error.message); 
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Delete track by id
exports.deleteTrackById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const deleteTrack = await Track.findByIdAndDelete(req.params.id);
    if (!deleteTrack) {
      return res.status(404).json({ message: 'Track not found' });
    }
    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Error deleting track:', error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
