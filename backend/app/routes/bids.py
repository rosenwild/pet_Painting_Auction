from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from uuid import UUID
from typing import Optional

from app.database import get_db
from app.models.painting import Painting as PaintingModel
from app.models.bid import Bid as BidModel
from app.models.user import User as UserModel
from app.auth.utils import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/bids", tags=["bids"])

class BidCreate(BaseModel):
    amount: float

@router.post("/{painting_id}")
async def place_bid(
        painting_id: UUID,
        bid_data: BidCreate,
        current_user: UserModel = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    amount = bid_data.amount

    if amount < 1000:
        raise HTTPException(
            status_code=400,
            detail="Sorry, minimum bid step amount is 1000."
        )

    # 2. Получаем картину
    painting = db.query(PaintingModel).filter(PaintingModel.id == painting_id).first()
    if not painting:
        raise HTTPException(status_code=404, detail="Painting not found")

    current_max_bid = db.query(BidModel).filter(
        BidModel.painting_id == painting_id
    ).order_by(BidModel.amount.desc()).first()

    if current_max_bid and amount <= current_max_bid.amount:
        raise HTTPException(
            status_code=400,
            detail=f"Your bid must be higher than {current_max_bid.amount}."
        )

    new_bid = BidModel(
        amount=amount,
        painting_id=painting_id,
        user_id=current_user.id,
        created_at=datetime.utcnow()
    )
    db.add(new_bid)

    painting.price = amount
    db.commit()
    db.refresh(new_bid)
    db.refresh(painting)

    return {
        "success": True,
        "message": "bid accepted",
        "current_bid": {
            "amount": amount,
            "user_name": f"{current_user.last_name} {current_user.name}",
            "painting_title": painting.name
        }
    }


@router.get("/{painting_id}/current")
async def get_current_bid(
        painting_id: UUID,
        db: Session = Depends(get_db)
):
    bid = db.query(BidModel).filter(
        BidModel.painting_id == painting_id
    ).order_by(BidModel.amount.desc()).first()

    if not bid:
        return {"message": "no bids yet"}

    user = db.query(UserModel).filter(UserModel.id == bid.user_id).first()

    return {
        "amount": bid.amount,
        "user_name": f"{user.last_name} {user.name}",
        "created_at": bid.created_at
    }

@router.get("/{painting_id}/history")
async def get_bid_history(
    painting_id: UUID,
    db: Session = Depends(get_db)
):
    bids = db.query(BidModel).filter(
        BidModel.painting_id == painting_id
    ).order_by(BidModel.created_at.desc()).all()

    if not bids:
        return []

    history = []
    for bid in bids:
        user = db.query(UserModel).filter(UserModel.id == bid.user_id).first()
        history.append({
            "user_name": f"{user.last_name} {user.name}",
            "amount": bid.amount,
            "created_at": bid.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return history
