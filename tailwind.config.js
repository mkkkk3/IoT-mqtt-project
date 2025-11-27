/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pageBlack: "#1E1B13",
        page5: "#391E10",
        page4: "#734128",
        page3: "#C7A07A",
        page2: "#E2CEB1",
        page1: "#FDFCE8",
        pageMenu: "#1E1B13"
      },
      fontFamily: {
        body: ['Nunito', "sans-serif"],
        page: ['Montserrat', "sans-serif"],
        typewriter: ["Space Mono", "sans-serif"],
      },
    },
  },
  plugins: [],
};
