import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

// 메인 레이아웃 컴포넌트: 전체 페이지의 뼈대 (사이드바 + 헤더 + 콘텐츠 영역)
export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-bg text-text font-sans selection:bg-primary/20">
      {/* 좌측 내비게이션 사이드바 */}
      <Sidebar />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 상단 헤더 바 */}
        <Header />
        
        {/* 실제 페이지 내용이 렌더링되는 영역 */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10 animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
