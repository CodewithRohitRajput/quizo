from config.mongodb import user_collection
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
class user(BaseModel):
    username : str
    email : EmailStr
    password : str
    created_at : datetime = Field(default_factory=datetime.utcnow)

class login(BaseModel):
    email : EmailStr
    password : str




    