const mongoose = require('mongoose');
const Course = require('../models/Course');
const seedData = require('../utils/seedData');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Local MongoDB not detected on port 27017. Starting embedded MongoDB Memory Server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`Embedded MongoDB Connected: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`MongoDB Error: ${memErr.message}`);
      process.exit(1);
    }
  }

  try {
    const Lesson = require('../models/Lesson');
    const lessonCount = await Lesson.countDocuments();
    const hasLongDash = await Course.exists({ title: /[—–]/ });
    if (lessonCount < 20 || hasLongDash) {
      console.log('Seeding full 12-session IC3 Spark & IC3 GS6 (Level 1, 2, 3) curriculum, lessons, chat, and mock exams...');
      await seedData(false);
    }
  } catch (seedErr) {
    console.error('Auto-seed error:', seedErr.message);
  }
};

module.exports = connectDB;
