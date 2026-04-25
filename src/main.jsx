import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'

// App 부트스트랩: React 루트 마운트, 전역 스타일 로드
createRoot(document.getElementById('root')).render(
  <App />
)
