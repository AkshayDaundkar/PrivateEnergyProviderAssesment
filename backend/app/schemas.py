from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    email: EmailStr

from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class EnergyRecord(BaseModel):
    timestamp: datetime
    type: Literal["generation", "consumption"]
    source: str
    value_kwh: float
    location: str
    price_per_kwh: float
