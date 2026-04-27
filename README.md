# PromptShare: AI 스킬 공유 플랫폼

<div align="center">

### **사내 지식 자산화를 위한 지능형 AI 프롬프트 관리 솔루션**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=flat-square&logo=googlegemini)](https://ai.google.dev/)

GitHub Repository: [Dizar7/PromptShare](https://github.com/Dizar7/PromptShare)

</div>

---

## 프로젝트 미리보기

<img width="1568" height="905" alt="스크린샷 2026-04-28 052508" src="https://github.com/user-attachments/assets/a88ee561-530f-40a5-a7df-cb47f7d7530f" />


---

## 프로젝트 소개

**PromptShare**는 개인의 로컬 환경이나 개별 저장소에 파편화되어 있는 AI 활용 노하우(Skill)를 통합하고 자산화하기 위한 **풀스택 글로벌 플랫폼**입니다. 비개발 직군도 손쉽게 자신의 업무 노하우를 표준화된 'AI 스킬 파일'로 변환하고, GitHub를 통해 공유할 수 있도록 돕습니다.

- **프로젝트 기간**: 2026.04.25~2026.04.26
- **팀 규모**: 1인 (Solo Project)
- **담당**: 기획(PRD 작성), UI/UX 디자인, 풀스택 개발(Front/Back), DB 설계, AI API 연동

> 본 프로젝트는 **AI 코딩 어시스턴트(Antigravity)**와 협업하여 기획부터 배포 준비까지 최단 기간에 완수하며 생산성을 극대화 했습니다.

---

## What I Built (핵심 성과)

### AI 기반 지능형 프롬프트 엔진
- **Gemini 2.5 Flash 연동**: 사용자의 거친 아이디어를 AI가 분석하여 표준 마크다운(Markdown) 기반의 정교한 시스템 프롬프트로 자동 최적화
- **GitHub 자동화(Automation)**: 생성된 스킬을 PyGithub를 통해 사내 공용 저장소로 즉시 자동 커밋 및 푸시하는 파이프라인 구축

### 글로벌 확장성 및 다국어 시스템
- **i18n 기반 4개 국어 지원**: 한국어, 영어, 일본어, 중국어 환경을 완벽하게 대응하여 글로벌 협업 환경 조성
- **실시간 언어 전환**: Context API를 활용한 전역 상태 관리로 UI 언어 및 데이터 형식을 실시간 전환

### 데이터 인사이트 및 대시보드
- **실시간 통계 시스템**: 부서별 스킬 등록 현황 및 조회수 기반의 활동 지수 시각화 대시보드 구현
- **조회수 기반 추천**: 실시간 메타데이터를 활용하여 인기 스킬을 메인 화면에 상단 배치하는 추천 엔진 구축

### 보안 및 아키텍처
- **JWT 인증 시스템**: 안전한 회원가입/로그인 및 개인별 프로필 관리 기능 구현
- **PostgreSQL 연동**: 사용자 계정 및 스킬 메타데이터 관리를 위한 관계형 DB 설계 및 연동
- **미니멀 프리미엄 UI**: Tailwind CSS를 활용한 다크 모드 지원 및 반응형 사이드바 레이아웃 설계

---

## 주요 기능 (Key Features)

1. **파일 직접 업로드**: AI 정제 외에도 사용자가 보유한 기존 `.md` 파일을 직접 업로드하여 관리할 수 있는 기능
2. **지능형 제목 추출**: 마크다운 본문의 헤더(`#`)를 분석하여 스킬 제목을 자동으로 설정하는 UX 최적화
3. **부서별 통계**: 사내 조직 구조에 맞춘 카테고리 분류 및 부서별 AI 활용도 트렌드 분석
4. **GitHub 동기화**: 모든 스킬 자산의 버전 관리를 GitHub에서 투명하게 관리

---

## 기술 스택 (Tech Stack)

- **Frontend**: React, Vite, Tailwind CSS, Context API, React Router, i18next
- **Backend**: FastAPI (Python), SQLAlchemy, PyGithub, JWT
- **Database**: PostgreSQL (Dockerized)
- **AI Engine**: Google Gemini 2.5 Flash API
- **Tools**: Docker, Git, VS Code(Antigravity)

---

## 실행 방법 (Getting Started)

### 1. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 정보를 입력합니다.
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=promptshare
GEMINI_API_KEY=your_key
GITHUB_TOKEN=your_token
```

### 2. 도커 실행 (DB & Backend)
```bash
docker-compose up -d
```

### 3. 프론트엔드 실행
```bash
npm install
npm run dev
```
