from dotenv import load_dotenv
load_dotenv()  # .env 파일을 읽어옵니다

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.skill import router as skill_router

# FastAPI 앱 초기화
app = FastAPI(title="PromptShare API", version="1.0.0")

# CORS 설정 - 프론트엔드(Vite 개발 서버)에서의 요청 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(skill_router)


@app.get("/")
async def health_check():
    return {"status": "ok", "message": "PromptShare API is running"}
