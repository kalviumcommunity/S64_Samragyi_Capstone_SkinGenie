const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routineRoutes = require('./routes/routineRoutes');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const cors = require('cors'); 
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/routines', routineRoutes);
app.use('/api', userRoutes);
app.use('/quiz', quizRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});