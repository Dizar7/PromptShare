from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated, List
from app.db.database import get_db
from app.db.schema.user import UserCreate, UserUpdate, UserResponse, Token
from app.db.crud import user as user_crud
from app.services import user as user_service
from app.core.jwt import verify_access_token

# OAuth2 설정
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

# 라우터 설정
router = APIRouter(prefix="/users", tags=["Users"])

# 의존성 주입 정의
DB_Dependency = Annotated[AsyncSession, Depends(get_db)]

# 회원가입
@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: DB_Dependency):
    """새로운 사용자 등록"""
    return await user_service.register_user(db, user_data)

# 로그인
@router.post("/login", response_model=Token)
async def login(db: DB_Dependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """이메일/비밀번호 로그인 및 토큰 발급"""
    result = await user_service.login_user(db, form_data.username, form_data.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "access_token": result["access_token"],
        "refresh_token": result["refresh_token"],
        "token_type": "bearer"
    }

# 내 정보 조회
@router.get("/me", response_model=UserResponse)
async def get_me(db: DB_Dependency, token: str = Depends(oauth2_scheme)):
    """현재 로그인된 사용자 정보 조회"""
    
    # 토큰 검증 및 페이로드 추출
    payload = verify_access_token(token)
    user_id = int(payload.get("sub"))
    
    user = await user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
    return user

# 내 정보 수정
@router.put("/me", response_model=UserResponse)
async def update_me(
    update_data: UserUpdate,
    db: DB_Dependency, 
    token: str = Depends(oauth2_scheme)
):
    """현재 로그인된 사용자 정보 수정"""
    payload = verify_access_token(token)
    user_id = int(payload.get("sub"))
    
    # 비밀번호 수정 시 해싱 처리
    update_dict = update_data.model_dump(exclude_unset=True)
    if "password" in update_dict:
        from app.core.security import hash_password
        update_dict["password_hash"] = hash_password(update_dict.pop("password"))
        
    user = await user_crud.update_user(db, user_id, update_dict)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
    return user

# 회원 탈퇴
@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(
    db: DB_Dependency, 
    token: str = Depends(oauth2_scheme)
):
    """현재 로그인된 사용자 계정 삭제(탈퇴)"""
    payload = verify_access_token(token)
    user_id = int(payload.get("sub"))
    
    success = await user_crud.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
    return None
