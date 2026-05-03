const express = require('express');
const app = express();
const port = 3001;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Specify views directory explicitly

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Temporary in-memory storage array
const submissions = [];

// GET endpoint to render the registration form
app.get('/', (req, res) => {
    res.render('index', { errors: [], formData: {} });
});

// POST endpoint to handle form submission with server-side validation
app.post('/submit', (req, res) => {
    const { fullName, email, password, confirmPassword, age, terms } = req.body;
    let errors = [];

    // Server-Side Validation Rules
    if (!fullName || fullName.trim().length < 3) {
        errors.push("Full Name is required and must be at least 3 characters long.");
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push("A valid email address is required.");
    }

    if (!password || password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }

    if (password !== confirmPassword) {
        errors.push("Passwords do not match.");
    }

    if (!age || isNaN(age) || age < 18) {
        errors.push("You must be at least 18 years old.");
    }

    if (terms !== 'on') {
        errors.push("You must agree to the Terms and Conditions.");
    }

    if (errors.length > 0) {
        // If invalid, render form again with error messages and previously entered data
        return res.render('index', { 
            errors, 
            formData: { fullName, email, age } // Don't send back passwords
        });
    }

    // If valid, store the data
    const newSubmission = {
        id: Date.now(),
        fullName,
        email,
        age,
        timestamp: new Date().toLocaleString()
    };
    
    submissions.push(newSubmission);

    // Redirect to the submissions page
    res.redirect('/submissions');
});

// GET endpoint to display all submissions
app.get('/submissions', (req, res) => {
    res.render('result', { submissions });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
