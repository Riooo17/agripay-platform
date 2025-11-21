/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agripay': {
          green: '#16a34a',
          'dark-green': '#15803d',
          'light-green': '#dcfce7',
        }
      },
    },
  },
  plugins: [],
}