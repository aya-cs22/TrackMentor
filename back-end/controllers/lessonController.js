const Lesson = require('../models/lessons');

// Create a new lesson
exports.createLesson = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const newLesson = new Lesson(req.body);
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all lessons
exports.getAllLessons = async(req, res) => {
  try{
    const lessons = await Lesson.find();
    res.status(200).json(lessons);
  }catch(error){
    console.log(error);
    res.status(500).json({message: 'server error'});
  }
};

// Get a single lesson by ID
exports.getLessonById = async(req, res) => {
  try{
    const lesson = await Lesson.findById(req.params.id);
    if(!lesson){
        res.status(404).json({message: 'lesson not found'});
    }
    res.status(200).json(lesson);
  }catch(error){
    console.log(error);
    res.status(500).json({message : 'server error'});
  }
};

// Get lessons by language ID
exports.getLessonsByLanguageId = async (req, res) => {
  try {
      const { languageId } = req.params; 
      const lessons = await Lesson.find({ languageId });

      if (!lessons || lessons.length === 0) {
          return res.status(404).json({ message: 'No lessons found for this language.' });
      }

      return res.status(200).json(lessons);
  } catch (error) {
      console.error('Error fetching lessons:', error);
      return res.status(500).json({ message: 'Server error' });
  }
};



// Update a lesson by ID
exports.updateLessonById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(200).json(lesson);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete a lesson by ID
exports.deleteLessonById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deleteLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deleteLesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
