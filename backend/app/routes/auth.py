import os
from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from app.db.database import users_collection
from app.models.schemas import UserCreate, UserLogin, UserResponse, UserUpdate
from app.utils.utils import hash_password, verify_password, create_access_token

router = APIRouter()


@router.get("/test-mongo")
def test_mongo():
    try:
        client = MongoClient(os.getenv("MONGO_URI"), serverSelectionTimeoutMS=5000, tls=True)
        dbs = client.list_database_names()
        return {"status": "connected", "databases": dbs}
    except Exception as e:
        return {"status": "error", "details": str(e)}

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    print("Checking if user exists...")
    
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = {
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "hashed_password": hash_password(user.password),
    }

    result = await users_collection.insert_one(new_user)
    print(" Inserted ID:", result.inserted_id)

    return {
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
    }

@router.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    print("db_user", db_user)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": db_user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "email": db_user["email"],
        "firstName": db_user.get("firstName", "User"),
        "lastName": db_user.get("lastName", ""),
    }

#edit user

@router.put("/edit-user")
async def edit_user(user: UserUpdate):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.currentPassword, db_user["hashed_password"]):
        raise HTTPException(status_code=403, detail="Current password is incorrect")

    updates = {}
    if user.firstName: updates["firstName"] = user.firstName
    if user.lastName: updates["lastName"] = user.lastName
    if user.newPassword:
        updates["hashed_password"] = hash_password(user.newPassword)

    await users_collection.update_one({"email": user.email}, {"$set": updates})

    return {"message": "User updated successfully"}
