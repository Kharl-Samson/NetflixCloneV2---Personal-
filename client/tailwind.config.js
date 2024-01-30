/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "211size": "211px",
        "329size": "329px",
        "400size": "400px",
        "801size": "801px",
        "951size": "951px",
        "1051size": "1051px"
      },
      colors: {
        "custom-light-1" : "#fdfefe",
        "custom-light-2" : "#cbc9df",

        "custom-dark-2" : "#0b0b0b",

        "custom-color-hero-1" : "#181414"
      }
    },
  },
  plugins: [],
}

