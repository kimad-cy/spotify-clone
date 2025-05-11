/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1DB954',
        'spotify-black': '#191414',
        'spotify-dark': '#121212',
        'spotify-light-black': '#282828',
        'spotify-gray': '#535353',
        'spotify-light-gray': '#B3B3B3',
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      opacity: ['group-hover'],
      visibility: ['group-hover'],
    }
  }
}