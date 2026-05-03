const express = require('express');
const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies (for form submission)
app.use(express.urlencoded({ extended: true }));

// GET endpoint to render the form
app.get('/', (req, res) => {
    res.render('index');
});

// POST endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;
    // Render the result page with the submitted data dynamically
    res.render('result', { name, email, message });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
