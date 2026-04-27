from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    # 기본 정보
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False) # 로그인 ID(이메일)
    password_hash = Column(String(255), nullable=False) # bcrypt 해시 비밀번호
    name = Column(String(100), nullable=False) # 이름
    department = Column(String(100), nullable=True) # 부서
    
    # 권한/상태
    role = Column(String(20), default="USER", nullable=False) # USER/ADMIN 등
    is_active = Column(Boolean, default=True, nullable=False) # 계정 활성화 여부
    is_superuser = Column(Boolean, default=False, nullable=False) # 슈퍼유저 여부

    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    skills = relationship("Skill", back_populates="author", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"
