import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

// 상단 헤더 컴포넌트: 검색창, GitHub 링크, 테마 토글 버튼 포함
export default function Header() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'))
  const { t } = useLanguage()

  // 다크모드 토글 함수
  const toggleTheme = () => {
    const isNowDark = document.documentElement.classList.toggle('dark')
    setIsDark(isNowDark)
    localStorage.setItem('theme', isNowDark ? 'dark' : 'light')
  }

  return (
    <header className="h-16 border-b border-border bg-bg-sidebar/50 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      {/* 좌측: 검색바 영역 */}
      <div className="flex-1 max-w-xl relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input 
          type="text" 
          placeholder={t('search_placeholder')}
          className="block w-full bg-bg-input border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center gap-1 h-5 px-1.5 font-sans text-[10px] font-bold text-text-muted bg-bg-card border border-border rounded-md shadow-sm">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* 우측: 유틸리티 메뉴 (GitHub, 테마 토글) */}
      <div className="flex items-center gap-4 ml-6">
        <Link 
          to="https://github.com" 
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-muted hover:text-text hover:bg-bg-input transition-all font-bold text-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <span className="hidden md:inline">{t('github')}</span>
        </Link>
        
        <div className="h-4 w-px bg-border mx-1"></div>

        <button 
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-card border border-border text-text-muted hover:text-primary hover:border-primary hover:shadow-lg transition-all duration-300 shadow-sm"
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          {isDark ? (
            <svg className="w-5 h-5 fill-primary" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.122-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>
      </div>
    </header>
  )
}
