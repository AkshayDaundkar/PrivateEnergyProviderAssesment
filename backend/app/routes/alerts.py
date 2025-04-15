from fastapi import APIRouter, Form, UploadFile, File
from app.models.alert_model import AlertModel
from app.utils.email_utils import send_email_with_screenshot
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["pep"]
alerts_collection = db["alerts"]

@router.post("/alerts")
async def save_alert(
    email: str = Form(...),
    userId: str = Form(...),
    country: str = Form(...),
    startDate: str = Form(...),
    endDate: str = Form(...),
    screenshot: UploadFile = File(...)
):
    screenshot_bytes = await screenshot.read()

    # Save alert
    alerts_collection.insert_one({
        "email": email,
        "userId": userId,
        "country": country,
        "startDate": startDate,
        "endDate": endDate,
    })

    subject = f"Energy Alert Set for {country}"
    message = f"""
        Hi!

        You've set an energy alert for {country} from {startDate} to {endDate}.
        You'll stay updated with energy trends and changes.

        Thank you,
        PEP Team
    """
    await send_email_with_screenshot(email, subject, message, screenshot_bytes)

    return {"message": "Alert saved and email sent."}
