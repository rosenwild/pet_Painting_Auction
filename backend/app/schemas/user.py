from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from enum import Enum

class TokenData(BaseModel):
    username: Optional[str] = None
class Role(str, Enum):
    user = "user"
    admin = "admin"

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    name: str
    last_name: str
    role: Role = Role.user  # Устанавливаем значение по умолчанию
    password: str

class UserLogin(UserBase):
    password: str

class UserOut(UserBase):
    id: str
    name: str
    last_name: str
    role: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenWithUser(Token):
    user: 'UserInResponse'

class UserInResponse(BaseModel):
    name: str
    last_name: str
    email: str
    role: str

TokenWithUser.update_forward_refs()
