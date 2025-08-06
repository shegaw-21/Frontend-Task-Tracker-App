// frontend/src/pages/AuthPage.jsx
import React, { useState } from 'react';

const AuthPage = ({ onAuthSuccess, API_BASE_URL }) => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register forms
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(''); // Optional for registration
    const [fullName, setFullName] = useState(''); // Optional for registration
    const [message, setMessage] = useState(''); // For success or error messages
    const [error, setError] = useState(null); // For displaying API errors

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setError(null); // Clear previous errors

        const endpoint = isLogin ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`;
        const method = 'POST';
        const body = isLogin
            ? JSON.stringify({ username, password })
            : JSON.stringify({ username, password, email, full_name: fullName });

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            // If login is successful, call onAuthSuccess with the token and user data
            if (isLogin) {
                setMessage(data.message);
                onAuthSuccess(data.token, data.user);
            } else {
                setMessage(data.message + ' You can now log in.');
                setIsLogin(true); // Switch to login form after successful registration
            }
        } catch (err) {
            console.error('Authentication error:', err);
            setError(err.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {isLogin ? 'Login' : 'Register'}
                </h2>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-400"
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-400"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && ( // Render these fields only for registration
                        <>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                    Email :
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-400"
                                    placeholder="your@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
                                    Full Name :
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-400"
                                    placeholder="Your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-md"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage(''); // Clear messages on toggle
                            setError(null);
                            setUsername(''); // Clear fields on toggle
                            setPassword('');
                            setEmail('');
                            setFullName('');
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-300"
                    >
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
