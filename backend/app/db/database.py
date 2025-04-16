from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()  

MONGO_URI = os.getenv("MONGO_URI")
print(MONGO_URI)  
if not MONGO_URI:
    raise ValueError("MONGO_URI not found in environment variables")

client = AsyncIOMotorClient(MONGO_URI)
db = client["energy_app"]
users_collection = db["users"]
alerts_collection = db["alerts"]
energy_collection = db["energy"]

