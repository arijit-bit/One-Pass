// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        oswald: ['var(--font-oswald)', 'sans-serif'],
        bebas: ['var(--font-bebas)', 'cursive', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        geist: ['var(--font-geist-sans)', 'sans-serif'],
        geistMono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx}',     // App Router
    './pages/**/*.{js,ts,jsx,tsx}',   // Pages Router
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
}
