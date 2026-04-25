import { useState, useEffect } from 'react'
import api from '../services/api'

// SkillList: 등록된 스킬 파일 목록을 조회하고 표시합니다.
// 백엔드가 GitHub Repository에서 파일 목록을 불러와 전달합니다.
export default function SkillList({ refreshTrigger }) {
  const [skills, setSkills] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 스킬 목록 불러오기
  const fetchSkills = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await api.get('/skill/list')
      setSkills(response.data.skills || [])
    } catch (err) {
      console.error('스킬 목록 조회 실패:', err)
      setError('스킬 목록을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 컴포넌트 마운트 시 + 새 스킬 생성 시 목록 새로고침
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSkills()
  }, [refreshTrigger])

  // 부서별 아이콘 색상 매핑 (화사한 톤)
  const deptColors = {
    '개발': 'bg-violet-100 text-violet-600',
    '기획': 'bg-blue-100 text-blue-600',
    '마케팅': 'bg-pink-100 text-pink-600',
    '디자인': 'bg-fuchsia-100 text-fuchsia-600',
    '영업': 'bg-amber-100 text-amber-600',
    '인사': 'bg-emerald-100 text-emerald-600',
    '기타': 'bg-gray-100 text-gray-600',
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          <span className="text-text-muted text-sm">스킬 목록을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger text-sm mb-3">{error}</p>
        <button
          onClick={fetchSkills}
          className="text-primary hover:text-primary-dark font-medium text-sm transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  // 빈 목록
  if (skills.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-bg-input rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-text-body font-medium text-sm">
          아직 등록된 스킬이 없습니다.
        </p>
        <p className="text-text-muted text-xs mt-1">
          위 폼에서 첫 번째 스킬을 등록해 보세요!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {skills.map((skill, index) => (
        <div
          key={skill.path || index}
          className="group bg-white border border-border rounded-xl p-4 
                     hover:border-border-hover hover:shadow-card-hover
                     transition-all duration-300 animate-fadeIn cursor-default"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* 부서 컬러 도트 */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold
                              ${deptColors[skill.department] || 'bg-gray-100 text-gray-600'}`}>
                {skill.department ? skill.department.charAt(0) : '?'}
              </div>
              <div className="min-w-0">
                {/* 스킬 제목 */}
                <h3 className="text-text font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {skill.name || '제목 없음'}
                </h3>
                {/* 부서 태그 */}
                {skill.department && (
                  <span className={`inline-block mt-0.5 text-xs rounded-md px-2 py-0.5 font-medium
                                  ${deptColors[skill.department] || 'bg-gray-100 text-gray-600'}`}>
                    {skill.department}
                  </span>
                )}
              </div>
            </div>
            {/* GitHub 링크 */}
            {skill.html_url && (
              <a
                href={skill.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-text-muted hover:text-primary text-xs font-medium
                           whitespace-nowrap transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-50"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
