from pydantic import BaseModel, EmailStr
from datetime import date

class AlertModel(BaseModel):
    email: EmailStr
    userId: str
    country: str
    startDate: date
    endDate: date
