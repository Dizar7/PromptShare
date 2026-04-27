import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'

// 스킬 상세 페이지 컴포넌트
export default function SkillDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()
  const { notify } = useNotification()
  const [skill, setSkill] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSkillDetail = async () => {
      setIsLoading(true)
      try {
        const response = await api.get(`/skill/${id}`)
        setSkill(response.data)
      } catch (err) {
        console.error('스킬 상세 로드 실패:', err)
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSkillDetail()
  }, [id, navigate])

  // 스킬 삭제
  const handleDelete = async () => {
    if (!window.confirm(t('delete_skill_confirm'))) return

    try {
      await api.delete(`/skill/${id}`)
      notify(t('delete_skill_success'), 'success')
      navigate(-1)
    } catch (err) {
      console.error('삭제 실패:', err)
      notify(t('delete_skill_failed'), 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-text-muted">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-sm font-black tracking-widest uppercase opacity-40">{t('loading')}</p>
      </div>
    )
  }

  if (!skill) return null

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fadeIn">
      {/* 뒤로가기 버튼 */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-xs font-black uppercase tracking-widest">{t('back_to_list')}</span>
      </button>

      {/* 스킬 메인 카드 */}
      <div className="bg-bg-card border border-border rounded-[40px] p-8 md:p-12 shadow-card relative overflow-hidden group">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-1000"></div>
        
        <div className="relative space-y-8">
          {/* 헤더 영역 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                {skill.department}
              </span>
              <span className="text-[10px] text-text-muted font-bold opacity-60">
                {new Date(skill.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-4xl font-black text-text tracking-tighter leading-tight">
              {skill.title}
            </h1>
          </div>

          {/* 요약 내용 */}
          <div className="bg-bg-input rounded-3xl p-8 border border-border/50 space-y-4">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-3 bg-primary rounded-full"></span>
              {t('skill_detail')}
            </h3>
            <p className="text-text leading-relaxed font-medium">
              {skill.summary || t('no_skills_desc')}
            </p>
          </div>

          {/* 전체 프롬프트 내용 표시 섹션 */}
          {skill.content && (
            <div className="bg-bg-card border border-border rounded-3xl overflow-hidden shadow-inner group/content">
              <div className="bg-bg-input px-6 py-3 border-b border-border flex justify-between items-center">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Full Prompt Content</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(skill.content)
                    notify('Copied to clipboard!', 'success')
                  }}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Copy All
                </button>
              </div>
              <div className="p-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                <pre className="text-sm text-text leading-relaxed whitespace-pre-wrap font-mono opacity-90">
                  {skill.content}
                </pre>
              </div>
            </div>
          )}

          {/* 하단 정보 및 액션 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black shadow-inner">
                {skill.author?.name?.[0] || '?'}
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">{t('author_info')}</p>
                <p className="text-sm font-bold text-text">{skill.author?.name || 'Unknown User'}</p>
              </div>
            </div>

            {/* 액션 버튼 영역 */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* 다운로드 버튼 추가 */}
              {skill.content && (
                <button 
                  onClick={() => {
                    const blob = new Blob([skill.content], { type: 'text/markdown' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${skill.title}.md`
                    a.click()
                    window.URL.revokeObjectURL(url)
                  }}
                  className="flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 px-6 py-4 rounded-2xl font-black hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download .md
                </button>
              )}

              {user && user.id === skill.author_id && (
                <button 
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-4 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {t('delete_skill')}
                </button>
              )}

              {/* GitHub 링크 */}
              {skill.github_url && (
                <a 
                  href={skill.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-text text-bg px-8 py-4 rounded-2xl font-black hover:-translate-y-1 hover:shadow-xl transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {t('view_on_github')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
