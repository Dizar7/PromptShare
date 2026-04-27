from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

# 사용자 기본 스키마
class UserBase(BaseModel):
    email: EmailStr = Field(..., description="로그인 ID(이메일)")
    name: str = Field(..., max_length=100, description="이름")
    department: Optional[str] = Field(None, description="소속 부서")

    class Config:
        from_attributes = True

# 생성
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="비밀번호(평문 입력, 서버에서 해싱)")

# 업데이트
class UserUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

# 응답
class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    is_superuser: bool
    created_at: datetime

    class Config:
        from_attributes = True

# 인증 토큰 스키마
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
