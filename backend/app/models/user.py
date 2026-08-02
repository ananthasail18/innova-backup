import uuid
from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.orm import relationship
from app.database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, default="Guest")
    email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    taste_profile = relationship("TasteProfile", back_populates="user", uselist=False, cascade="all, delete")
