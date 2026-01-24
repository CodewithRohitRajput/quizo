from config.security import hashPassword,verifyPassword,create_access_token
from models.user import user , login
from config.mongodb import user_collection
from fastapi import HTTPException, status, APIRouter

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
async def signup(user : user):
    is_user = await user_collection.find_one({"email" : user.email})
    if (is_user):
        raise HTTPException(status_code=500, detail="user found with this email")
    
    hashed_pass =  hashPassword(user.password)

    await user_collection.insert_one(
        {"username": user.username, "email": user.email, "password": hashed_pass}
    )

    return {"message" : f"{user.username} your profile is created"}


# @router.post("/login")
# async def login(user : login)