/** @type {import('tailwindcss').Config} */
import { mtConfig } from "@material-tailwind/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: { 
        barokah: {
          50:  "#FFF8ED",
          100: "#FFEAD4",
          200: "#FFD0A0",
          300: "#FFB873",
          400: "#FF9F47",
          500: "#F9812A",
          600: "#EB6415",
          700: "#C0490E",
          800: "#94380D",
          900: "#652504",
          950: "#441400",
        },
        dasar: {
          50:  "#FEFDF9",
          100: "#F9F8F5",
          200: "#EBEAE6",
          900: "#2C2B29",
        },
        aksen: "#6EAD6F",
      },
    },
  },
  plugins: [mtConfig],
}


