import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useNotification } from '../contexts/NotificationContext'
import { useAuth } from '../contexts/AuthContext'

// 회원가입 페이지 컴포넌트
export default function SignupPage() {
  const { t } = useLanguage()
  const { notify } = useNotification()
  const { login } = useAuth()
  const navigate = useNavigate()
  
  // 회원가입 폼 데이터 상태
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    department: '',
    password: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 폼 데이터 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 회원가입 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      notify(t('password_mismatch'), 'error')
      return
    }

    setIsSubmitting(true)

    // 회원가입 API 호출
    try {
      const response = await fetch('http://localhost:8000/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          department: formData.department,
          password: formData.password
        }),
      })

      if (response.ok) {
        notify(t('signup_success'), 'success')
        navigate('/login')
      } else {
        const error = await response.json()
        notify(error.detail || 'Signup failed', 'error')
      }
    } catch (err) {
      notify('Server connection error', 'error')
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
          <p>{t('create_account')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>{t('email')}</label>
            <input 
              name="email"
              type="email" 
              placeholder="example@company.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>{t('name')}</label>
              <input 
                name="name"
                type="text" 
                placeholder={t('name_placeholder')}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>{t('department')}</label>
              <input 
                name="department"
                type="text" 
                placeholder={t('dept_placeholder')}
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>{t('password')}</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="input-group">
            <label>{t('confirm_password')}</label>
            <input 
              name="confirmPassword"
              type="password" 
              placeholder="••••••••" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? t('signing_up') : t('signup')}
          </button>
        </form>

        <div className="auth-footer">
          <span>{t('already_have_account')}</span>
          <Link to="/login" className="auth-link">
            {t('login')}
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
          max-width: 450px;
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
          gap: 16px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0; /* grid 내부에서 요소가 삐져나오는 것 방지 */
        }

        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin-left: 4px;
        }

        .input-group input {
          width: 100%; /* 부모 너비에 맞춤 */
          box-sizing: border-box; /* 패딩 포함 너비 계산 */
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
