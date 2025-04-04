from fastapi import APIRouter, Depends, Query
from app.schemas import EnergyRecord
from typing import List, Optional
from datetime import datetime
import json
from pathlib import Path

router = APIRouter()

# Load mock data once
DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "mock_energy_data.json"
with open(DATA_PATH, "r") as f:
    MOCK_DATA = json.load(f)

@router.get("/energy/mock", response_model=List[EnergyRecord])
def get_mock_data():
    return MOCK_DATA

@router.get("/energy/filter", response_model=List[EnergyRecord])
def filter_energy_data(
    type: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
):
    filtered = MOCK_DATA

    if type:
        filtered = [item for item in filtered if item["type"] == type]

    if source:
        filtered = [item for item in filtered if item["source"] == source]

    if start:
        filtered = [item for item in filtered if datetime.fromisoformat(item["timestamp"].replace("Z", "")) >= start]

    if end:
        filtered = [item for item in filtered if datetime.fromisoformat(item["timestamp"].replace("Z", "")) <= end]

    return filtered
