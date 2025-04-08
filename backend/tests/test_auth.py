import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from fastapi import FastAPI
from app.routes.auth import router as auth_router

app = FastAPI()
app.include_router(auth_router)

client = TestClient(app)

def test_mongo_connection():
    response = client.get("/test-mongo")
    assert response.status_code == 200
    assert "status" in response.json()
