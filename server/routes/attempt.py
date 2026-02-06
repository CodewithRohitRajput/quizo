from fastapi import FastAPI, Depends, APIRouter, HTTPException
from models.attempt import quizAttempt
from config.mongodb import attempt_quiz
from bson import ObjectId
from config.security import get_current_user

router = APIRouter(prefix="/attempt", tags=["Attempt"])

@router.post("/")
async def attemptQuiz(data : quizAttempt, user_id = Depends(get_current_user)):

    result = await attempt_quiz.insert_one(data.dict())
    if result.inserted_id:
        return {"message" : "Attempt saved"}
    else :
        raise HTTPException(status_code=404, detail="Error in saving attempt")
