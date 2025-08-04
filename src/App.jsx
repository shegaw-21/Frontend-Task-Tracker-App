import React, { useState, useEffect } from 'react';

// Header Component
// Manages the visibility of the "About" section via state passed from App.
function Header({ showAbout, setShowAbout }) {
    return (
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg shadow-lg">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-extrabold text-white text-center tracking-tight">
                    My Task Tracker
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <button
                                className="text-white hover:text-blue-200 font-medium transition duration-300"
                                onClick={() => setShowAbout(false)}
                            >
                                Home
                            </button>
                        </li>
                        <li>
                            <button
                                className="text-white hover:text-blue-200 font-medium transition duration-300"
                                onClick={() => setShowAbout(true)}
                            >
                                About
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

// Confirmation Modal Component
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                <p className="text-lg font-semibold text-gray-800 mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md">
                        Confirm
                    </button>
                    <button onClick={onCancel}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// TaskForm Component
const TaskForm = ({ addTask, currentTask, updateTask, setEditingTask }) => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [formSuccessMessage, setFormSuccessMessage] = useState(''); // Local success message for form

    // Effect to populate form when editing an existing task
    useEffect(() => {
        if (currentTask) {
            setTaskName(currentTask.title); // Use title from backend
            setTaskDescription(currentTask.description);
        } else {
            setTaskName('');
            setTaskDescription('');
        }
        setFormSuccessMessage(''); // Clear message when form state changes
    }, [currentTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskName.trim()) {
            const inputElement = document.getElementById('taskName');
            if (inputElement) {
                inputElement.classList.add('border-red-500', 'ring-red-500');
                inputElement.placeholder = 'Task name is required!';
                setTimeout(() => {
                    inputElement.classList.remove('border-red-500', 'ring-red-500');
                    inputElement.placeholder = 'e.g., Buy groceries';
                }, 2000);
            }
            return;
        }

        if (currentTask) {
            // Update existing task
            await updateTask({
                id: currentTask.id,
                title: taskName, // Send title to backend
                description: taskDescription,
                completed: currentTask.completed // Keep current completion status
            });
            setEditingTask(null); // Clear editing state
            setFormSuccessMessage('Task updated successfully!');
        } else {
            // Add new task
            await addTask({
                title: taskName, // Send title to backend
                description: taskDescription,
                completed: false // New tasks are not completed
            });
            setFormSuccessMessage('Task added successfully!');
        }
        setTaskName('');
        setTaskDescription('');

        // Clear success message after a few seconds
        setTimeout(() => {
            setFormSuccessMessage('');
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {currentTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            {formSuccessMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                    role="alert">
                    <span className="block sm:inline">{formSuccessMessage}</span>
                </div>
            )}
            <div className="mb-4">
                <label htmlFor="taskName" className="block text-gray-700 text-sm font-bold mb-2">
                    Task Name:
                </label>
                <input type="text"
                    id="taskName"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g., Buy groceries"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="taskDescription" className="block text-gray-700 text-sm font-bold mb-2">
                    Description(Optional):
                </label>
                <textarea id="taskDescription"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-400 h-24 resize-none"
                    placeholder="e.g., Milk, eggs, bread, and fruits"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)} >
                </textarea>
            </div>
            <div className="flex items-center justify-between">
                <button type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md">
                    {currentTask ? 'Update Task' : 'Add Task'}
                </button>
                {currentTask && (
                    <button type="button"
                        onClick={() => setEditingTask(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md ml-2">
                        Cancel Edit
                    </button>
                )}
            </div>
        </form>
    );
};

// TaskCard Component
const TaskCard = ({ task, updateTaskStatus, deleteTask, setEditingTask }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleDeleteClick = () => {
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        deleteTask(task.id);
        setShowConfirmModal(false);
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
    };

    // Helper to map backend 'completed' boolean to frontend 'status' string for display
    const getStatusString = (completed) => {
        if (completed) return 'completed';
        // Backend only has 'completed' boolean. If you want 'in-progress',
        // your backend would need to store a distinct status field.
        return 'todo';
    };

    const status = getStatusString(task.completed); // Derive status for frontend display

    const getStatusColor = (currentStatus) => {
        switch (currentStatus) {
            case 'completed':
                return 'border-green-500 opacity-80';
            case 'in-progress':
                return 'border-orange-500';
            case 'todo':
                return 'border-blue-400';
            default:
                return 'border-gray-300';
        }
    };

    const getStatusTextClass = (currentStatus) => {
        switch (currentStatus) {
            case 'completed':
                return 'line-through text-gray-500';
            default:
                return 'text-gray-900';
        }
    };

    return (
        <div className={`bg-white p-5 rounded-lg shadow-md flex items-center justify-between mb-4 transform transition duration-300 hover:scale-103
            border-l-8 ${getStatusColor(status)}`}>
            <div className="flex-1 mr-4">
                <h3 className={`text-xl font-semibold ${getStatusTextClass(status)}`}>
                    {task.title} {/* Use task.title from backend */}
                </h3>
                {task.description && (
                    <p className={`text-gray-600 text-sm mt-1 ${getStatusTextClass(status)}`}>
                        {task.description}
                    </p>
                )}
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full
                    ${status === 'completed' ? 'bg-green-100 text-green-800' :
                        status === 'in-progress' ? 'bg-gray-800 text-white' :
                        'bg-blue-100 text-blue-800'}`}>
                    {status.toUpperCase().replace('-', ' ')}
                </span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {/* Render "Complete" button only if task is not completed */}
                {status !== 'completed' && (
                    <button onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm min-w-[80px]"
                        title="Mark as Complete">
                        Complete
                    </button>
                )}

                {/* Render "In Progress" button only if task is not in-progress and not completed */}
                {status !== 'in-progress' && status !== 'completed' && (
                    <button onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        className="bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm min-w-[80px]"
                        title="Mark as In Progress">
                        In Progress
                    </button>
                )}

                {/* Render "To Do" button only if task is completed or in-progress */}
                {(status === 'completed' || status === 'in-progress') && (
                    <button onClick={() => updateTaskStatus(task.id, 'todo')}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm min-w-[80px]"
                        title="Mark as To Do">
                        To Do
                    </button>
                )}

                {/* Edit button always visible */}
                <button onClick={() => setEditingTask(task)}
                        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm min-w-[80px]"
                        title="Edit Task">
                    Edit
                </button>
                <button onClick={handleDeleteClick}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm min-w-[80px]"
                        title="Delete Task">
                    Delete
                </button>
            </div>

            {showConfirmModal && (
                <ConfirmationModal message={`Are you sure you want to delete "${task.title}"?`} // Use task.title
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

// TaskList Component
const TaskList = ({ tasks, updateTaskStatus, deleteTask, setEditingTask }) => {
    if (tasks.length === 0) {
        return (
            <p className="text-center text-gray-600 text-lg mt-8 p-4 bg-white rounded-lg shadow-md">
                No tasks yet! Add a new task using the form above.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <TaskCard key={task.id}
                    task={task}
                    updateTaskStatus={updateTaskStatus}
                    deleteTask={deleteTask}
                    setEditingTask={setEditingTask}
                />
            ))}
        </div>
    );
};

// Main App Component
const App = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null); // State to hold the task being edited
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for displaying errors from API calls
    const [showAbout, setShowAbout] = useState(false); // State for toggling About section
    const [successMessage, setSuccessMessage] = useState(null); // State for displaying success messages

    // Base URL for your backend API (Vite handles proxying in development)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

    // Function to fetch tasks from backend
    const fetchTasks = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
            setError(`Failed to load tasks: ${err.message}. Please ensure your backend is running.`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Add a new task via backend
    const addTask = async (task) => {
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    completed: false
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            const newTask = await response.json();
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setSuccessMessage('Task added successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Failed to add task:", err);
            setError(`Failed to add task: ${err.message}.`);
        }
    };

    // Update an existing task (title/description/completed) via backend
    const updateTask = async (updatedTask) => {
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${updatedTask.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: updatedTask.title,
                    description: updatedTask.description,
                    completed: updatedTask.completed
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            const result = await response.json();
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === result.id ? result : task))
            );
            setSuccessMessage('Task updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Failed to update task:", err);
            setError(`Failed to update task: ${err.message}.`);
        }
    };

    // Update task status (e.g., 'completed', 'todo', 'in-progress') via backend
    const updateTaskStatus = async (id, newStatus) => {
        setError(null);
        setSuccessMessage(null);
        const taskToUpdate = tasks.find(t => t.id === id);
        if (!taskToUpdate) {
            setError("Task not found for status update.");
            return;
        }

        // Map frontend status string to backend boolean
        let completedStatusForBackend = taskToUpdate.completed;
        if (newStatus === 'completed') {
            completedStatusForBackend = true;
        } else if (newStatus === 'todo' || newStatus === 'in-progress') {
            completedStatusForBackend = false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: taskToUpdate.title,
                    description: taskToUpdate.description,
                    completed: completedStatusForBackend
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            const updatedTask = await response.json();
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
            setSuccessMessage(`Task marked as ${newStatus}!`);
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err) {
            console.error("Failed to update task status:", err);
            setError(`Failed to update task status: ${err.message}.`);
        }
    };

    // Delete a task via backend
    const deleteTask = async (id) => {
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
            if (editingTask && editingTask.id === id) {
                setEditingTask(null); // Clear editing state if the deleted task was being edited
            }
            setSuccessMessage('Task deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err) {
            console.error("Failed to delete task:", err);
            setError(`Failed to delete task: ${err.message}.`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans antialiased">
            <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-xl overflow-hidden">
                {/* Pass showAbout and setShowAbout to Header */}
                <Header showAbout={showAbout} setShowAbout={setShowAbout} />
                <main className="p-6">
                    {showAbout ? (
                        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">About</h2>
                            <p>This is a simple Task Tracker app built with React and Tailwind CSS. It connects to a Node.js Express backend and uses MySQL for data persistence. You can add, mark as complete/incomplete, and delete tasks.</p>
                            <p className="mt-2 text-sm text-gray-600">This application was developed as part of an interactive guide to demonstrate full-stack development principles.</p>
                        </div>
                    ) : (
                        <>
                            <TaskForm addTask={addTask}
                                currentTask={editingTask}
                                updateTask={updateTask}
                                setEditingTask={setEditingTask}
                            />
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Tasks</h2>

                            {/* Success and Error messages display */}
                            {successMessage && (
                                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center font-medium shadow-md">
                                    {successMessage}
                                </div>
                            )}
                            {error && (
                                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center font-medium shadow-md">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <p className="mt-8 text-center text-indigo-700 text-lg">Loading tasks...</p>
                            ) : tasks.length === 0 && !error ? (
                                <p className="text-center text-gray-600 text-lg mt-8 p-4 bg-white rounded-lg shadow-md">
                                    No tasks yet! Add a new task using the form above.
                                </p>
                            ) : (
                                <TaskList tasks={tasks}
                                    updateTaskStatus={updateTaskStatus}
                                    deleteTask={deleteTask}
                                    setEditingTask={setEditingTask}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
