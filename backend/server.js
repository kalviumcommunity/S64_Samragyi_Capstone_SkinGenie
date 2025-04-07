const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routineRoutes = require('./routes/routineRoutes');  // Import the routine routes
dotenv.config();  // Load environment variables
connectDB();  // Connect to the database
const app = express();
app.use(express.json());  // Middleware to parse JSON bodies
app.use('/api/routines', routineRoutes);  // Use the routine routes
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
