from fastapi import FastAPI, APIRouter, Depends
from models.quiz import quiz
from config.security import get_current_user
from models.quiz import quiz
from config.mongodb import quiz_collection


router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.post("/")
async def create_quiz(data : quiz, user_id : str = Depends(get_current_user)):
    quiz_data = data.dict()
    quiz_data["created_by"] = user_id
    result = await quiz_collection.insert_one(quiz_data)
    return {"message" : "Quiz created" , "quiz_id" : str(result.inserted_id)}
