from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.skill import router as skill_router
from app.db.database import engine, Base
from app.db.model.user import User
from app.db.model.skill import Skill

load_dotenv()

# FastAPI 앱 초기화
app = FastAPI(title="PromptShare API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers.user import router as user_router

# 라우터 등록
app.include_router(skill_router)
app.include_router(user_router)

@app.on_event("startup")
async def startup():
    # DB 테이블 생성 (비동기 방식)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def health_check():
    return {"status": "ok", "message": "PromptShare API is running"}
