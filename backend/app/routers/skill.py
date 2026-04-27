import logging
from typing import Annotated, List
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.db.model.skill import Skill
from app.db.schema.skill import SkillCreate, SkillResponse, SkillBase
from app.db.crud import skill as skill_crud
from app.services.ai_service import format_skill_prompt
from app.services.git_service import upload_to_github
from app.routers.user import oauth2_scheme
from app.core.jwt import verify_access_token

logger = logging.getLogger(__name__)

# 라우터 설정
router = APIRouter(prefix='/skill', tags=['Skill'])

# 의존성 주입 정의
DB_Dependency = Annotated[AsyncSession, Depends(get_db)]

# 스킬 생성
@router.post("/create", response_model=SkillResponse)
async def create_skill(
    request: SkillCreate, 
    db: DB_Dependency,
    token: str = Depends(oauth2_scheme)
):
    """AI를 이용한 스킬 생성 및 DB/GitHub 저장"""
    
    # 1. 토큰에서 유저 정보 추출 (작성자 정보는 필수)
    payload = verify_access_token(token)
    author_id = int(payload.get("sub"))
    
    if not author_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 정보가 올바르지 않습니다. 다시 로그인해 주세요."
        )

    # 2. AI(Gemini)로 스킬 파일 포맷팅 (예외 처리 강화)
    formatted_content = request.raw_prompt
    summary_content = "AI가 현재 사용량이 많아 요약문을 작성하지 못했습니다."
    
    try:
        formatted = await format_skill_prompt(
            department=request.department,
            title=request.title,
            raw_prompt=request.raw_prompt,
        )
        formatted_content = formatted["formatted_prompt"]
        summary_content = formatted["summary"]
    except Exception as ai_err:
        logger.warning(f"AI 포맷팅 실패 (원문 유지): {ai_err}")
        # 쿼터 초과 등의 에러 발생 시 원문을 그대로 사용함

    try:
        # 3. GitHub에 마크다운 파일 자동 업로드
        git_result = upload_to_github(
            department=request.department,
            title=request.title,
            content=formatted_content,
        )

        # 4. DB에 메타데이터 저장 (CRUD 도구 활용)
        from app.db.schema.skill import CRUD_SkillCreate
        new_skill_data = CRUD_SkillCreate(
            title=request.title,
            department=request.department,
            file_path=git_result["file_path"],
            github_url=git_result.get("html_url"),
            summary=summary_content,
            content=formatted_content, # 마크다운 전체 내용 추가
            author_id=author_id
        )
        
        return await skill_crud.create_skill(db, new_skill_data)

    except Exception as e:
        logger.error(f"스킬 생성 실패: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"스킬 저장 중 오류가 발생했습니다: {str(e)}"
        )

# 스킬 목록 조회
@router.get("/list", response_model=List[SkillResponse])
async def get_skill_list(db: DB_Dependency):
    """DB에 등록된 스킬 파일 목록 조회 (작성자 정보 포함)"""
    try:
        return await skill_crud.get_skills(db)

    except Exception as e:
        logger.error(f"스킬 목록 조회 실패: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="스킬 목록을 불러오는 중 오류가 발생했습니다."
        )

# 인기 스킬 조회 (조회수 기준)
@router.get("/popular", response_model=List[SkillResponse])
async def get_popular_skills(
    db: DB_Dependency,
    limit: int = 3
):
    """조회수(view_count)가 높은 인기 스킬 상위 N개 조회"""
    try:
        from sqlalchemy.orm import selectinload
        result = await db.execute(
            select(Skill)
            .options(selectinload(Skill.author))
            .order_by(Skill.view_count.desc(), Skill.created_at.desc())
            .limit(limit)
        )
        return result.scalars().all()
    except Exception as e:
        logger.error(f"인기 스킬 조회 실패: {e}")
        return []

# 내 스킬 목록 조회
@router.get("/me", response_model=List[SkillResponse])
async def get_my_skills(
    db: DB_Dependency,
    token: str = Depends(oauth2_scheme)
):
    """현재 로그인된 사용자가 작성한 스킬 목록 조회"""
    try:
        payload = verify_access_token(token)
        user_id = int(payload.get("sub"))
        return await skill_crud.get_user_skills(db, user_id)
    except Exception as e:
        logger.error(f"내 스킬 조회 실패: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="내 스킬 목록을 불러오는 중 오류가 발생했습니다."
        )

# 특정 스킬 상세 조회
@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill_detail(skill_id: int, db: DB_Dependency):
    """특정 스킬의 상세 정보 조회 (조회수 증가 포함)"""
    skill = await skill_crud.get_skill_by_id(db, skill_id)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 스킬을 찾을 수 없습니다."
        )
    
    # 조회수 증가 로직
    try:
        skill.view_count += 1
        await db.commit()
        await db.refresh(skill)
    except Exception as e:
        logger.error(f"조회수 업데이트 실패: {e}")
        # 조회수 업데이트 실패가 상세 조회를 방해하지 않도록 함
        await db.rollback()

    return skill

# 부서별 통계 조회
@router.get("/stats/summary")
async def get_dept_stats(db: DB_Dependency):
    """부서별 스킬 등록 수 및 활동량(조회수) 통계 조회"""
    from sqlalchemy import func
    from app.db.model.skill import Skill
    
    try:
        # 1. 부서별 스킬 개수 집계
        count_query = await db.execute(
            select(Skill.department, func.count(Skill.id).label("count"))
            .group_by(Skill.department)
        )
        counts = {row[0]: row[1] for row in count_query.all()}

        # 2. 부서별 총 조회수 집계
        view_query = await db.execute(
            select(Skill.department, func.sum(Skill.view_count).label("total_views"))
            .group_by(Skill.department)
        )
        views = {row[0]: int(row[1] or 0) for row in view_query.all()}

        return {
            "dept_counts": counts,
            "dept_views": views
        }
    except Exception as e:
        logger.error(f"통계 조회 실패: {e}")
        return {"dept_counts": {}, "dept_views": {}}

# 스킬 삭제
@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: int, 
    db: DB_Dependency,
    token: str = Depends(oauth2_scheme)
):
    """특정 스킬 삭제 (본인만 가능)"""
    # 1. 토큰에서 유저 정보 추출
    payload = verify_access_token(token)
    user_id = int(payload.get("sub"))

    # 2. 스킬 존재 여부 및 소유권 확인
    skill = await skill_crud.get_skill_by_id(db, skill_id)
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 스킬을 찾을 수 없습니다."
        )
    
    if skill.author_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="본인이 작성한 스킬만 삭제할 수 있습니다."
        )

    # 3. DB에서 삭제
    from sqlalchemy import delete
    await db.execute(delete(Skill).where(Skill.id == skill_id))
    await db.commit()
    
    return None

# 마크다운 파일 직접 업로드
@router.post("/upload", response_model=SkillResponse)
async def upload_skill_file(
    request: SkillCreate,
    db: DB_Dependency,
    token: str = Depends(oauth2_scheme)
):
    """기존 마크다운 파일을 직접 업로드하여 저장 (AI 정제 생략)"""
    
    # 1. 토큰에서 유저 정보 추출
    payload = verify_access_token(token)
    author_id = int(payload.get("sub"))
    
    # 2. 유저의 실제 부서 정보 조회
    from app.db.crud import user as user_crud
    current_user = await user_crud.get_user_by_id(db, author_id)
    user_dept = current_user.department if current_user else request.department
    
    # 3. 제목 자동 추출
    final_title = request.title
    if not final_title or final_title == "Untitled":
        for line in request.raw_prompt.split('\n'):
            if line.startswith('# '):
                final_title = line.replace('# ', '').strip()
                break

    try:
        # 4. GitHub에 바로 업로드
        git_result = upload_to_github(
            department=user_dept,
            title=final_title,
            content=request.raw_prompt,
        )

        # 5. DB 저장
        from app.db.schema.skill import CRUD_SkillCreate
        new_skill_data = CRUD_SkillCreate(
            title=final_title,
            department=user_dept,
            file_path=git_result["file_path"],
            github_url=git_result.get("html_url"),
            summary="사용자가 직접 업로드한 마크다운 파일입니다.",
            content=request.raw_prompt,
            author_id=author_id
        )
        
        return await skill_crud.create_skill(db, new_skill_data)

    except Exception as e:
        logger.error(f"파일 업로드 실패: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"파일 업로드 중 오류가 발생했습니다: {str(e)}"
        )
