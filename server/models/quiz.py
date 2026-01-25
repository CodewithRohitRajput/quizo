from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class quiz(BaseModel):
    title : str
    description : Optional[str] = None
    created_by : str
    question_ids : List[str] = []
    is_active : bool = False
    created_at : datetime = datetime.utcnow()


