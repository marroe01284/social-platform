/** @type {import('tailwindcss').Config} */
export default {
  content: [ 
    "./index.html", // Keeps the reference to index.html
  "./src/**/*.{js,ts,jsx,tsx}", // Keeps the JS/TS references
  "./*.html",
],
  theme: {
    extend: {},
  },
  plugins: [],
}

