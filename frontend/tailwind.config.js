/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F6",
        ink: "#1C2321",
        accent: {
          DEFAULT: "#3F5D45",   // muted forest green
          dark: "#2E4634",
          light: "#EDF1EE",
        },
        border: "#E4E1D8",
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
