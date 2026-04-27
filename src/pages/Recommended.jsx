import { useState, useEffect } from 'react'
import api from '../services/api'
import SkillList from '../components/SkillList'
import { useLanguage } from '../contexts/LanguageContext'
import { useNotification } from '../contexts/NotificationContext'

export default function Recommended() {
  const [popularSkills, setPopularSkills] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { lang, t } = useLanguage()
  const { notify } = useNotification()
  
  // 인기 스킬 데이터 가져오기
  const fetchPopularSkills = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/skill/popular?limit=5')
      setPopularSkills(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('인기 스킬 로드 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPopularSkills()
  }, [])

  // 알림 신청 핸들러 (데이터가 적을 때를 위한 유지)
  const handleNotifyRequest = () => {
    const messages = {
      ko: '새로운 인기 스킬이 등록되면 가장 먼저 알려드릴게요! 🔔',
      en: 'We will notify you as soon as new popular skills are ready! 🔔',
      zh: '有新的热门技能时，我们会第一时间通知您！ 🔔',
      ja: '新しい人気スキルが登録され次第,すぐにお知らせします！ 🔔'
    }
    notify(messages[lang] || messages.ko, 'success', true)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 페이지 헤더 */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            <h1 className="text-3xl font-black tracking-tighter text-text">{t('recommended')}</h1>
          </div>
          <p className="text-text-muted text-sm max-w-xl font-medium">
            {t('rec_desc')}
          </p>
        </div>
        
        {/* 알림 받기 버튼을 우측 상단으로 이동 */}
        <button 
          onClick={handleNotifyRequest}
          className="px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 border border-primary/20"
        >
          {t('notify_me')}
        </button>
      </header>
      
      {isLoading ? (
        /* 로딩 중 UI */
        <div className="bg-bg-card border border-border rounded-[32px] p-20 flex flex-col items-center justify-center animate-pulse">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-bold tracking-widest text-text-muted uppercase">{t('loading')}</p>
        </div>
      ) : popularSkills.length > 0 ? (
        /* 실제 인기 스킬 목록 */
        <div className="space-y-6">
          <SkillList 
            skills={popularSkills} 
            viewMode="grid" 
            onRefresh={fetchPopularSkills} 
          />
        </div>
      ) : (
        /* 데이터가 없을 때 (Fallback) */
        <div className="bg-bg-card border border-border rounded-[32px] p-20 flex flex-col items-center justify-center text-center space-y-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
          
          <div className="w-20 h-20 bg-bg-input border border-border rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-all duration-500">
            <svg className="w-10 h-10 text-text-muted opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>

          <div className="space-y-2 relative">
            <h2 className="text-2xl font-black text-text tracking-tighter">{t('rec_empty_title')}</h2>
            <p className="text-text-muted text-sm font-medium">{t('rec_empty_desc')}</p>
          </div>

          <button 
            onClick={handleNotifyRequest}
            className="px-6 py-2.5 bg-bg-input hover:bg-border text-text text-xs font-bold rounded-full transition-all border border-border active:scale-95"
          >
            {t('notify_me')}
          </button>
        </div>
      )}
    </div>
  )
}
