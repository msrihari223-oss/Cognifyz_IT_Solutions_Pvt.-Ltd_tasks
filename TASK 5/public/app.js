const API_URL = '/api/tasks';
let currentMode = 'add'; // 'add' or 'edit'

// DOM Elements
const taskGrid = document.getElementById('taskGrid');
const loader = document.getElementById('loader');
const modal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const statusGroup = document.getElementById('statusGroup');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', fetchTasks);

// 1. READ (Fetch all tasks)
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        
        const tasks = await response.json();
        renderTasks(tasks);
        updateStats(tasks);
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        loader.style.display = 'none';
    }
}

// 2. CREATE (Add a new task)
async function addTask(taskData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        await fetchTasks(); // Refresh list
        closeModal();
        showToast('Task created successfully!');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// 3. UPDATE (Edit an existing task)
async function updateTask(id, taskData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        await fetchTasks(); // Refresh list
        closeModal();
        showToast('Task updated successfully!');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// 4. DELETE (Remove a task)
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        
        await fetchTasks(); // Refresh list
        showToast('Task deleted successfully!');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Form Submission Handler
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const status = document.getElementById('taskStatus').value;
    
    const taskData = { title, description };
    
    if (currentMode === 'add') {
        addTask(taskData);
    } else {
        taskData.status = status;
        updateTask(id, taskData);
    }
});

// UI Helpers
function renderTasks(tasks) {
    taskGrid.innerHTML = '';
    
    if (tasks.length === 0) {
        taskGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No tasks found. Click "New Task" to create one.</div>';
        return;
    }
    
    tasks.forEach(task => {
        const isCompleted = task.status === 'completed';
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <div class="task-header">
                <h3 class="task-title" style="${isCompleted ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${task.title}</h3>
                <span class="status-badge status-${task.status}">${task.status}</span>
            </div>
            <p class="task-desc">${task.description}</p>
            <div class="task-actions">
                <button class="action-btn toggle-btn" onclick="toggleStatus(${task.id}, '${task.status}')" title="Mark as ${isCompleted ? 'Pending' : 'Completed'}">
                    <i class='bx ${isCompleted ? 'bx-undo' : 'bx-check'}'></i>
                </button>
                <button class="action-btn edit-btn" onclick="openModal('edit', ${task.id})" title="Edit Task">
                    <i class='bx bx-edit-alt'></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete Task">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `;
        taskGrid.appendChild(card);
    });
}

function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    
    document.getElementById('totalTasks').innerText = total;
    document.getElementById('completedTasks').innerText = completed;
    document.getElementById('pendingTasks').innerText = pending;
}

function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateTask(id, { status: newStatus });
}

// Modal Logic
window.openModal = async function(mode, id = null) {
    currentMode = mode;
    taskForm.reset();
    
    if (mode === 'add') {
        modalTitle.innerText = 'Add New Task';
        statusGroup.style.display = 'none';
        document.getElementById('taskId').value = '';
    } else if (mode === 'edit') {
        modalTitle.innerText = 'Edit Task';
        statusGroup.style.display = 'block';
        
        try {
            // Fetch single task details
            const response = await fetch(`${API_URL}/${id}`);
            const task = await response.json();
            
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskStatus').value = task.status;
        } catch (error) {
            showToast('Error loading task details', 'error');
            return;
        }
    }
    
    modal.classList.add('show');
}

window.closeModal = function() {
    modal.classList.remove('show');
}

// Close modal if clicked outside
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

function showToast(message, type = 'success') {
    toast.innerText = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}
