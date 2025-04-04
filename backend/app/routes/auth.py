from fastapi import APIRouter, HTTPException
from app.db.database import users_collection
from app.schemas import UserCreate, UserLogin, UserResponse
from app.utils import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    print("🔁 Checking if user exists...")
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = {
        "email": user.email,
        "hashed_password": hash_password(user.password)
    }

    result = await users_collection.insert_one(new_user)
    print("✅ Inserted ID:", result.inserted_id)

    return UserResponse(email=user.email)


@router.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": db_user["email"]})
    return {"access_token": token, "token_type": "bearer"}

