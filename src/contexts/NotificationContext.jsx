import { createContext, useContext, useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  // 알림 활성화 여부 초기화 (기본값: true)
  const [notifEnabled, setNotifEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('ps_notif_enabled')
      return saved !== null ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })

  // 상태 변경 시 로컬 스토리지 저장
  useEffect(() => {
    localStorage.setItem('ps_notif_enabled', JSON.stringify(notifEnabled))
  }, [notifEnabled])

  // 전역 알림 함수
  const notify = (message, type = 'success', force = false) => {
    // 알림이 꺼져 있어도 force가 true면 표시 (중요 안내용)
    if (!notifEnabled && !force) {
      console.log('알림이 비활성화 상태입니다:', message)
      return
    }

    const toastOptions = {
      duration: 4000,
      position: 'top-right',
      // 최상위 레이어 보장
      style: {
        background: 'var(--bg-card)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        fontSize: '14px',
        fontWeight: '700',
        borderRadius: '20px',
        padding: '16px 24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        minWidth: 'fit-content',
        maxWidth: 'none',
        whiteSpace: 'nowrap'
      },
    }

    if (type === 'success') toast.success(message, toastOptions)
    else if (type === 'error') toast.error(message, toastOptions)
    else toast(message, toastOptions)
  }

  return (
    <NotificationContext.Provider value={{ notifEnabled, setNotifEnabled, notify }}>
      {children}
      {/* Toaster에 직접 컨테이너 스타일과 z-index 부여 */}
      <Toaster 
        containerStyle={{
          top: 40,
          right: 40,
          zIndex: 99999
        }}
        toastOptions={{
          className: 'premium-toast',
        }}
      />
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    return { notifEnabled: true, setNotifEnabled: () => {}, notify: () => {} }
  }
  return context
}
