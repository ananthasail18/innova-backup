from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user: UserCreate) -> User:
        db_user = User(**user.model_dump())
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_by_id(self, user_id: str) -> User:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email_or_name(self, identifier: str) -> User:
        clean = identifier.strip().lower()
        return self.db.query(User).filter(
            (User.email.ilike(clean)) | (User.name.ilike(clean)) | (User.id == identifier)
        ).first()

    def get_all(self, limit: int = 20):
        return self.db.query(User).order_by(User.created_at.desc()).limit(limit).all()
