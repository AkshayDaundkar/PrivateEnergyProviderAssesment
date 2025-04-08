import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import patch
from app.routes.ai_insights import router as ai_router

app = FastAPI()
app.include_router(ai_router)

client = TestClient(app)

def test_ai_insight_success():
    mock_response = "India has shown consistent growth in energy consumption over the last few years."

    with patch("app.routes.ai_insights.client.chat.completions.create") as mock_create:
        mock_create.return_value.choices = [
            type("obj", (object,), {"message": type("msg", (object,), {"content": mock_response})})()
        ]

        response = client.post("/api/ai-insight", data={"query": "What about India in 2025?"})
        assert response.status_code == 200
        assert "India" in response.json()["answer"]
