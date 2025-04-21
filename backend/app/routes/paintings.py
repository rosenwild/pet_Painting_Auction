from app.database import SessionLocal
from app.models.painting import Painting

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.models.painting import Painting as PaintingModel
from app.schemas.painting import PaintingCreate, Painting as PaintingSchema
from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User


import uuid

router = APIRouter(prefix="/paintings", tags=["paintings"])


@router.post("/", response_model=PaintingSchema, status_code=status.HTTP_201_CREATED)
def create_painting(
        painting: PaintingCreate,
        db: Session = Depends(get_db),
):
    db_painting = PaintingModel(
        id=uuid.uuid4(),
        name=painting.name,
        photo=painting.photo,
        author=painting.author,
        price=painting.price,
        type=painting.type
    )

    db.add(db_painting)
    db.commit()
    db.refresh(db_painting)
    return db_painting


@router.get("/", response_model=List[PaintingSchema])
def read_paintings(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)
):
    paintings = db.query(PaintingModel).offset(skip).limit(limit).all()
    return paintings


@router.delete("/{painting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_painting(
        painting_id: UUID,
        db: Session = Depends(get_db),
):

    db_painting = db.query(PaintingModel).filter(PaintingModel.id == painting_id).first()
    if not db_painting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Painting not found"
        )

    db.delete(db_painting)
    db.commit()
    return None


@router.on_event("startup")
async def startup_event():
    db = SessionLocal()
    try:
        if not db.query(Painting).first():
            initial_paintings = [
                Painting(
                    id=uuid.uuid4(),
                    name="Starry Night",
                    photo="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/970px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
                    author="Vincent van Gogh",
                    price=1000000,
                    type="Oil on canvas",
                    is_bid_active=True
                ),
                Painting(
                    id=uuid.uuid4(),
                    name="Mona Lisa",
                    photo="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1200px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
                    author="Leonardo da Vinci",
                    price=5000000,
                    type="Oil on poplar",
                    is_bid_active=False
                )
            ]
            db.add_all(initial_paintings)
            db.commit()
    finally:
        db.close()

def get_current_admin(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

@router.patch("/{painting_id}/toggle-bid", response_model=PaintingSchema)
async def toggle_bid_status(
        painting_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_admin)
):
    painting = db.query(Painting).filter(Painting.id == painting_id).first()
    if not painting:
        raise HTTPException(status_code=404, detail="Painting not found")

    painting.is_bid_active = not painting.is_bid_active
    db.commit()
    db.refresh(painting)
    return painting


@router.delete("/{painting_id}", status_code=204)
async def delete_painting(
        painting_id: UUID,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_admin)
):
    painting = db.query(Painting).filter(Painting.id == painting_id).first()
    if not painting:
        raise HTTPException(status_code=404, detail="Painting not found")

    db.delete(painting)
    db.commit()
    return Response(status_code=204)
