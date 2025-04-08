# app/routes/global_energy.py
from fastapi import APIRouter, Query
from typing import List, Optional
import pandas as pd
from pathlib import Path

router = APIRouter()

# Load dataset once
DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "energy_consumption_generation.csv"
df = pd.read_csv(DATA_PATH)

@router.get("/energy/global")
def get_global_energy_data(
    country: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    max_energy: Optional[float] = Query(None)
):
    filtered = df.copy()
    if country:
        filtered = filtered[filtered['Country'].str.lower() == country.lower()]
    if year:
        filtered = filtered[filtered['Year'] == year]
    if max_energy:
        filtered = filtered[filtered['Total Energy Consumption (TWh)'] <= max_energy]
    return filtered.to_dict(orient="records")

@router.get("/energy/global/filters")
def get_filter_options():
    countries = sorted(df['Country'].dropna().unique().tolist())
    years = sorted(df['Year'].dropna().unique().astype(int).tolist())
    return {"countries": countries, "years": years}
