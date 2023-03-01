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
        'polp-orange': '#FFAC33'
      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
        blogger: ['var(--font-blogger)', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
    },
  },
  plugins: [],
}