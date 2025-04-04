from fastapi import FastAPI
from app.routes import auth
from app.db.database import users_collection
import os
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"msg": "FastAPI is working!"}
