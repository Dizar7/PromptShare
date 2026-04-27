# PromptShare: AI 기반 사내 지식 자산화 플랫폼

PromptShare는 조직 내 파편화된 AI 활용 노하우(Prompt/Skill)를 통합하고 표준화하기 위한 지식 공유 플랫폼입니다. 비개발 직군도 손쉽게 자신의 업무 노하우를 표준화된 마크다운 기반 스킬 파일로 변환하고 공유할 수 있도록 돕습니다.

---

## AI 협업 개발 및 생산성 (Vibe Coding)
본 프로젝트는 AI 코딩 어시스턴트(Antigravity/Gemini)를 단순한 코드 생성 도구가 아닌, 전략적 파트너로 활용하여 개발되었습니다.

- 아키텍처 설계: AI와의 질의응답을 통해 확장성을 고려한 FastAPI 및 React 기반의 클린 아키텍처 설계.
- 생산성 극대화: 기획 단계의 PRD 작성부터 백엔드 API 설계, 프론트엔드 UI 컴포넌트 구현까지 AI와 페어 프로그래밍을 진행하여 개발 속도를 획기적으로 향상.
- 기술적 난제 해결: JWT 인증 로직 및 데이터 정합성 문제, AI 할당량 소진 방지(Idempotency), 실시간 DB 스키마 마이그레이션 등 기술적 허들을 AI와의 실시간 협업으로 해결.

---

## 핵심 기능 (Key Features)
1. AI 기반 스킬 생성: 자연어 형태의 업무 노하우를 입력하면 AI가 표준 마크다운 형식으로 자동 정제 및 최적화.
2. 부서별 스킬 보드: 사내 조직 구조에 맞춘 카테고리 분류 및 전사 공유 대시보드 제공.
3. 사용자 맞춤형 관리: JWT 기반 보안 인증을 통한 개인 스킬 저장소 및 프로필 관리.
4. 인사이트 통계: 사내 스킬 활용도 및 등록 현황을 한눈에 파악할 수 있는 통계 기능(도입 예정).

---

## 기술 스택 (Tech Stack)
- 프론트엔드: React, Vite, Tailwind CSS, React Router
- 백엔드: FastAPI (Python), SQLAlchemy
- 데이터베이스: PostgreSQL (사용자 및 메타데이터 관리용)
- AI 연동: Gemini 2.5 Flash API (프롬프트 정제 및 자동 생성)
- 다국어 지원: i18n 기반 정적 번역 시스템 (비용 효율성 및 성능 최적화)
- 개발 도구: Docker, Git, Antigravity (AI Pair Programmer)

---

## 프로젝트 구조 (Project Structure)
- /backend: FastAPI 기반의 RESTful API 서버 및 비즈니스 로직
- /src: React 기반의 컴포넌트 중심 아키텍처 프론트엔드
- /public: 정적 자원 관리

---

## 실행 방법 (Getting Started)

### 백엔드 실행
1. 의존성 설치: `pip install -r requirements.txt`
2. 환경 변수 설정: `.env` 파일에 API 키 설정
3. 서버 실행: `uvicorn main:app --reload`

### 프론트엔드 실행
1. 의존성 설치: `npm install`
2. 개발 서버 실행: `npm run dev`

---

## 향후 로드맵 (Roadmap)
- 사내 GitHub 저장소 자동 푸시 및 동기화 기능 고도화.
- 모델별(GPT, Claude, Gemini) 프롬프트 출력 결과 비교 및 분석 기능 추가.
- 실시간 댓글 및 피드백 시스템을 통한 지식 선순환 구조 구축.
