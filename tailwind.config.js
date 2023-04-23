/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#F8F3EB',
        'polp-orange': '#FFAC33',
        'polp-grey': '#E0E0E0',
        'polp-white': '#FEFEFE',
        'polp-black': '#010101',
      }
    },
  },
  plugins: [],
}