import axios from 'axios'

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// 환경 변수 VITE_API_URL이 있으면 그걸 쓰고, 없으면 로컬 호스트(개발용)를 씁니다.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response Interceptor - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 서버 에러 시 콘솔에 로그 출력
    console.error('API 에러:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api
