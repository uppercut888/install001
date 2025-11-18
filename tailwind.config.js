/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gem-onyx': '#f8fafc',
        'gem-slate': '#ffffff',
        'gem-mist': '#e2e8f0',
        'gem-offwhite': '#1e293b',
        'gem-teal': '#0d9488',
        'gem-blue': '#2563eb',
      },
      keyframes: {
        'progress-stripes': {
          'from': { backgroundPosition: '1rem 0' },
          'to': { backgroundPosition: '0 0' },
        },
      },
      animation: {
        'progress-stripes': 'progress-stripes 1s linear infinite',
      },
    }
  },
  plugins: [],
}
