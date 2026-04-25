import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ai_service import format_skill_prompt
from app.services.git_service import upload_to_github, list_skills_from_github

logger = logging.getLogger(__name__)

router = APIRouter(prefix='/skill', tags=['Skill'])


# 요청 스키마: 프론트엔드에서 보내는 스킬 초안 데이터
class SkillCreateRequest(BaseModel):
    department: str
    title: str
    raw_prompt: str


# 응답 스키마: AI 포맷팅 + GitHub 업로드 결과
class SkillCreateResponse(BaseModel):
    file_path: str
    summary: str
    github_url: str | None = None


# 스킬 목록 조회 응답
class SkillListItem(BaseModel):
    name: str
    path: str
    department: str | None = None
    html_url: str | None = None


class SkillListResponse(BaseModel):
    skills: list[SkillListItem]


@router.post("/create", response_model=SkillCreateResponse)
async def create_skill(request: SkillCreateRequest):
    """
    사용자의 대충 쓴 프롬프트를 AI가 표준 스킬 파일로 변환한 뒤,
    GitHub Repository에 자동 커밋합니다.
    """
    try:
        # 1단계: AI(Gemini)로 스킬 파일 포맷팅
        formatted = await format_skill_prompt(
            department=request.department,
            title=request.title,
            raw_prompt=request.raw_prompt,
        )

        # 2단계: GitHub에 마크다운 파일 자동 업로드
        git_result = upload_to_github(
            department=request.department,
            title=request.title,
            content=formatted["formatted_prompt"],
        )

        return SkillCreateResponse(
            file_path=git_result["file_path"],
            summary=formatted["summary"],
            github_url=git_result.get("html_url"),
        )

    except Exception as e:
        logger.error(f"스킬 생성 실패: {e}")
        raise HTTPException(
            status_code=500,
            detail="스킬 파일 생성 중 오류가 발생했습니다."
        )


@router.get("/list", response_model=SkillListResponse)
async def get_skill_list():
    """
    GitHub Repository에 등록된 스킬 파일 목록을 조회합니다.
    """
    try:
        skills = list_skills_from_github()
        return SkillListResponse(skills=skills)

    except Exception as e:
        logger.error(f"스킬 목록 조회 실패: {e}")
        raise HTTPException(
            status_code=500,
            detail="스킬 목록을 불러오는 중 오류가 발생했습니다."
        )
