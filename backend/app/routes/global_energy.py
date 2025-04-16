# app/routes/global_energy.py
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import pandas as pd
from pathlib import Path
from app.db.database import energy_collection
from app.models.energy_model import EnergyCreate
from datetime import datetime


router = APIRouter()

# Load dataset once
DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "energy_consumption_generation.csv"
df = pd.read_csv(DATA_PATH)


@router.get("/energy/seed")
async def seed_energy_data():
    csv_path = Path(__file__).resolve().parents[2] / "data" / "energy_consumption_generation.csv"
    if not csv_path.exists():
        raise HTTPException(status_code=404, detail="CSV file not found")

    df = pd.read_csv(csv_path)
    df["date"] = pd.to_datetime(df["date"], dayfirst=True)

    records = []
    for _, row in df.iterrows():
        records.append({
            "country": row["Country"],
            "type": "generation",
            "source": "mixed",
            "value_kwh": row["Total Energy Generation (TWh)"] * 1e9,
            "date": row["date"]
        })
        records.append({
            "country": row["Country"],
            "type": "consumption",
            "source": "mixed",
            "value_kwh": row["Total Energy Consumption (TWh)"] * 1e9,
            "date": row["date"]
        })

    await energy_collection.delete_many({})
    await energy_collection.insert_many(records)

    return {"message": f"{len(records)} records inserted successfully."}



@router.get("/energy")
async def get_energy(
    country: Optional[str] = None,
    type: Optional[str] = None,
    source: Optional[str] = None,
    date: Optional[str] = None,
    page: int = 1,
    limit: int = 50
):
    skip = (page - 1) * limit
    query = {}

    if country:
        query["country"] = {"$regex": country, "$options": "i"}
    if type:
        query["type"] = {"$regex": type, "$options": "i"}
    if source:
        query["source"] = {"$regex": source, "$options": "i"}
    if date:
        try:
            date_obj = datetime.strptime(date, "%Y-%m-%d")
            query["date"] = {"$gte": date_obj, "$lt": date_obj.replace(hour=23, minute=59, second=59)}
        except ValueError:
            pass  

    total = await energy_collection.count_documents(query)
    cursor = energy_collection.find(query).skip(skip).limit(limit)
    records = await cursor.to_list(length=limit)

    for r in records:
        r["_id"] = str(r["_id"])
        if "date" in r and isinstance(r["date"], datetime):
            r["date"] = r["date"].isoformat()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "records": records
    }


@router.post("/energy")
async def add_energy(record: EnergyCreate):
    record_dict = record.dict()
    
    if isinstance(record_dict["date"], datetime) is False:
        record_dict["date"] = datetime.combine(record_dict["date"], datetime.min.time())

    result = await energy_collection.insert_one(record_dict)
    return {"id": str(result.inserted_id), "message": "Record added"}

@router.put("/energy/{id}")
async def update_energy(id: str, record: EnergyCreate):
    record_dict = record.dict()
    if isinstance(record_dict["date"], datetime) is False:
        record_dict["date"] = datetime.combine(record_dict["date"], datetime.min.time())

    result = await energy_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": record_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": "Record updated"}


@router.delete("/energy/{id}")
async def delete_energy(id: str):
    result = await energy_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": "Record deleted"}


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



    result = energy_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": "Record deleted"}