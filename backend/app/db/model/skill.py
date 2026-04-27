from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class Skill(Base):
    __tablename__ = "skills"

    # 기본 정보
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), index=True, nullable=False)
    department = Column(String(100), index=True, nullable=False)
    file_path = Column(String(500), nullable=False)
    github_url = Column(String(500), nullable=True)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True) # 전체 마크다운 프롬프트 내용
    view_count = Column(Integer, default=0)
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    author = relationship("User", back_populates="skills")
