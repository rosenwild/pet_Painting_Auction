from sqlalchemy import Column, String, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import uuid


class Painting(Base):
    __tablename__ = "paintings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    photo = Column(String)
    author = Column(String)
    price = Column(Float)
    type = Column(String)
    is_bid_active = Column(Boolean, default=True)

    # Определяем обратное отношение
    bids = relationship("Bid", back_populates="painting")
