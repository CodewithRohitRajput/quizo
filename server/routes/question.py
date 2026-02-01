from fastapi import APIRouter, FastAPI, Depends
from config.mongodb import question_collection
from models.question import question as Q
from bson import ObjectId
from typing import List


router = APIRouter(prefix="/question", tags=["Question"] )


@router.post("/")
async def createQuestion(data: List[Q]):
    questions = [q.dict() for q in data]
    new_question = await question_collection.insert_many(questions)
    return {"message": f"{len(new_question.inserted_ids)} questions created", "ids": [str(_id) for _id in new_question.inserted_ids]}



    

@router.get("/{question_id}")
async def getquestionbyid(question_id : str):
    question = await question_collection.find_one({"_id" : ObjectId(question_id)})
    question["_id"] = str(question["_id"])
    question.pop("correct_option", None)
    return question

