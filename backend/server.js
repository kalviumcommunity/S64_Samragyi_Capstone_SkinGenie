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
const passwordResetRoutes = require('./routes/passwordResetRoutes'); // Import password reset routes
const routineTrackerRoutes = require('./routes/routineTrackerRoutes'); // Import routine tracker routes
const cors = require('cors');

// Load environment variables
connectDB();

// Initialize express app
const app = express();

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:5173', 'https://coruscating-crostata-b02083.netlify.app'],
    credentials: true, // Allow cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Add additional CORS headers for troubleshooting
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    next();
});

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

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running correctly',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/auth', authRoutes); // Add authentication routes
app.use('/routines', routineRoutes);
app.use('/api', userRoutes);
app.use('/quiz', quizRoutes);
app.use('/products', productRoutes);
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/api', uploadRoutes); // File upload route
app.use('/api/comments', commentRoutes); // Add comment routes
app.use('/api/password-reset', passwordResetRoutes); // Add password reset routes
app.use('/api/routine-tracker', routineTrackerRoutes); // Add routine tracker routes

// Start the server
const PORT = process.env.PORT || 8000;
const secret = process.env.JWT_SECRET;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); 
});



