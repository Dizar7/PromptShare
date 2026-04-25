/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - 밝고 화사한 바이올렛/퍼플
        primary: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          dark: '#6D28D9',
          50: '#F5F3FF',
          100: '#EDE9FE',
        },
        // Secondary - 핑크 포인트
        secondary: {
          DEFAULT: '#EC4899',
          light: '#F9A8D4',
        },
        // 배경색 (밝은 라이트 테마 기반)
        bg: {
          DEFAULT: '#FAFAFF',   // 아주 살짝 보라빛이 도는 화이트
          card: '#FFFFFF',
          input: '#F4F2FF',     // 연한 라벤더 톤 입력 필드
          section: '#F0EEFF',   // 섹션 배경
        },
        // 텍스트
        text: {
          DEFAULT: '#1E1B4B',   // 딥 인디고 (순수 검정 대신)
          soft: '#6366F1',      // 부제목/라벨에 보라 포인트
          muted: '#9CA3AF',     // 보조 텍스트
          body: '#4B5563',      // 본문 텍스트
        },
        // 강조색
        accent: '#06B6D4',      // 시안/티얼
        success: '#10B981',
        danger: '#F43F5E',
        // 테두리
        border: {
          DEFAULT: '#E9E5FF',   // 연한 보라 테두리
          hover: '#C4B5FD',
        },
      },

      borderRadius: {
        'DEFAULT': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
      },

      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(124,58,237,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06), 0 12px 36px rgba(124,58,237,0.12)',
        'glow': '0 0 24px rgba(124, 58, 237, 0.25)',
        'input': '0 2px 8px rgba(124,58,237,0.06)',
        'button': '0 4px 14px rgba(124,58,237,0.35)',
      },

      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #7C3AED, #EC4899)',
        'hero-gradient': 'linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 50%, #E0F2FE 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(124,58,237,0.03), rgba(236,72,153,0.03))',
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
