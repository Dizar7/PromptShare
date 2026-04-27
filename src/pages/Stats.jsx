import { useState, useEffect } from 'react'
import api from '../services/api'
import { useLanguage } from '../contexts/LanguageContext'

// 통계 페이지 컴포넌트
export default function Stats() {
  const [stats, setStats] = useState({ dept_counts: {}, dept_views: {} })
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await api.get('/skill/stats/summary')
        setStats(response.data)
      } catch (err) {
        console.error('통계 데이터 로드 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  // 데이터 가공 (랭킹 순 정렬)
  const sortedDeptsByCount = Object.entries(stats.dept_counts).sort((a, b) => b[1] - a[1])
  const sortedDeptsByViews = Object.entries(stats.dept_views).sort((a, b) => b[1] - a[1])
  
  const maxCount = Math.max(...Object.values(stats.dept_counts), 1)
  const maxViews = Math.max(...Object.values(stats.dept_views), 1)

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 페이지 헤더 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          <h1 className="text-3xl font-black tracking-tighter text-text">{t('stats')}</h1>
        </div>
        <p className="text-text-muted text-sm max-w-xl font-medium">
          {t('stats_desc')}
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          <div className="h-64 bg-bg-card border border-border rounded-[28px]"></div>
          <div className="h-64 bg-bg-card border border-border rounded-[28px]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 부서별 등록수 현황 */}
          <div className="bg-bg-card border border-border rounded-[28px] p-8 shadow-sm group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">{t('stats_count')}</h3>
              <div className="w-8 h-8 bg-bg-input rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
            </div>
            
            <div className="space-y-6">
              {sortedDeptsByCount.length > 0 ? (
                sortedDeptsByCount.map(([dept, count]) => (
                  <div key={dept} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-text">{t(`dept_${dept.toLowerCase()}`) || dept}</span>
                      <span className="text-text-muted">{count} Skills</span>
                    </div>
                    <div className="w-full h-2 bg-bg-input rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/40 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-12 text-xs text-text-muted italic">{t('no_skills')}</p>
              )}
            </div>
          </div>

          {/* 가장 활발한 부서 (조회수 기준) */}
          <div className="bg-bg-card border border-border rounded-[28px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">{t('stats_active')}</h3>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>
            
            <div className="space-y-6">
              {sortedDeptsByViews.length > 0 ? (
                sortedDeptsByViews.map(([dept, views], idx) => (
                  <div key={dept} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-text">{t(`dept_${dept.toLowerCase()}`) || dept}</span>
                      <span className="text-primary">{views} Views</span>
                    </div>
                    <div className="w-full h-2 bg-bg-input rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${idx === 0 ? 'bg-primary' : 'bg-primary/60'}`}
                        style={{ width: `${(views / maxViews) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-12 text-xs text-text-muted italic">{t('no_skills')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 안내 문구 */}
      <div className="bg-bg-input/50 border border-border/50 rounded-3xl p-6 text-center">
        <p className="text-[11px] font-bold text-text-muted opacity-60">
          * 데이터는 스킬 등록 및 실시간 조회수를 기반으로 1분마다 업데이트됩니다.
        </p>
      </div>
    </div>
  )
}
