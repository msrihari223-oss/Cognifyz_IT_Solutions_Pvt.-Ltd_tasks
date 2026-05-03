const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();

// Configure Passport Google Strategy
// Note: We check if the environment variables exist to prevent errors if not configured yet.
const clientID = process.env.GOOGLE_CLIENT_ID || 'dummy_client_id';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret';

passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // In a real application, you would find or create a user in your database here.
    // For this example, we simply pass the profile to the session.
    return cb(null, profile);
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// 1. Route to initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. Callback route Google redirects to after successful login
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to the API route to fetch external data.
    res.redirect('/api/data');
  }
);

// 3. Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
