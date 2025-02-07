/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00e5ff',
        'neon-pink': '#ff00ff',
        'neon-purple': '#8a2be2',
        'neon-green': '#39ff14',
      },
    },
  },
  plugins: [],
};
