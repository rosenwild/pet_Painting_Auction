from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, create_access_token, verify_password
from app.schemas.user import Token, TokenWithUser, UserCreate, UserLogin
from app.models.user import User as UserModel
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    db_user = UserModel(
        email=user.email,
        name=user.name,
        last_name=user.last_name,
        role=user.role.value,  # Используем .value для Enum
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=TokenWithUser)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user.email, "role": db_user.role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": db_user.name,
            "last_name": db_user.last_name,
            "email": db_user.email,
            "role": db_user.role
        }
    }
