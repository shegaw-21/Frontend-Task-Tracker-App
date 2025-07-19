import React, { useState, useEffect } from 'react';

// Header Component
const Header = () => {
    return ( <
        header className = "bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg shadow-lg" >
        <
        h1 className = "text-4xl font-extrabold text-white text-center tracking-tight" >
        My Task Tracker <
        /h1> < /
        header >
    );
};

// TaskForm Component
const TaskForm = ({ addTask, currentTask, updateTask, setEditingTask }) => {
        const [taskName, setTaskName] = useState('');
        const [taskDescription, setTaskDescription] = useState('');
        const [successMessage, setSuccessMessage] = useState('');

        // Effect to populate form when editing an existing task
        useEffect(() => {
            if (currentTask) {
                setTaskName(currentTask.name);
                setTaskDescription(currentTask.description);
            } else {
                setTaskName('');
                setTaskDescription('');
            }
            setSuccessMessage(''); // Clear message when form state changes
        }, [currentTask]);

        const handleSubmit = (e) => {
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
                updateTask({
                    ...currentTask,
                    name: taskName,
                    description: taskDescription,
                });
                setEditingTask(null); // Clear editing state
                setSuccessMessage('Task updated successfully!');
            } else {
                // Add new task
                addTask({
                    id: Date.now(), // Simple unique ID
                    name: taskName,
                    description: taskDescription,
                    status: 'todo', // Default status for new tasks
                });
                setSuccessMessage('Task added successfully!');
            }
            setTaskName('');
            setTaskDescription('');

            // Clear success message after a few seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        };

        return ( <
                form onSubmit = { handleSubmit }
                className = "bg-white p-6 rounded-lg shadow-md mb-6" >
                <
                h2 className = "text-2xl font-semibold text-gray-800 mb-4" > { currentTask ? 'Edit Task' : 'Add New Task' } <
                /h2> {
                successMessage && ( <
                    div className = "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                    role = "alert" >
                    <
                    span className = "block sm:inline" > { successMessage } < /span> < /
                    div >
                )
            } <
            div className = "mb-4" >
            <
            label htmlFor = "taskName"
        className = "block text-gray-700 text-sm font-bold mb-2" >
            Task Name:
            <
            /label> <
        input type = "text"
        id = "taskName"
        className = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-400"
        placeholder = "e.g., Buy groceries"
        value = { taskName }
        onChange = {
            (e) => setTaskName(e.target.value)
        }
        required /
            >
            <
            /div> <
        div className = "mb-6" >
            <
            label htmlFor = "taskDescription"
        className = "block text-gray-700 text-sm font-bold mb-2" >
            Description(Optional):
            <
            /label> <
        textarea id = "taskDescription"
        className = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-400 h-24 resize-none"
        placeholder = "e.g., Milk, eggs, bread, and fruits"
        value = { taskDescription }
        onChange = {
                (e) => setTaskDescription(e.target.value)
            } >
            <
            /textarea> < /
        div > <
            div className = "flex items-center justify-between" >
            <
            button type = "submit"
        className = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md" > { currentTask ? 'Update Task' : 'Add Task' } <
            /button> {
        currentTask && ( <
            button type = "button"
            onClick = {
                () => setEditingTask(null)
            }
            className = "bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md ml-2" >
            Cancel Edit <
            /button>
        )
    } <
    /div> < /
form >
);
};

// TaskCard Component
const TaskCard = ({ task, updateTaskStatus, deleteTask, setEditingTask }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'border-green-500 opacity-80';
            case 'in-progress':
                return 'border-yellow-500';
            case 'todo':
                return 'border-blue-400';
            default:
                return 'border-gray-300';
        }
    };

    const getStatusTextClass = (status) => {
        switch (status) {
            case 'completed':
                return 'line-through text-gray-500';
            default:
                return 'text-gray-900';
        }
    };

    return ( <
            div className = { `bg-white p-5 rounded-lg shadow-md flex items-center justify-between mb-4 transform transition duration-300 hover:scale-103
        border-l-8 ${getStatusColor(task.status)}` } >
            <
            div className = "flex-1 mr-4" >
            <
            h3 className = { `text-xl font-semibold ${getStatusTextClass(task.status)}` } > { task.name } <
            /h3> {
            task.description && ( <
                p className = { `text-gray-600 text-sm mt-1 ${getStatusTextClass(task.status)}` } > { task.description } <
                /p>
            )
        } <
        span className = { `inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full
          ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
             task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
             'bg-blue-100 text-blue-800'}` } > { task.status.toUpperCase().replace('-', ' ') } <
        /span> < /
    div > <
        div className = "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2" > {
            task.status !== 'completed' && ( <
                button onClick = {
                    () => updateTaskStatus(task.id, 'completed')
                }
                className = "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm"
                title = "Mark as Complete" >
                Complete <
                /button>
            )
        } {
            task.status !== 'in-progress' && task.status !== 'completed' && ( <
                button onClick = {
                    () => updateTaskStatus(task.id, 'in-progress')
                }
                className = "bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm"
                title = "Mark as In Progress" >
                In Progress <
                /button>
            )
        } {
            task.status === 'completed' && ( <
                button onClick = {
                    () => updateTaskStatus(task.id, 'todo')
                }
                className = "bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm"
                title = "Mark as To Do" >
                To Do <
                /button>
            )
        } <
        button onClick = {
            () => setEditingTask(task)
        }
    className = "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm"
    title = "Edit Task" >
        Edit <
        /button> <
    button onClick = {
        () => deleteTask(task.id)
    }
    className = "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md text-sm"
    title = "Delete Task" >
        Delete <
        /button> < /
    div > <
        /div>
);
};

// TaskList Component
const TaskList = ({ tasks, updateTaskStatus, deleteTask, setEditingTask }) => {
    if (tasks.length === 0) {
        return ( <
            p className = "text-center text-gray-600 text-lg mt-8 p-4 bg-white rounded-lg shadow-md" >
            No tasks yet!Add a new task using the form above. <
            /p>
        );
    }

    return ( <
        div className = "space-y-4" > {
            tasks.map((task) => ( <
                TaskCard key = { task.id }
                task = { task }
                updateTaskStatus = { updateTaskStatus }
                deleteTask = { deleteTask }
                setEditingTask = { setEditingTask }
                />
            ))
        } <
        /div>
    );
};

// Main App Component
const App = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null); // State to hold the task being edited

    // Add a new task
    const addTask = (task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
    };

    // Update an existing task or its status
    const updateTask = (updatedTask) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
    };

    // Update task status (e.g., 'todo', 'in-progress', 'completed')
    const updateTaskStatus = (id, newStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? {...task, status: newStatus } : task
            )
        );
    };

    // Delete a task
    const deleteTask = (id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        if (editingTask && editingTask.id === id) {
            setEditingTask(null); // Clear editing state if the deleted task was being edited
        }
    };

    return ( <
        div className = "min-h-screen bg-gray-100 p-4 sm:p-8 font-sans antialiased" >
        <
        div className = "max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-xl overflow-hidden" >
        <
        Header / >
        <
        main className = "p-6" >
        <
        TaskForm addTask = { addTask }
        currentTask = { editingTask }
        updateTask = { updateTask }
        setEditingTask = { setEditingTask }
        /> <
        h2 className = "text-2xl font-semibold text-gray-800 mb-4" > Your Tasks < /h2> <
        TaskList tasks = { tasks }
        updateTaskStatus = { updateTaskStatus } // Pass the new status update function
        deleteTask = { deleteTask }
        setEditingTask = { setEditingTask }
        /> < /
        main > <
        /div> < /
        div >
    );
};

export default App;