import os
import json
import logging

import google.generativeai as genai

logger = logging.getLogger(__name__)

# Gemini API 클라이언트 초기화
# 환경변수에서 API 키를 가져옴 (보안: 절대 코드에 키를 하드코딩하지 않음)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


async def format_skill_prompt(department: str, title: str, raw_prompt: str) -> dict:
    """
    사용자가 대충 작성한 텍스트를 Gemini API를 사용하여
    AI 에이전트용 표준 마크다운 스킬 파일로 변환합니다.

    반환값:
    - formatted_prompt: 마크다운 형식의 완성된 스킬 파일 내용
    - summary: 파일의 핵심을 나타내는 한 줄 요약
    """

    # 프롬프트 설계
    # AI가 엉성한 텍스트를 체계적인 마크다운 문서로 바꿔주도록
    # 출력 형식을 JSON으로 강제하여 파싱이 용이하게 만듦
    prompt = f"""너는 AI 에이전트용 시스템 프롬프트(스킬 파일) 전문 편집자야.
아래 정보를 바탕으로 완성도 높은 마크다운 형식의 스킬 파일을 작성해.

[규칙]
- 스킬 파일은 실제 Claude, ChatGPT 등 AI 에이전트에 바로 적용 가능한 수준이어야 해
- 마크다운 형식으로 제목, 역할 정의, 규칙, 출력 형식 등을 체계적으로 구성해
- 사용자의 의도를 최대한 살리되, 모호한 부분은 구체적으로 보완해
- 한국어로 작성해

[입력 정보]
- 부서: {department}
- 스킬 제목: {title}
- 사용자 원본 텍스트: {raw_prompt}

[출력 형식]
반드시 아래 JSON 형식으로만 응답해. 다른 텍스트는 절대 포함하지 마.
{{
  "formatted_prompt": "마크다운 형식의 완성된 스킬 파일 전체 내용",
  "summary": "이 스킬을 한 줄로 요약한 설명 (20자 내외)"
}}"""

    try:
        # 실시간 모니터링을 위한 로그 추가
        print("\n" + "="*50)
        print("🤖 Gemini API 실제 호출됨! (Quota 소모 발생)")
        print(f"   - 모델: gemini-2.5-flash")
        print(f"   - 제목: {title}")
        print("="*50 + "\n")

        # google-generativeai 패키지 사용 (Gemini 2.5 Flash 무료 모델)
        # request_options를 통해 SDK 레벨의 자동 재시도(Retry)를 명시적으로 차단합니다.
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(
            prompt,
            request_options={"retry": None}  # 자동 재시도 절대 금지
        )

        # Gemini 응답에서 JSON 추출
        # 응답에 코드 블록(```json ... ```)이 포함될 수 있으므로 정리
        response_text = response.text.strip()

        if response_text.startswith("```"):
            # 코드 블록 제거 (```json ... ``` 형태)
            lines = response_text.split("\n")
            # 첫 줄(```json)과 마지막 줄(```) 제거
            response_text = "\n".join(lines[1:-1])

        result = json.loads(response_text)

        return {
            "formatted_prompt": result["formatted_prompt"],
            "summary": result["summary"],
        }

    except json.JSONDecodeError as e:
        logger.error(f"Gemini 응답 JSON 파싱 실패: {e}")
        logger.error(f"원본 응답: {response.text[:500]}")
        raise ValueError("AI 응답을 파싱할 수 없습니다.")

    except Exception as e:
        logger.error(f"Gemini API 호출 에러: {e}")
        raise
