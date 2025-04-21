from pydantic import BaseModel
from uuid import UUID

class PaintingBase(BaseModel):
    name: str
    photo: str
    author: str
    price: int
    type: str

class PaintingCreate(PaintingBase):
    pass

class Painting(PaintingBase):
    id: UUID
    is_bid_active: bool
    class Config:
        orm_mode = True
