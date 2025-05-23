/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  screens: {
    'sm': '320px',
    // => @media (min-width: 640px) { ... }
    'md': '600px',
    // => @media (min-width: 1024px) { ... }
    'lg': '1000px',
    // => @media (min-width: 1280px) { ... }
    'xl': '1200px'
  },
  extend: {
    dropShadow: {
      '3xl': '0px -2px 4px #0288d1',
    },
    boxShadow: {
      'button': '0 4px 5px rgba(0,0,0,0.3)',
      'hoverButton': '0 6px 10px 2px'
    },
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
    },
    animation: {
      slideFadeIn: 'slideFadeIn 0.8s ease-out forwards',
      'fade-in-up': 'fadeInUp 0.3s ease-out',
    },
    keyframes: {
      slideFadeIn: {
        '0%': { opacity: 0, transform: 'translateY(40px)' },
        '50%': { opacity: 0.5, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      fadeInUp: {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    },

    colors: {
      'button': '#628ecb',
      'buttonHover': '#8aaee0',
      'box':"#d5deef",
      'baseText': '#333',
      'prime': '#395886',
      'main': '#5e8cc4',
      'pending': '#fffcab',
      'progress': '#ffe2a3',
      'testing': '#b1c9ef',
      'done': '#a9ffb7',
      'important': '#f8acb9',
      'importanttext': '#f16667',
      'progresstext': '#cb40f5',
      'pendingtext': '#f4d201',
      'donetext': '#04c005',
      'testingtext': '#35a8c0',
      'second': '#dee5ff',
    }
  },
};
export const plugins = [];
