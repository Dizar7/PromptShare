import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import api from '../services/api'

// 생성된 스킬 목록 컴포넌트: 격자(Grid) 및 목록(List) 보기 지원
export default function SkillList({ skills = [], viewMode = 'grid', isCompact = false, onRefresh }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { notify } = useNotification()
  
  // 상세 페이지 이동 핸들러
  const handleSkillClick = (skillId) => {
    navigate(`/skill/${skillId}`)
  }

  // 삭제 핸들러
  const handleDelete = async (e, skillId) => {
    e.stopPropagation() // 상세 페이지 이동 방지
    if (!window.confirm(t('delete_skill_confirm'))) return

    try {
      await api.delete(`/skill/${skillId}`)
      notify(t('delete_skill_success'), 'success')
      if (onRefresh) onRefresh()
      else window.location.reload()
    } catch (err) {
      console.error('삭제 실패:', err)
      notify(t('delete_skill_failed'), 'error')
    }
  }
  
  // 스킬이 없을 경우 표시할 안내 화면
  if (skills.length === 0) {
    return (
      <div className="text-center py-20 bg-bg-card bg-opacity-40 rounded-3xl border-2 border-dashed border-border animate-fadeIn">
        <div className="w-16 h-16 bg-bg-input rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-text-muted opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text mb-1 tracking-tight">{t('no_skills')}</h3>
        <p className="text-text-muted text-xs">{t('no_skills_desc')}</p>
      </div>
    )
  }

  // 리스트 형태(List View)로 렌더링
  if (viewMode === 'list') {
    return (
      <div className="space-y-3 animate-fadeIn">
        {skills.map((skill, index) => (
          <div 
            key={index} 
            onClick={() => handleSkillClick(skill.id)}
            className="group flex items-center gap-4 bg-bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-text group-hover:text-primary transition-colors truncate">
                {skill.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-primary font-bold">{skill.author?.name || 'Unknown'}</span>
                <span className="text-[10px] text-text-muted opacity-40">•</span>
                <p className="text-[10px] text-text-muted truncate">{skill.summary || `${skill.department} • AI Optimization`}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              {user && user.id === skill.author_id && (
                <button 
                  onClick={(e) => handleDelete(e, skill.id)}
                  className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  title={t('delete_skill')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10 uppercase">{t('open')}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 격자 형태(Grid View)로 렌더링
  return (
    <div className={`grid gap-5 ${isCompact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
      {skills.map((skill, index) => (
        <div 
          key={index} 
          onClick={() => handleSkillClick(skill.id)}
          className="group bg-bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-slideUp"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-[10px] shadow-inner uppercase">
                {skill.author?.name?.[0] || '?'}
              </div>
              <span className="text-[10px] font-bold text-text-muted">{skill.author?.name || 'Unknown'}</span>
            </div>
            
            {user && user.id === skill.author_id && (
              <button 
                onClick={(e) => handleDelete(e, skill.id)}
                className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                title={t('delete_skill')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="mb-5">
            <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors line-clamp-1 mb-1 tracking-tight">
              {skill.title}
            </h3>
            <p className="text-xs text-text-body line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 font-medium">
              {skill.summary || `Professional AI skill optimized for ${skill.department} department.`}
            </p>
          </div>
          
          <div className="flex items-center gap-2 pt-3 border-t border-border border-opacity-50">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-bg-input text-text-muted border border-border">
              {skill.department}
            </span>
            <div className="flex items-center gap-1 ml-auto text-[10px] font-bold text-text-muted group-hover:text-primary transition-colors">
              <span>{skill.view_count || 0} {t('uses')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
