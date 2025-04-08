# app/routes/ai_insight.py

from fastapi import APIRouter, Form
import pandas as pd
import os
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "predictions.csv"
df = pd.read_csv(DATA_PATH)
print(df)

@router.post("/api/ai-insight")
async def ai_insight(query: str = Form(...)):

    prompt = f"""
    You are a world-class energy data analyst working with global energy consumption data.

    Below is total energy consumption data (in TWh) from 1999 to 2024, grouped by country and year:

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
