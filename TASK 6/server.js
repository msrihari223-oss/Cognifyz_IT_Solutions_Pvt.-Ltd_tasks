const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Protected test route
const { protect } = require('./middleware/authMiddleware');
app.get('/api/protected', protect, (req, res) => {
    res.json({
        success: true,
        message: 'You have accessed a protected route!',
        user: req.user
    });
});

// Basic route
app.get('/', (req, res) => {
    res.send('Hostel Management System API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
