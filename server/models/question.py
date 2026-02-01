
from pydantic import BaseModel
from typing import List

class question(BaseModel):
    quiz_id : str
    question_test : str
    options : List[str]
    correct_option : str

