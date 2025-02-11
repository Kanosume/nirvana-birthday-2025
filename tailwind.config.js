module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nirvana': {
          'blue': '#1E40AF', // Royal blue matching her outfit
          'light-blue': '#93C5FD', // Lighter blue for accents
          'white': '#FFFFFF', // Pure white for the dress
          'silver': '#F3F4F6', // Silver for subtle backgrounds
          'pink': '#FFC7D1', // Soft pink for accents (from the butterflies)
        }
      },
      backgroundImage: {
        'dollhouse-pattern': "url('/dollhouse-pattern.svg')",
      },
      boxShadow: {
        'dollhouse': '0 4px 6px -1px rgba(30, 64, 175, 0.1), 0 2px 4px -1px rgba(30, 64, 175, 0.06)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      scale: {
        102: '1.02', // Add this line to extend the scale utility
      },
    },
  },
  plugins: [],
}
