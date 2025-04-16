from pydantic import BaseModel, EmailStr
from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime

class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr

class UserUpdate(BaseModel):
    firstName: Optional[str]
    lastName: Optional[str]
    email: Optional[EmailStr]
    currentPassword: str
    newPassword: Optional[str] = None


class EnergyRecord(BaseModel):
    timestamp: datetime
    type: Literal["generation", "consumption"]
    source: str
    value_kwh: float
    location: str
    price_per_kwh: float
