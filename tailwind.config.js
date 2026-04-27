/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Outfit', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
        },
        bg: {
          DEFAULT: 'var(--bg)',
          sidebar: 'var(--bg-sidebar)',
          card: 'var(--bg-card)',
          input: 'var(--bg-input)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          body: 'var(--text-body)',
        },
        accent: 'var(--accent)',
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
      },

      borderRadius: {
        'DEFAULT': '0.6rem',
        'lg': '0.8rem',
        'xl': '1.2rem',
        '2xl': '1.6rem',
      },

      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.02), 0 4px 16px rgba(29,78,216,0.04)',
        'card-hover': '0 10px 25px rgba(29,78,216,0.08)',
        'glow': '0 0 20px rgba(29, 78, 216, 0.15)',
        'input': '0 2px 6px rgba(29,78,216,0.03)',
        'button': '0 4px 12px rgba(29,78,216,0.2)',
      },

      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #1D4ED8, #2563EB)',
        'hero-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(29,78,216,0.02), rgba(16,185,129,0.02))',
      },

      animation: {
        'fadeIn': 'fadeIn 400ms ease-out',
        'slideUp': 'slideUp 500ms ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(1.5rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
