/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto Mono", 'sans-serif'], // Replace with your font name
      },
      colors:{
        customgray:"#262626",
        customdark:"#181818",
        custompurple:"#6666ff",
        customblue:"#3399ff",
        customblue2:"#264d73",
      }
    },
  },
  plugins: [],
}

