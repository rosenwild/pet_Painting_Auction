from sqlalchemy import Column, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid


class Bid(Base):
    __tablename__ = "bids"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    painting_id = Column(UUID(as_uuid=True), ForeignKey("paintings.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    # Определяем отношения
    painting = relationship("Painting", back_populates="bids")
    user = relationship("User", back_populates="bids")
