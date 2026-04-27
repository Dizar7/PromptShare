from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.core.jwt import create_access_token, create_refresh_token
from app.db.crud import user as user_crud
from app.db.schema.user import UserCreate

#회원가입
async def register_user(db: AsyncSession, user_data: UserCreate):
    existing_user = await user_crud.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    return await user_crud.create_user(db, user_data)

#로그인
async def login_user(db: AsyncSession, email: str, password: str) -> dict | None:
    user = await user_crud.authenticate_user(db, email, password)
    if not user:
        return None

    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token({"sub": str(user.id), "email": user.email})

    return {
        "user": user,
        "access_token": access_token,
        "refresh_token": refresh_token,
    }
