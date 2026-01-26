from fastapi import APIRouter, FastAPI, Depends
from config.mongodb import question_collection
from models.question import question
from bson import ObjectId


router = APIRouter(prefix="/question", tags=["Question"] )

@router.post("/")
async def createQuestion(data : question):
    question = data.dict()
    new_question = await question_collection.insert_one(question)

    return {"message" : f"{new_question.inserted_id} created"}
    