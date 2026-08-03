from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.user import UserCreate, UserOut, UserLoginRequest
from app.repositories.user import UserRepository
from typing import List

router = APIRouter()

@router.post("/users/login", response_model=dict)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    user = repo.get_by_email_or_name(req.email_or_name)
    if not user:
        # Auto-create if identifier contains @ (email) or is a name
        is_email = "@" in req.email_or_name
        name = req.email_or_name.split("@")[0].title() if is_email else req.email_or_name
        email = req.email_or_name if is_email else f"{req.email_or_name.lower().replace(' ', '')}@taste.ai"
        user = repo.create(UserCreate(name=name, email=email))
        
    return {"status": "success", "data": UserOut.model_validate(user).model_dump()}

@router.post("/users", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    db_user = repo.create(user)
    return {"status": "success", "data": UserOut.model_validate(db_user).model_dump()}

@router.get("/users", response_model=dict)
def list_users(db: Session = Depends(get_db)):
    repo = UserRepository(db)
    users = repo.get_all()
    return {"status": "success", "data": [UserOut.model_validate(u).model_dump() for u in users]}

@router.get("/users/{user_id}", response_model=dict)
def get_user(user_id: str, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "data": UserOut.model_validate(user).model_dump()}
