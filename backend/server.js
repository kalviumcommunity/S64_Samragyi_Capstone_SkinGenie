const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('./config/passport'); // Import passport
const session = require('express-session'); // For session handling
const connectDB = require('./config/db'); // Database connection
const routineRoutes = require('./routes/routineRoutes');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const productRoutes = require('./routes/productRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const uploadRoutes = require('./routes/upload');
const cors = require('cors');

// Load environment variables
connectDB();

// Initialize express app
const app = express();

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the frontend
    credentials: true, // Allow cookies and credentials
}));

// Middleware
app.use(express.json());

// Session Middleware (required for Passport)
app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: 'localhost', // 👈 Add this line
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
      },
    })
  );
  
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Load Passport Configuration
require('./config/passport'); // Assuming you created a passport.js file in the config folder

// Routes
app.use('/auth', authRoutes); // Add authentication routes
app.use('/routines', routineRoutes);
app.use('/api', userRoutes);
app.use('/quiz', quizRoutes);
app.use('/products', productRoutes);
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/api', uploadRoutes); // File upload route
app.use('/api/comments', commentRoutes); // Add comment routes

// Start the server
const PORT = process.env.PORT || 8000;
const secret = process.env.JWT_SECRET;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); 
});