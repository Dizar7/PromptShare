import { useState } from 'react'
import api from '../services/api'

// 부서/직무 목록 (드롭다운 옵션)
const DEPARTMENTS = [
  '개발',
  '기획',
  '마케팅',
  '디자인',
  '영업',
  '인사',
  '기타',
]

// SkillForm: 스킬 초안 작성 폼
// 사용자가 대략적인 노하우를 텍스트로 입력하면
// 백엔드(AI)가 표준 스킬 파일로 변환하여 GitHub에 업로드합니다.
export default function SkillForm({ onSkillCreated }) {
  const [department, setDepartment] = useState('')
  const [title, setTitle] = useState('')
  const [rawPrompt, setRawPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // 폼 유효성 검사
  const isFormValid = department && title.trim() && rawPrompt.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await api.post('/skill/create', {
        department,
        title: title.trim(),
        raw_prompt: rawPrompt.trim(),
      })

      setResult(response.data)

      // 부모 컴포넌트에 새 스킬 생성 알림 (목록 새로고침용)
      if (onSkillCreated) {
        onSkillCreated(response.data)
      }

      // 성공 후 폼 초기화
      setDepartment('')
      setTitle('')
      setRawPrompt('')
    } catch (err) {
      console.error('스킬 생성 실패:', err)
      setError(
        err.response?.data?.detail ||
        '스킬 파일 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 부서 선택 */}
        <div>
          <label htmlFor="department" className="block text-text font-medium text-sm mb-2">
            부서 / 직무
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-bg-input text-text rounded-xl px-4 py-3 border border-border
                       focus:border-primary focus:outline-none transition-all
                       shadow-input"
          >
            <option value="">부서를 선택하세요</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* 스킬 제목 */}
        <div>
          <label htmlFor="skill-title" className="block text-text font-medium text-sm mb-2">
            스킬 제목
          </label>
          <input
            id="skill-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='예: "코드 리뷰 자동화 봇"'
            className="w-full bg-bg-input text-text rounded-xl px-4 py-3 border border-border
                       focus:border-primary focus:outline-none transition-all
                       placeholder:text-text-muted shadow-input"
          />
        </div>

        {/* 프롬프트 초안 입력 */}
        <div>
          <label htmlFor="raw-prompt" className="block text-text font-medium text-sm mb-2">
            노하우 / 프롬프트 초안
          </label>
          <textarea
            id="raw-prompt"
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            placeholder='대충 적어도 괜찮습니다. 예: "이 코드 던져주면 무조건 주석 달고 리팩토링하게 만들어줘"'
            rows={5}
            className="w-full bg-bg-input text-text rounded-xl px-4 py-3 border border-border
                       focus:border-primary focus:outline-none transition-all resize-none
                       placeholder:text-text-muted shadow-input"
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-danger text-sm animate-fadeIn flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-primary-gradient text-white font-semibold
                     rounded-xl px-6 py-3.5 transition-all duration-300
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:shadow-button hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
              AI가 스킬 파일을 작성하고 있습니다...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI 포맷팅 + GitHub 업로드
            </span>
          )}
        </button>
      </form>

      {/* 성공 결과 표시 */}
      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3 animate-slideUp">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <span className="text-success font-bold text-sm">GitHub 업로드 완료!</span>
          </div>
          <div className="text-text-body text-sm space-y-1.5 pl-7">
            <p><span className="text-text-muted">파일 경로:</span> {result.file_path}</p>
            <p><span className="text-text-muted">한 줄 요약:</span> {result.summary}</p>
          </div>
          {result.github_url && (
            <a
              href={result.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 ml-7 text-primary hover:text-primary-dark text-sm font-medium transition-colors"
            >
              GitHub에서 확인하기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  )
}
