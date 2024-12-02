/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'sm': '320px',
      // => @media (min-width: 640px) { ... }

      'md': '600px',
      // => @media (min-width: 1024px) { ... }

      'lg': '1000px',
      // => @media (min-width: 1280px) { ... }

      'xl':'1200px'
    },
    extend: {
      dropShadow: {
        '3xl': '0px -2px 4px #0288d1',
      },
      boxShadow:{
        'button': '0 4px 5px rgba(0,0,0,0.3)',
        'hoverButton': '0 6px 10px 2px'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
     
      // keyframes: {
      //   wiggle: {
      //     '0%, 100%': { transform: 'rotate(-3deg)' },
      //     '50%': { transform: 'rotate(3deg)' },
      //   }
      // },
      // animation: {
      //   'wiggle': 'wiggle 1s ease-in-out 3',
      //   'spin': 'spin 10s linear infinite',
      // }

      colors:{
        // 050d2b 11264a
        //pending #edee63, prog , done #94f6a4 test #64c8f7 impo #f8acb9
        'prime': "#050d2b",
        'second': '#E5F0FF',
        'secondDark':'#020c30',
        'designing' : '#0288d1',
        'pending': '#edee63',
        'progress':'#c97bfa',
        'testing':'	#64c8f7',
        'done':'#94f6a4',
        'important':'#f8acb9',
        'importanttext':'#f16667',
        'progresstext':'#cb40f5',
        'pendingtext':'#f4d201',
        'donetext':'#04c005',
        'testingtext':'#35a8c0'
      }
    },
  },
  plugins: [],
};
