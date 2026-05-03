require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Sessions (Required for Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key_change_me',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
    res.send(`
        <h1>API Integration Project</h1>
        <p>Requirements met:</p>
        <ul>
            <li>OAuth Authentication</li>
            <li>External API Integration</li>
            <li>Rate Limiting & Error Handling</li>
        </ul>
        <a href="/auth/google">Login with Google</a>
    `);
});

// Global Error Handler Middleware
// This must be the last middleware added!
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
