from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.db.schema.user import UserBase

# 스킬 기본 스키마
class SkillBase(BaseModel):
    title: str = Field(..., description="스킬 제목")
    department: str = Field(..., description="부서")
    summary: Optional[str] = Field(None, description="요약 내용")

    class Config:
        from_attributes = True

# 생성 요청용
class SkillCreate(SkillBase):
    raw_prompt: str = Field(..., description="원본 프롬프트")

# DB 저장용
class CRUD_SkillCreate(BaseModel):
    title: str
    department: str
    file_path: str
    github_url: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    author_id: Optional[int] = None

# 응답용
class SkillResponse(SkillBase):
    id: int
    view_count: int
    created_at: datetime
    content: Optional[str] = None
    author_id: Optional[int]
    author: Optional[UserBase]

    class Config:
        from_attributes = True
