from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@db:5432/postgres"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        print("Таблицы успешно созданы")
    except Exception as e:
        print(f"Ошибка при создании таблиц: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

