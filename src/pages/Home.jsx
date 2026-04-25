import { useState } from 'react'
import SkillForm from '../components/SkillForm'
import SkillList from '../components/SkillList'

// Home: 메인 페이지 - 스킬 작성 폼과 스킬 목록 대시보드를 조합
export default function Home() {
  // 스킬 목록 새로고침을 위한 트리거
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // 새 스킬 생성 완료 시 목록 새로고침
  const handleSkillCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* 히어로 배경 그라데이션 (라벤더 - 핑크 - 하늘색) */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* 배경 장식 원형 (화사한 Glow) */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-300/20 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[40vw] h-[40vw] bg-pink-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] w-[25vw] h-[25vw] bg-cyan-200/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-10">

        {/* 헤더 */}
        <header className="text-center space-y-4">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-border shadow-card backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-primary font-medium text-sm">AI Powered Workspace</span>
          </div>
          
          {/* 제목 */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-text">Prompt</span>
            <span className="text-transparent bg-clip-text bg-primary-gradient">Share</span>
          </h1>

          {/* 부제목 */}
          <p className="text-text-body text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            대충 적어도 괜찮습니다.<br className="md:hidden" />
            AI가 완벽한 마크다운 스킬 파일로 다듬어<br className="md:hidden" />
            GitHub에 공유해 드립니다.
          </p>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="space-y-8">
          
          {/* 스킬 작성 섹션 */}
          <section className="bg-bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 relative overflow-hidden">
            {/* 상단 그라데이션 라인 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-gradient" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-text font-bold text-lg">
                  새 스킬 등록
                </h2>
                <p className="text-text-muted text-sm">노하우를 입력하면 AI가 전문 스킬 파일로 변환합니다</p>
              </div>
            </div>
            <SkillForm onSkillCreated={handleSkillCreated} />
          </section>

          {/* 스킬 목록 섹션 */}
          <section className="bg-bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-text font-bold text-lg">
                    스킬 보드
                  </h2>
                  <p className="text-text-muted text-sm">GitHub에 등록된 스킬 파일을 확인합니다</p>
                </div>
              </div>
            </div>
            <SkillList refreshTrigger={refreshTrigger} />
          </section>
        </main>

        {/* 푸터 */}
        <footer className="text-center text-text-muted text-sm py-8 flex flex-col items-center gap-3">
          <p className="font-medium">PromptShare</p>
          <p className="text-xs">AI 기반 사내 스킬파일 자동화 및 공유 플랫폼</p>
          <div className="flex items-center gap-2 text-xs">
            <span>Powered by</span>
            <span className="px-2.5 py-1 bg-primary-50 text-primary rounded-lg border border-border font-medium">Gemini 2.5 Flash</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
