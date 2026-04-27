import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'

// 좌측 사이드바 내비게이션 컴포넌트
export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user, logout, isAuthenticated } = useAuth()
  const { notify } = useNotification()
  
  // 현재 메뉴 활성화 여부 확인 함수
  const isActive = (path) => location.pathname === path

  // 내비게이션 아이템 클래스 스타일 정의
  const navClass = (path) => `flex items-center justify-between px-2 py-2 rounded-lg transition-all duration-200 ${
    isActive(path) ? 'bg-bg-input text-text font-bold shadow-sm' : 'text-text-muted hover:bg-bg-input hover:text-text font-medium'
  }`

  const handleLogout = () => {
    logout()
    notify(t('logout_success') || '로그아웃 되었습니다.', 'success')
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-bg-sidebar border-r border-border h-screen sticky top-0 flex flex-col pt-6 pb-4 px-4 flex-shrink-0 z-20">
      {/* 브랜드 로고 */}
      <Link to="/" className="flex items-center gap-2 px-2 mb-10 group">
        <div className="w-12 h-12 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain group-hover:rotate-6 transition-transform duration-300" />
        </div>
        <span className="font-bold text-2xl tracking-tighter text-primary">PromptShare</span>
      </Link>

      {/* 메인 메뉴 영역 */}
      <nav className="flex-1 space-y-6 overflow-y-auto pr-1 custom-scrollbar">
        {/* 메인 섹션 */}
        <div className="space-y-1">
          <Link to="/" className={navClass('/')}>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm">{t('new_skill')}</span>
            </div>
          </Link>
          <Link to="/my-skills" className={navClass('/my-skills')}>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{t('my_skills')}</span>
            </div>
          </Link>
        </div>

        {/* 탐색 섹션 */}
        <div className="space-y-1">
          <Link to="/recommended" className={navClass('/recommended')}>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-sm">{t('recommended')}</span>
            </div>
            <span className="text-[9px] bg-bg-input text-text-muted border border-border px-1.5 py-0.5 rounded font-black tracking-tighter shadow-sm">HOT</span>
          </Link>
          <Link to="/stats" className={navClass('/stats')}>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <span className="text-sm">{t('stats')}</span>
            </div>
          </Link>
        </div>

        {/* 기타 섹션 */}
        <div className="space-y-1">
          <Link to="/settings" className={navClass('/settings')}>
            <div className="flex items-center gap-3 pl-0.5">
              <svg className="w-5 h-5 flex-shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-sm">{t('settings')}</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* 하단 사용자 프로필 영역 */}
      <div className="pt-4 border-t border-border mt-auto">
        {isAuthenticated ? (
          /* 로그인 성공 시: 미니멀한 프로필 카드와 로그아웃 버튼 */
          <div className="space-y-2 p-1">
            <Link 
              to="/profile" 
              className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-bg-input hover:bg-bg-input/80 border border-border/50 group transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-sm shadow-inner uppercase shrink-0">
                {user?.name?.substring(0, 1) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text truncate group-hover:text-primary transition-colors">{user?.name}</p>
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">{user?.department || 'Member'}</p>
              </div>
              <svg className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all group font-medium"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-[11px] uppercase tracking-[0.2em]">{t('logout') || 'LOGOUT'}</span>
            </button>
          </div>
        ) : (
          /* 로그인 전: 로그인이 필요함을 강조 */
          <Link to="/login" className="flex flex-col gap-2 p-1 group no-underline">
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-bg-input hover:bg-bg-input/80 border border-dashed border-border transition-all cursor-pointer">
              <div className="w-10 h-10 bg-border text-text-muted rounded-full flex items-center justify-center font-black text-xl shadow-inner">?</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text group-hover:text-primary transition-colors">{t('login') || 'Sign In'}</p>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">Access your account</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </aside>
  )
}
