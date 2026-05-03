const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend files

// In-memory data store for tasks
let tasks = [
    { id: 1, title: 'Learn RESTful APIs', description: 'Understand how to create CRUD endpoints', status: 'completed' },
    { id: 2, title: 'Build Frontend', description: 'Create HTML/CSS/JS to interact with API', status: 'pending' },
];

let nextId = 3;

// --- RESTful API Endpoints ---

// 1. GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// 2. GET a single task by ID
app.get('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// 3. POST a new task (Create)
app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body;
    
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const newTask = {
        id: nextId++,
        title,
        description,
        status: 'pending'
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask); // 201 Created
});

// 4. PUT to update an existing task
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, status } = req.body;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        // Update fields if provided
        if (title !== undefined) tasks[taskIndex].title = title;
        if (description !== undefined) tasks[taskIndex].description = description;
        if (status !== undefined) tasks[taskIndex].status = status;
        
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// 5. DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const initialLength = tasks.length;
    
    tasks = tasks.filter(t => t.id !== taskId);
    
    if (tasks.length < initialLength) {
        res.status(204).send(); // 204 No Content (successful deletion)
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
