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
        bid_data: BidCreate,  # Теперь ожидаем JSON с полем amount
        current_user: UserModel = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    amount = bid_data.amount  # Получаем amount из модели

    # Остальной код остается без изменений
    if amount < 1000:
        raise HTTPException(
            status_code=400,
            detail="Извините, минимальная сумма шага - 1000 рублей"
        )

    # 2. Получаем картину
    painting = db.query(PaintingModel).filter(PaintingModel.id == painting_id).first()
    if not painting:
        raise HTTPException(status_code=404, detail="Картина не найдена")

    # 3. Проверяем текущую максимальную ставку
    current_max_bid = db.query(BidModel).filter(
        BidModel.painting_id == painting_id
    ).order_by(BidModel.amount.desc()).first()

    if current_max_bid and amount <= current_max_bid.amount:
        raise HTTPException(
            status_code=400,
            detail=f"Ваша ставка должна быть выше текущей максимальной ({current_max_bid.amount} руб.)"
        )

    # 4. Создаем новую ставку
    new_bid = BidModel(
        amount=amount,
        painting_id=painting_id,
        user_id=current_user.id,
        created_at=datetime.utcnow()
    )
    db.add(new_bid)

    # 5. Обновляем цену картины
    painting.price = amount
    db.commit()
    db.refresh(new_bid)
    db.refresh(painting)

    # 6. Возвращаем информацию о ставке
    return {
        "success": True,
        "message": "Ставка принята",
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
        return {"message": "Нет ставок для этой картины"}

    user = db.query(UserModel).filter(UserModel.id == bid.user_id).first()

    return {
        "amount": bid.amount,
        "user_name": f"{user.last_name} {user.name}",
        "created_at": bid.created_at
    }
