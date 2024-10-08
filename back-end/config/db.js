const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

module.exports = dbConnection;
