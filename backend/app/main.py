from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import Base, engine
from app.models.user import User
from app.models.painting import Painting
from app.models.bid import Bid
from app.database import init_db, SessionLocal
from app.routes import paintings, bids, auth

# Создание таблиц
init_db()

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth.router)
app.include_router(bids.router)
app.include_router(paintings.router)