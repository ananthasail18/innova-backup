from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.user import UserCreate, UserOut
from app.repositories.user import UserRepository

router = APIRouter()

@router.post("/users", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    db_user = repo.create(user)
    return {"status": "success", "data": UserOut.model_validate(db_user).model_dump()}

@router.get("/users/{user_id}", response_model=dict)
def get_user(user_id: str, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "data": UserOut.model_validate(user).model_dump()}
