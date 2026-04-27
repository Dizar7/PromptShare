import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useNotification } from '../contexts/NotificationContext'
import api from '../services/api'

// 로그인 페이지 컴포넌트
export default function LoginPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const { notify } = useNotification()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', password)

      // 1. 로그인 요청
      const loginRes = await api.post('/users/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })

      const { access_token } = loginRes.data
      
      // 2. 토큰을 localStorage에 즉시 저장 (api interceptor가 바로 사용할 수 있도록)
      localStorage.setItem('token', access_token)

      // 3. 내 정보 조회 (api.js가 이제 Authorization 헤더를 자동으로 붙임)
      const userRes = await api.get('/users/me')
      
      // 4. 상태 업데이트 및 이동
      login(access_token, userRes.data)
      notify(t('login_success'), 'success', true) // force: true 추가
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      const errorMsg = err.response?.data?.detail || t('login_failed')
      notify(errorMsg, 'error', true) // force: true 추가
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-container">
      {/* 뒤로가기 버튼 */}
      <button onClick={() => navigate('/')} className="auth-back-btn">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>{t('go_back')}</span>
      </button>

      <div className="auth-card">
        <div className="auth-header">
          <h1>PromptShare</h1>
          <p>{t('welcome_back')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>{t('email')}</label>
            <input 
              type="email" 
              placeholder="example@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>{t('password')}</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? t('logging_in') : t('login')}
          </button>
        </form>

        <div className="auth-footer">
          <span>{t('no_account')}</span>
          <Link to="/signup" className="auth-link">
            {t('signup')}
          </Link>
        </div>
      </div>

      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-main);
          padding: 20px;
          position: relative;
        }

        .auth-back-btn {
          position: absolute;
          top: 32px;
          left: 32px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .auth-back-btn:hover {
          color: var(--text);
          background: var(--bg-card);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          background: var(--bg-card);
          padding: 40px;
          border-radius: 24px;
          border: 1px solid var(--border);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-header h1 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .auth-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin-left: 4px;
        }

        .input-group input {
          background: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text);
          font-size: 14px;
          transition: all 0.2s;
        }

        .input-group input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .auth-submit-btn {
          margin-top: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
        }

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .auth-link {
          color: #6366f1;
          font-weight: 700;
          margin-left: 8px;
          text-decoration: none;
        }

        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
