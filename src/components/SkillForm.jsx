import { useState, useEffect } from 'react'
import api from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'
import { useNotification } from '../contexts/NotificationContext'

// 스킬 생성 폼 컴포넌트: 부서 선택, 제목, 프롬프트 입력 및 AI 처리 요청
export default function SkillForm({ onSkillCreated, importedText = '' }) {
  const { lang, t } = useLanguage()
  const { notify } = useNotification()
  const [formData, setFormData] = useState({
    department: '',
    title: '',
    raw_prompt: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 외부(파일 드롭 등)에서 텍스트가 들어오면 프롬프트 필드에 자동 입력
  useEffect(() => {
    if (importedText) {
      setFormData(prev => ({ ...prev, raw_prompt: importedText }))
    }
  }, [importedText])

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 폼 제출 핸들러 (백엔드 API 호출)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 중복 제출 방지: 이미 제출 중이면 즉시 리턴 (Ghost Call 차단)
    if (isSubmitting) return

    if (!formData.department || !formData.title || !formData.raw_prompt) {
      notify(lang === 'ko' ? '모든 필드를 입력해 주세요.' : 'Please fill in all fields.', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/skill/create', formData)
      setFormData({ department: '', title: '', raw_prompt: '' })
      if (onSkillCreated) onSkillCreated()
      
      // 실제 알림 기능 연동
      notify(lang === 'ko' ? '새 스킬이 성공적으로 등록되었습니다!' : 'New skill registered successfully!')
    } catch (err) {
      console.error('스킬 생성 실패:', err)
      notify(lang === 'ko' ? '생성 중 오류가 발생했습니다.' : 'Error occurred during creation.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 부서 선택 */}
        <div className="space-y-2">
          <label className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">{t('dept_label')}</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer font-bold"
          >
            <option value="">{t('dept_placeholder')}</option>
            <option value="개발팀">{t('dept_dev')}</option>
            <option value="기획팀">{t('dept_product')}</option>
            <option value="디자인팀">{t('dept_design')}</option>
            <option value="마케팅팀">{t('dept_marketing')}</option>
          </select>
        </div>

        {/* 스킬 제목 */}
        <div className="space-y-2">
          <label className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">{t('title_label')}</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={t('title_placeholder')}
            className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold placeholder:text-text-muted/50"
          />
        </div>
      </div>

      {/* 프롬프트 초안 입력 */}
      <div className="space-y-2">
        <label className="text-xs font-black text-text-muted uppercase tracking-widest pl-1">{t('prompt_label')}</label>
        <textarea
          name="raw_prompt"
          value={formData.raw_prompt}
          onChange={handleChange}
          rows="5"
          placeholder={t('prompt_placeholder')}
          className="w-full bg-bg-input border border-border rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none font-medium leading-relaxed placeholder:text-text-muted/50"
        ></textarea>
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-button hover:shadow-button-hover hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span className="relative flex items-center gap-2">
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          {isSubmitting ? t('loading') : t('submit_btn')}
        </span>
      </button>
    </form>
  )
}
