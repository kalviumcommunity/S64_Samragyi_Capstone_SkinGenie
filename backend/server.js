const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routineRoutes = require('./routes/routineRoutes');  // Import the routine routes
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
dotenv.config();  // Load environment variables
connectDB();  // Connect to the database
const app = express();
app.use(express.json());  // Middleware to parse JSON bodies
app.use('/api/routines', routineRoutes);  // Use the routine routes
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
