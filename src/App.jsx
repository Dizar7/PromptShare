import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { NotificationProvider } from './contexts/NotificationContext'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Recommended from './pages/Recommended'
import Stats from './pages/Stats'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import MySkills from './pages/MySkills'
import SkillDetailPage from './pages/SkillDetailPage'
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

// 전체 라우트 설정
export default function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* 인증 관련 페이지 (레이아웃 제외) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* 메인 레이아웃 적용 페이지 */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/recommended" element={<Recommended />} />
                <Route path="/my-skills" element={<MySkills />} />
                <Route path="/skill/:id" element={<SkillDetailPage />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              
              {/* 없는 페이지는 메인으로 리다이렉트 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  )
}
