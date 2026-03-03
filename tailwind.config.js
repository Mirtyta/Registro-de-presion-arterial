export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tranki: {
          primary: "#4ABDAC",
          flow: "#A5F861",
          accent: "#FC4A1A",
          button: "#F7B733",
          background: "#D9D9D9",
          headerbg: "#888585", 
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};