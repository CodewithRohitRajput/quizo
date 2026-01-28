from fastapi import FastAPI, Depends,  APIRouter
from config.mongodb import user_collection
from models.user import user
from bson import ObjectId
from config.security import get_current_user
from fastapi import HTTPException


router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/")
async def getProfile(user_id = Depends(get_current_user)):
      user_profile = await user_collection.find_one({"_id" : ObjectId(user_id)})
      if not user_profile:
         raise HTTPException(status_code=404, detail="User not found")
      user_profile["_id"] = str(user_profile["_id"])
      user_profile.pop("password", None)
      return user_profile