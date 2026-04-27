import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useNotification } from '../contexts/NotificationContext'
import api from '../services/api'

// 프로필 페이지 컴포넌트
export default function ProfilePage() {
  const { user, login, logout } = useAuth()
  const { t } = useLanguage()
  const { notify } = useNotification()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        department: user.department || ''
      })
    }
  }, [user])

  // 프로필 수정
  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await api.put('/users/me', formData)
      
      // AuthContext의 user 정보를 최신화합니다.
      login(localStorage.getItem('token'), response.data)
      
      notify(t('profile_update_success'), 'success', true)
    } catch (err) {
      console.error('Update error:', err)
      const errorMsg = err.response?.data?.detail || t('server_error')
      notify(errorMsg, 'error', true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 프로필 삭제
  const handleDeleteAccount = async () => {
    if (!window.confirm(t('delete_account_confirm') || '정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      return
    }

    try {
      await api.delete('/users/me')
      notify(t('delete_account_success') || '회원 탈퇴가 완료되었습니다.', 'success')
      logout()
      navigate('/')
    } catch (err) {
      notify(err.response?.data?.detail || 'Delete failed', 'error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-text mb-2 uppercase tracking-tighter">My Profile</h1>
        <p className="text-text-muted text-sm">{t('manage_profile_desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 왼쪽: 프로필 요약 카드 */}
        <div className="md:col-span-1">
          <div className="bg-bg-sidebar border border-border rounded-3xl p-8 text-center shadow-sm">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-3xl shadow-inner mx-auto mb-6 uppercase">
              {user?.name?.substring(0, 1) || 'U'}
            </div>
            <h2 className="text-xl font-bold text-text mb-1">{user?.name}</h2>
            <p className="text-sm text-primary font-black uppercase tracking-widest opacity-80 mb-6">{user?.department || 'Member'}</p>
            
            <div className="pt-6 border-t border-border/50 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Email</span>
                <span className="text-text font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Role</span>
                <span className="text-text font-medium">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 수정 폼 및 위험 구역 */}
        <div className="md:col-span-2 space-y-6">
          {/* 정보 수정 섹션 */}
          <section className="bg-bg-sidebar border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('edit_info')}
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase ml-1">{t('nickname')}</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase ml-1">{t('department')}</label>
                  <input 
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full bg-bg-input border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? t('saving') : t('save_changes')}
                </button>
              </div>
            </form>
          </section>

          {/* 회원 탈퇴 - 디자인 축소 및 슬림화 */}
          <section className="bg-bg-sidebar border border-red-500/10 rounded-2xl px-6 py-4 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/5 text-red-500 rounded-lg group-hover:bg-red-500/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-bold text-red-500/80">{t('danger_zone')}</h3>
                <p className="text-[10px] text-text-muted">{t('danger_zone_desc')}</p>
              </div>
            </div>
            
            <button 
              onClick={handleDeleteAccount}
              className="text-[10px] font-bold text-text-muted hover:text-red-500 border border-border hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all active:scale-95"
            >
              {t('withdraw')}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
