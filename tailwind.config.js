/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      'montserrat': [ 'Montserrat', 'sans-serif' ]
    },
    extend: {},
  },
  plugins: [
    require( 'daisyui' ),
  ],
  daisyui: {
    themes: [ 'night' ]
  }
}

