import os
import re
import logging

from github import Github, GithubException

logger = logging.getLogger(__name__)

# GitHub 클라이언트 초기화
# 환경변수에서 토큰과 저장소 이름을 가져옴
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")  # 예: "username/promptshare-skills-Repo"


def _get_repo():
    """GitHub 저장소 객체를 가져옵니다."""
    if not GITHUB_TOKEN or not GITHUB_REPO:
        raise ValueError(
            "GITHUB_TOKEN 또는 GITHUB_REPO 환경변수가 설정되지 않았습니다. "
            ".env 파일을 확인해 주세요."
        )

    g = Github(GITHUB_TOKEN)
    return g.get_repo(GITHUB_REPO)


def _sanitize_filename(title: str) -> str:
    """파일명에 사용할 수 없는 특수문자를 제거합니다."""
    # 한글, 영문, 숫자, 언더스코어, 하이픈만 허용
    sanitized = re.sub(r'[^\w\s가-힣-]', '', title)
    # 공백을 언더스코어로 치환
    sanitized = sanitized.strip().replace(' ', '_')
    return sanitized or 'untitled'


def upload_to_github(department: str, title: str, content: str) -> dict:
    """
    AI가 생성한 스킬 파일(마크다운)을 GitHub Repository에 커밋합니다.

    파일 경로 규칙: skills/{부서명}/{스킬제목}.md
    - 부서 폴더로 자동 분류되어 관리가 쉽습니다.

    반환값:
    - file_path: 생성된 파일 경로
    - html_url: GitHub 웹에서 볼 수 있는 URL
    """
    try:
        repo = _get_repo()

        safe_title = _sanitize_filename(title)
        file_path = f"skills/{department}/{safe_title}.md"

        commit_message = f"{department} 부서 스킬 추가: {title}"

        # 동일한 파일이 이미 존재하는지 확인
        try:
            existing = repo.get_contents(file_path)
            # 이미 존재하면 업데이트 (덮어쓰기)
            result = repo.update_file(
                path=file_path,
                message=f"{commit_message} (수정)",
                content=content,
                sha=existing.sha,
            )
            logger.info(f"기존 스킬 파일 업데이트: {file_path}")
        except GithubException:
            # 파일이 없으면 신규 생성
            result = repo.create_file(
                path=file_path,
                message=commit_message,
                content=content,
            )
            logger.info(f"새 스킬 파일 생성: {file_path}")

        return {
            "file_path": file_path,
            "html_url": result["content"].html_url,
        }

    except ValueError as e:
        logger.error(f"환경변수 설정 오류: {e}")
        raise

    except GithubException as e:
        logger.error(f"GitHub API 에러 (status={e.status}): {e.data}")
        raise

    except Exception as e:
        logger.error(f"GitHub 업로드 실패: {e}")
        raise


def list_skills_from_github() -> list:
    """
    GitHub Repository의 skills/ 폴더 내 파일 목록을 조회합니다.
    부서별 하위 폴더를 재귀적으로 탐색하여 모든 스킬 파일을 반환합니다.
    """
    try:
        repo = _get_repo()

        skills = []

        try:
            # skills/ 폴더의 하위 내용 조회 (부서별 폴더들)
            department_folders = repo.get_contents("skills")
        except GithubException:
            # skills 폴더 자체가 없으면 빈 목록 반환
            return []

        for folder in department_folders:
            if folder.type == "dir":
                # 각 부서 폴더 안의 파일 목록 조회
                department_name = folder.name

                try:
                    files = repo.get_contents(folder.path)
                    for f in files:
                        if f.name.endswith(".md"):
                            skills.append({
                                "name": f.name.replace(".md", "").replace("_", " "),
                                "path": f.path,
                                "department": department_name,
                                "html_url": f.html_url,
                            })
                except GithubException:
                    logger.warning(f"폴더 조회 실패: {folder.path}")
                    continue

        return skills

    except ValueError as e:
        logger.error(f"환경변수 설정 오류: {e}")
        raise

    except Exception as e:
        logger.error(f"GitHub 목록 조회 실패: {e}")
        raise
