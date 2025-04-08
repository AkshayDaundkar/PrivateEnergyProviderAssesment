import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.routes.global_energy import router as global_energy_router

app = FastAPI()
app.include_router(global_energy_router)

client = TestClient(app)

def test_get_all_energy_data():
    response = client.get("/energy/global")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_filtered_by_country():
    response = client.get("/energy/global", params={"country": "India"})
    assert response.status_code == 200
    for item in response.json():
        assert item["Country"].lower() == "india"
