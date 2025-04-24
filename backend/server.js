const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routineRoutes = require('./routes/routineRoutes');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/routines', routineRoutes);
app.use('/api', userRoutes);
app.use('/quiz', quizRoutes);
app.use('/products', productRoutes);

const PORT = process.env.PORT || 8000;
const secret = process.env.JWT_SECRET;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
