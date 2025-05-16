/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,js,ts,jsx,tsx,vue}"
    ],
    theme: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif']
      } , 
      extend: {
        backgroundImage:{
            "home": "url('/assets/bg.png')"
        }   
      },
    },
    plugins: [],
  }