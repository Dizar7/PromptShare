import { useState, useEffect } from 'react'
import api from '../services/api'
import SkillForm from '../components/SkillForm'
import SkillList from '../components/SkillList'
import { useLanguage } from '../contexts/LanguageContext'

// 홈 페이지 컴포넌트
export default function Home() {
  const [skills, setSkills] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [importedText, setImportedText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  // 백엔드로부터 스킬 목록을 가져오는 함수
  const fetchSkills = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/skill/list')
      // 백엔드에서 배열을 직접 반환하므로 response.data를 바로 사용합니다.
      setSkills(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('스킬 목록 로드 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 페이지 로드 시 기존 스킬 목록 불러오기
  useEffect(() => {
    let ignore = false
    const startFetching = async () => {
      if (!ignore) await fetchSkills()
    }
    startFetching()
    return () => { ignore = true }
  }, [])

  // 새 스킬이 생성되었을 때 목록 갱신
  const handleSkillCreated = () => {
    fetchSkills()
  }

  // 로컬 파일 드롭 핸들러
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (event) => setImportedText(event.target.result)
      reader.readAsText(file)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* 대시보드 헤더 */}
      <header className="space-y-1.5 animate-fadeIn">
        <div className="flex items-center gap-3">
          <span className="px-3 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">{t('dashboard')}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent opacity-50"></div>
        </div>
        <h1 className="text-3xl font-black text-text tracking-tighter sm:text-4xl">
          {t('hero_title').split('AI')[0]} <span className="text-primary italic">AI Skills</span> {t('hero_title').split('AI')[1]}
        </h1>
        <p className="text-text-muted max-w-2xl text-base font-medium leading-relaxed opacity-80">
          {t('hero_desc')}
        </p>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 좌측: 새 스킬 작성 (7/12) */}
        <div className="lg:col-span-7 sticky top-6 transition-all duration-300">
          <div 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handleDrop}
            className="bg-bg-card border border-border rounded-[32px] p-8 shadow-card backdrop-blur-sm relative overflow-hidden group transition-all duration-500 hover:shadow-2xl"
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-text tracking-tighter">{t('new_skill')}</h2>
                  <p className="text-text-muted text-[11px] mt-0.5 font-medium opacity-80">AI power for your professional know-how.</p>
                </div>
                <div className="w-12 h-12 bg-bg-input rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-white/40 dark:bg-black/5 rounded-2xl p-1">
                <SkillForm onSkillCreated={handleSkillCreated} importedText={importedText} />
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 최근 생성된 스킬 목록 (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-text tracking-tight uppercase italic opacity-80">{t('recent_skills')}</h2>
              <span className="bg-bg-input text-text-muted text-[10px] font-black px-2 py-0.5 rounded-full border border-border">{skills.length}</span>
            </div>
            
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-bg-card border border-border rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm group"
              title={viewMode === 'grid' ? t('view_list') : t('view_grid')}
            >
              {viewMode === 'grid' ? (
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </button>
          </div>

          <div className="min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted animate-pulse">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold tracking-widest uppercase opacity-50">{t('loading')}</p>
              </div>
            ) : (
              <SkillList skills={skills} viewMode={viewMode} isCompact={true} onRefresh={fetchSkills} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
