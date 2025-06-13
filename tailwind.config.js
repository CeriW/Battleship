/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'battleship-blue': '#0088D1',
      },
      fontFamily: {
        sans: ['Oswald', 'sans-serif'],
      },
      fontSize: {
        base: '28px',
      },
    },
  },
  plugins: [],
};
