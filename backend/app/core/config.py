from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY = "your-secret-key"  # Замените на настоящий секретный ключ
    ALGORITHM = "HS256"
    DATABASE_URL: str = "postgresql://postgres:password@db:5432/postgres"

    class Config:
        env_file = ".env"

# Инициализация базы данных
Base = declarative_base()
engine = create_engine(Settings().DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

settings = Settings()
