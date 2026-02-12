// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust for your project
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],

  // DaisyUI configuration
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#875CF5",
          "secondary": "#211134",
          "accent": "#F472B6",
          "neutral": "#1C1C1C",
          "base-100": "#111827",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      "light",    
      "dark",     
      "cupcake",  
      "bumblebee",
      "emerald",  
      "corporate",
      "synthwave",
      "cyberpunk",
      "valentine",
      "halloween",
      "forest",   
      "luxury",   
      "dracula",  
    ],
    darkTheme: "dark",
  },
};
