import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, List
from app.db.model.user import User
from app.db.schema.user import UserCreate
from app.core.security import hash_password, verify_password

#이메일로 유저 조회
async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

#아이디로 유저 조회
async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

#이메일+비밀번호 인증
async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    user = await get_user_by_email(db, email)
    if not user:
        return None
    
    # greenlet 에러 방지: CPU 작업을 별도 스레드에서 실행
    loop = asyncio.get_event_loop()
    is_valid = await loop.run_in_executor(None, verify_password, password, user.password_hash)
    
    if not is_valid:
        return None
    return user

#유저 생성
async def create_user(db: AsyncSession, user: UserCreate) -> User:
    hashed_pw = hash_password(user.password)
    
    db_user = User(
        email=user.email,
        password_hash=hashed_pw,
        name=user.name,
        department=user.department,
        role="USER"
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

#유저 정보 수정
async def update_user(db: AsyncSession, user_id: int, update_data: dict) -> User | None:
    db_user = await get_user_by_id(db, user_id)
    if not db_user:
        return None
    
    for key, value in update_data.items():
        if value is not None:
            setattr(db_user, key, value)
            
    await db.commit()
    await db.refresh(db_user)
    return db_user

#유저 삭제 (탈퇴)
async def delete_user(db: AsyncSession, user_id: int) -> bool:
    db_user = await get_user_by_id(db, user_id)
    if not db_user:
        return False
    
    await db.delete(db_user)
    await db.commit()
    return True
