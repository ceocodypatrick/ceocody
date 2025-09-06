/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6200EA',
          light: '#9D46FF',
          dark: '#0A00B6',
        },
        secondary: {
          DEFAULT: '#00E5FF',
          light: '#6EFFFF',
          dark: '#00B2CC',
        },
        background: '#FAFAFA',
        surface: '#FFFFFF',
        error: '#B00020',
        success: '#00C853',
        warning: '#FF9100',
        info: '#2196F3',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'light': '0 2px 4px rgba(0,0,0,0.1)',
        'medium': '0 4px 8px rgba(0,0,0,0.12)',
        'heavy': '0 8px 16px rgba(0,0,0,0.14)',
      },
      borderRadius: {
        'DEFAULT': '8px',
      },
    },
  },
  plugins: [],
}