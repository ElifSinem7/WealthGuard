// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#f0f8ff',
          text: '#000000',
        },
        dark: {
          bg: '#001f3f',
          text: '#ffffff',
        },
      },
      fontFamily: {
        sans: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
