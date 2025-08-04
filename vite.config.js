import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // Or '@vitejs/plugin-react' if you used that template

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // Configure the proxy to redirect API requests to your backend server
        proxy: {
            '/api': {
                target: 'http://localhost:3001', // This must match the port your backend server is running on
                changeOrigin: true, // Needed for virtual hosted sites
                rewrite: (path) => path.replace(/^\/api/, ''), // Remove the '/api' prefix when forwarding to backend
            },
        },
    },
    // You might not strictly need this 'define' block if Vite's default handling
    // of VITE_ prefixed environment variables is sufficient, but it's harmless.
    define: {
        'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || '/api'),
    }
});