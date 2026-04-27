from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc
from typing import List, Optional
from app.db.model.skill import Skill
from pydantic import BaseModel

class SkillCreate(BaseModel):
    title: str
    department: str
    file_path: str
    github_url: Optional[str] = None
    summary: Optional[str] = None
    author_id: Optional[int] = None

# 스킬 생성
async def create_skill(db: AsyncSession, skill_data: SkillCreate) -> Skill:
    db_skill = Skill(
        title=skill_data.title,
        department=skill_data.department,
        file_path=skill_data.file_path,
        github_url=skill_data.github_url,
        summary=skill_data.summary,
        content=skill_data.content, # 전체 내용 저장
        author_id=skill_data.author_id
    )
    db.add(db_skill)
    await db.commit()
    await db.refresh(db_skill)
    
    # 응답을 위해 author 정보를 명시적으로 로드합니다.
    result = await db.execute(
        select(Skill)
        .options(selectinload(Skill.author))
        .where(Skill.id == db_skill.id)
    )
    return result.scalar_one()

# 스킬 목록 조회 (최신순 - 작성자 정보 포함)
async def get_skills(db: AsyncSession, skip: int = 0, limit: int = 20) -> List[Skill]:
    result = await db.execute(
        select(Skill)
        .options(selectinload(Skill.author))
        .order_by(desc(Skill.created_at))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

# 특정 스킬 상세 조회 (작성자 정보 포함)
async def get_skill_by_id(db: AsyncSession, skill_id: int) -> Optional[Skill]:
    result = await db.execute(
        select(Skill)
        .options(selectinload(Skill.author))
        .where(Skill.id == skill_id)
    )
    return result.scalar_one_or_none()

# 특정 유저의 스킬 조회
async def get_user_skills(db: AsyncSession, user_id: int) -> List[Skill]:
    result = await db.execute(
        select(Skill)
        .options(selectinload(Skill.author))
        .where(Skill.author_id == user_id)
        .order_by(desc(Skill.created_at))
    )
    return result.scalars().all()
