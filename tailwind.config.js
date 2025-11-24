/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        midnight: '#0b1224',
        'midnight-soft': '#111a31',
        teal: {
          500: '#22d3ee',
          600: '#0ea5e9',
        },
      },
      boxShadow: {
        glow: '0 10px 60px rgba(34, 211, 238, 0.25)',
      },
    },
  },
  plugins: [],
}
