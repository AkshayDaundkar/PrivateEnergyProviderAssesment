from pydantic import BaseModel
from typing import Literal
from datetime import date

class EnergyCreate(BaseModel):
    country: str
    type: Literal["generation", "consumption"]
    source: str
    value_kwh: float
    date: date
