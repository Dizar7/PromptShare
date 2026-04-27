from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path
from dotenv import load_dotenv
import os

# 설정 파일 경로
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

# 환경 변수 로드
if ENV_PATH.exists():
    load_dotenv(ENV_PATH)

class Settings(BaseSettings):
    # Database 설정 (PostgreSQL)
    db_user: str = Field("myuser", alias="DB_USER")
    db_password: str = Field("mypassword", alias="DB_PASSWORD")
    db_host: str = Field("localhost", alias="DB_HOST")
    db_port: str = Field("5432", alias="DB_PORT")
    db_name: str = Field("promptshare", alias="DB_NAME")

    # App 설정
    app_port: int = Field(8000, alias="APP_PORT")
    app_host: str = Field("localhost", alias="APP_HOST")

    # JWT 설정
    secret_key: str = Field("9a6d0f8c3b4e1a2d5f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z", alias="SECRET_KEY")
    algorithm: str = Field("HS256", alias="ALGORITHM")
    access_token_expire_minutes: int = Field(480, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(7, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    # External APIs
    gemini_api_key: str = Field("", alias="GEMINI_API_KEY")
    github_token: str = Field("", alias="GITHUB_TOKEN")
    github_repo: str = Field("", alias="GITHUB_REPO")

    class Config:
        env_file = ENV_PATH
        extra = "allow"
        populate_by_name = True
        case_sensitive = True

    @property
    def database_url(self) -> str:
        """PostgreSQL Async URL"""
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

settings = Settings()
