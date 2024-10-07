const Language = require('../models/languages');
// Create a new language
exports.createLanguage = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newLanguage = new Language(req.body);
    await newLanguage.save();
    res.status(201).json(newLanguage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Read all languages
exports.getAllLanguages = async(req, res) => {
  try {
    const languages = await Language.find();
    res.status(200).json(languages);
  } catch(error){
    console.log(error);
    res.status(500).json({message: 'server error'});
  }
};

// Read a single language by ID
exports.getLanguageById = async(req, res) => {
  try{
    const language = await Language.findById(req.params.id);
    if(!language){
        return res.status(404).json({message: 'track not found'});
    }
    res.status(200).json(language);
  }catch(error){
    console.log(error);
    res.status(500).json({message: 'serrver error'})
  }
};

exports.getLanguagesByTrackId = async (req, res) => {
  try {
      const trackId = req.params.trackId;
      const languages = await Language.find({ trackId: trackId });

      if (languages.length === 0) {
          return res.status(200).json([]); 
      }

      res.status(200).json(languages);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};

// Update a language by ID
exports.updateLanguageById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const language = await Language.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }
    res.status(200).json(language);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a language by ID
exports.deleteLanguageById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deleteLanguage = await Language.findByIdAndDelete(req.params.id);
    if (!deleteLanguage) {
      return res.status(404).json({ message: 'Language not found' });
    }
    res.status(200).json({ message: 'Language deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
