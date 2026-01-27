from config.security import hashPassword,verifyPassword,create_access_token
from models.user import user , login
from config.mongodb import user_collection
from fastapi import HTTPException, status, APIRouter
from fastapi.responses import JSONResponse
from jose import jwt

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
async def signup(user : user):
    is_user = await user_collection.find_one({"email" : user.email})
    if (is_user):
        raise HTTPException(status_code=500, detail="user found with this email")
    
    hashed_pass =  hashPassword(user.password)

    new_user =  await user_collection.insert_one(
        {"username": user.username, "email": user.email, "password": hashed_pass}
    )

    token = create_access_token({"_id" : str(new_user.inserted_id)})
    response = JSONResponse(
        content={"message" : "Your profile is created", "token" : token}
    )
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax"
    )

    return response


@router.post("/login")
async def login(user : login):
    is_user = await user_collection.find_one({"email" : user.email})
    if not is_user:
        raise HTTPException(status_code=404, detail="user not found")
    is_pass = verifyPassword(user.password, is_user["password"])

    if not is_pass:
        raise HTTPException(status_code=500, detail="password is wrong")

    token = create_access_token({"_id" : str(is_user["_id"]), "email" : user.email})

    response = JSONResponse(
        content={"message" : "Logged in Successfully" , "token" :  token}
    )
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax"
    )

    return response