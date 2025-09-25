/** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
// }


export default  {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities(
        {
          '.scrollbar-hidden': {
            'overflow': 'auto',
          },
          '.scrollbar-hidden::-webkit-scrollbar': {
            'display': 'none', /* Safari and Chrome */
          },
        
          '.scrollbar-thin': {
            'overflow': 'auto',
            'scrollbar-width': 'thin', /* Firefox */
            '&::-webkit-scrollbar': {
              'width': '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              'background': '#888',
              'borderRadius': '10px',
            },
            '&::-webkit-scrollbar-track': {
              'background': '#f1f1f1',
              'borderRadius': '10px',
            },
          },
          '.scrollbar-default': {
            'overflow': 'auto',
            'scrollbar-width': 'auto', /* Firefox */
            '&::-webkit-scrollbar': {
              'width': '12px',
            },
            '&::-webkit-scrollbar-thumb': {
              'background': '#888',
              'borderRadius': '10px',
            },
            '&::-webkit-scrollbar-track': {
              'background': '#f1f1f1',
              'borderRadius': '10px',
            },
          },
        },
        ['responsive', 'hover']
      );
    },
  ],
}
