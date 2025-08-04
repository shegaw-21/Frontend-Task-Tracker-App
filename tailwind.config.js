/** @type {import('tailwindcss').Config} */
module.exports = {
    // This 'content' array tells Tailwind where to scan for utility classes.
    // It MUST correctly point to your React component files.
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // This line ensures Tailwind scans all JS, JSX, TS, TSX files in the src folder
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Sets Inter as the default sans-serif font
            },
        },
    },
    plugins: [],
}