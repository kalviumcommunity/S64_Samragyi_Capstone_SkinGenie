const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Remove deprecated options
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
module.exports = connectDB;
