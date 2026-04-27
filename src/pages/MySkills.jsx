import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import SkillList from '../components/SkillList'
import { useLanguage } from '../contexts/LanguageContext'
import { useNotification } from '../contexts/NotificationContext'
import { useAuth } from '../contexts/AuthContext'

// 내 스킬 페이지 컴포넌트
export default function MySkills() {
  const [skills, setSkills] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const { t } = useLanguage()
  const { notify } = useNotification()
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const fetchMySkills = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/skill/me')
      setSkills(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('내 스킬 로드 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMySkills()
  }, [])

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.md')) {
      notify(t('only_markdown'), 'error')
      return
    }

    // 파일 내용도 API로 전달받아서 처리
    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result
      try {
        await api.post('/skill/upload', {
          title: file.name.replace('.md', ''),
          department: user?.department || '개발팀',
          raw_prompt: content
        })
        notify(t('upload_success'), 'success')
        fetchMySkills()
      } catch (err) {
        console.error('Upload failed:', err)
        notify(t('upload_failed'), 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset input
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fadeIn">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".md" 
        className="hidden" 
      />
      
      {/* 페이지 헤더 */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-8 bg-primary rounded-full"></span>
            <h1 className="text-4xl font-black tracking-tighter text-text">{t('my_skills')}</h1>
          </div>
          <p className="text-text-muted text-sm font-medium opacity-80 pl-4">
            {t('my_skills_desc')}
          </p>
        </div>

        <div className="flex items-center gap-3 pl-4 md:pl-0">
          <button 
            onClick={handleFileClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-card border border-border text-text-muted hover:text-primary hover:border-primary rounded-xl shadow-sm hover:-translate-y-0.5 transition-all active:scale-95 group"
            title={t('upload_skill')}
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline text-xs font-black tracking-tight uppercase opacity-80 group-hover:opacity-100">{t('upload_skill')}</span>
          </button>

          <div className="bg-bg-card border border-border rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total</span>
            <span className="text-lg font-black text-primary">{skills.length}</span>
          </div>
          
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2.5 bg-bg-card border border-border rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm group"
          >
            {viewMode === 'grid' ? (
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-text-muted">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-sm font-black tracking-widest uppercase opacity-40">{t('loading')}</p>
          </div>
        ) : skills.length > 0 ? (
          <SkillList skills={skills} viewMode={viewMode} onRefresh={fetchMySkills} />
        ) : (
          <div className="bg-bg-card border-2 border-dashed border-border rounded-[40px] p-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-bg-input rounded-3xl flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-text-muted opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text tracking-tighter">{t('no_my_skills')}</h2>
              <p className="text-text-muted text-sm font-medium">{t('no_my_skills_desc')}</p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary text-white font-black px-8 py-3 rounded-2xl shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all active:scale-95"
            >
              + {t('new_skill')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
