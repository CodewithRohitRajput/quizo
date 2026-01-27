from fastapi import FastAPI, APIRouter, Depends
from models.quiz import quiz
from config.security import get_current_user
from models.quiz import quiz
from config.mongodb import user_collection
from config.mongodb import quiz_collection
from bson import ObjectId


router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.post("/create")
async def create_quiz(data : quiz, user_id : str = Depends(get_current_user)):

    quiz_data = data.dict()
    quiz_data["created_by"] = user_id
    result = await quiz_collection.insert_one(quiz_data)
    return {"message" : "Quiz created" , "quiz_id" : str(result.inserted_id)}
 

@router.patch("/update/{quiz_id}")
async def update_quiz(quiz_id : str, data : quiz):
    updated_quiz = data.dict()
    updated_quiz.pop("created_by", None)
    result = await quiz_collection.update_one({"_id" : ObjectId(quiz_id)}, {"$set" : updated_quiz})

    return {"message" : "quiz is updated"}
    

@router.get("/")
async def getallquizzes(user_id: str = Depends(get_current_user)):
    # user = await user_collection.find_one({"_id": ObjectId(user_id)})
        quiz =  quiz_collection.find()
        quizzes = []
        async for q in quiz:
             q["_id"] = str(q["_id"])
             quizzes.append(q)

        return quizzes

@router.get("/{quiz_id}")
async def getquizbyid(quiz_id : str, user_id : str = Depends(get_current_user)):
     quiz = await quiz_collection.find_one({"_id" : ObjectId(quiz_id)})
     quiz["_id"] = str(quiz["_id"])
     return quiz

