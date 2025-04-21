from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.schemas.user import TokenData
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.user import User

SECRET_KEY = "your-secret-key"  # Замените на настоящий секретный ключ
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

        # Получаем полные данные пользователя из БД
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise credentials_exception

        return user
    except JWTError:
        raise credentials_exception
