const express = require('express');
const axios = require('axios');
const rateLimiter = require('../middlewares/rateLimiter');
const router = express.Router();

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    // If the user is logged in (via Passport session), proceed.
    if (req.isAuthenticated()) {
        return next();
    }
    // If not, redirect to home or send a 401 Unauthorized
    res.status(401).json({ error: "Unauthorized. Please login via /auth/google first." });
}

// Protected route with Rate Limiting and External API integration
// We apply the rateLimiter specifically to this endpoint to prevent abuse
router.get('/data', rateLimiter, isAuthenticated, async (req, res, next) => {
    try {
        // Integrate an external API
        // Here we use JSONPlaceholder as a reliable, free example API
        const externalApiUrl = 'https://jsonplaceholder.typicode.com/users';
        
        const response = await axios.get(externalApiUrl);
        
        res.json({
            message: "Successfully fetched data from external API!",
            user: req.user.displayName, // Extracted from OAuth profile
            data: response.data
        });
    } catch (error) {
        // Pass the error to our Global Error Handler
        // We can add custom error context here if needed
        error.customMessage = "Failed to fetch data from the external API.";
        next(error);
    }
});

// A route deliberately designed to fail, to test error handling
router.get('/error-test', (req, res, next) => {
    const err = new Error("This is a simulated error to test the global error handler.");
    err.status = 500;
    next(err);
});

module.exports = router;
