    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.jsx'; // <--- ENSURE THIS IS '.jsx' IF YOUR FILE IS App.jsx
    import './index.css'; // This imports your Tailwind CSS styles

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    