from fastapi import FastAPI
from app.routes import auth,global_energy,ai_insights,alerts
from app.db.database import users_collection
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()


app = FastAPI()
app.include_router(auth.router)
app.include_router(global_energy.router)
app.include_router(ai_insights.router)
app.include_router(alerts.router)




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"msg": "FastAPI is working!"}
