# app/routes/ai_insight.py

from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
import pandas as pd
import os
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parents[2] / "data"
PREDICTIONS_FILE = BASE_DIR / "predictionscreated.csv"
SOURCE_FILE = BASE_DIR / "energy_consumption_generation.csv"


@router.get("/generate-predictions")
async def generate_predictions():
    if PREDICTIONS_FILE.exists():
        return JSONResponse(status_code=200, content={"message": "Predictions file already exists."})

    if not SOURCE_FILE.exists():
        return JSONResponse(status_code=404, content={"error": "Source energy_consumption_generation.csv file not found."})

    try:
        df = pd.read_csv(SOURCE_FILE)
        required_cols = {"Country", "Year", "Total Energy Consumption (TWh)"}
        if not required_cols.issubset(df.columns):
            return JSONResponse(status_code=400, content={"error": f"Required columns {required_cols} not found."})

        # Group by Country and Year, aggregate by average 
        grouped = df.groupby(['Country', 'Year'], as_index=False)[["Total Energy Consumption (TWh)"]].mean()

        BASE_DIR.mkdir(parents=True, exist_ok=True)
        grouped.to_csv(PREDICTIONS_FILE, index=False)

        return JSONResponse(status_code=201, content={"message": "Predictions file generated successfully."})
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Error generating predictions: {str(e)}"})


@router.post("/ai-insight")
async def ai_insight(query: str = Form(...)):
    if not PREDICTIONS_FILE.exists():
        return {"error": "Predictions file not found. Please call /api/generate-predictions first."}

    try:
        df = pd.read_csv(PREDICTIONS_FILE)
    except Exception as e:
        return {"error": f"Failed to read predictions file: {str(e)}"}

    prompt = f"""
    You are a world-class energy data analyst working with global energy consumption data.

    Below is predicted average energy generation (in TWh), grouped by country:

    {df.to_string(index=False)}

    Use this data to analyze energy trends and patterns. Your goal is to:

    1. Understand the growth trends per country using recent years.
    2. If the user asks about energy consumption in a future year (e.g. 2025 or 5 years from now), apply reasonable forecasting logic such as:
    - Linear extrapolation
    - CAGR (Compound Annual Growth Rate)
    - Moving averages
    3. Support your answer with observed values from the dataset and describe the method you used to project.

    Now, answer this user question:

    Question: {query}
    """



    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert energy data analyst."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )
        answer = response.choices[0].message.content
    except Exception as e:
        answer = f"An error occurred while contacting OpenAI: {str(e)}"

    return {"answer": answer}
