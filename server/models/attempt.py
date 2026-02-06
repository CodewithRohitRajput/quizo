from pydantic import BaseModel

class quizAttempt(BaseModel):
    user_id : str
    quiz_id : str
    score : str