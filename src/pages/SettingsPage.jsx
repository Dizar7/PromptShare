import { useLanguage } from '../contexts/LanguageContext'
import { useNotification } from '../contexts/NotificationContext'

// 설정 페이지: 언어 설정 및 알림 옵션 관리
export default function SettingsPage() {
  const { lang, setLang, t } = useLanguage()
  const { notifEnabled, setNotifEnabled, notify } = useNotification()

  // 언어 옵션 데이터
  const languageOptions = [
    { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' }
  ]

  // 알림 토글 핸들러
  const handleNotifToggle = () => {
    const newState = !notifEnabled
    setNotifEnabled(newState)
    
    // 상태 변경 시 즉각적인 피드백 알림 (force: true를 사용하여 즉시 표시)
    if (newState) {
      notify(lang === 'ko' ? '알림이 활성화되었습니다.' : 'Notifications enabled.', 'success', true)
    } else {
      notify(lang === 'ko' ? '알림이 해제되었습니다.' : 'Notifications disabled.', 'error', true)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 페이지 헤더 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          <h1 className="text-3xl font-black tracking-tighter text-text">{t('settings')}</h1>
        </div>
        <p className="text-text-muted text-sm max-w-xl font-medium">
          {t('settings_desc')}
        </p>
      </div>
      
      {/* 설정 항목 리스트 */}
      <div className="bg-bg-card border border-border rounded-[28px] overflow-hidden shadow-sm divide-y divide-border">
        {/* 알림 설정 */}
        <div 
          onClick={handleNotifToggle}
          className="p-8 flex items-center justify-between hover:bg-bg-input transition-colors group cursor-pointer"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-base text-text group-hover:text-primary transition-colors tracking-tight">{t('notification')}</h4>
            <p className="text-xs text-text-muted font-medium">{t('notif_desc')}</p>
          </div>
          <div className={`w-12 h-7 rounded-full relative transition-all duration-300 shadow-md ${notifEnabled ? 'bg-primary' : 'bg-border'}`}>
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${notifEnabled ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>

        {/* 언어 설정 - 드롭다운 */}
        <div className="p-8 flex items-center justify-between hover:bg-bg-input transition-colors group">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-text group-hover:text-primary transition-colors tracking-tight">{t('language')}</h4>
            <p className="text-xs text-text-muted font-medium">{t('language_desc')}</p>
          </div>
          
          <div className="relative">
            <select 
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="appearance-none bg-bg-card border border-border text-text text-sm font-bold rounded-xl px-5 py-2.5 pr-10 hover:border-primary transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {languageOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.flag} {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 기타 정보 */}
      <div className="pt-4 flex flex-col items-center gap-2">
        <p className="text-[11px] text-text-muted font-bold tracking-widest uppercase opacity-30">PromptShare v1.0.0 Stable</p>
      </div>
    </div>
  )
}
