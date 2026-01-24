from config.mongodb import user_collection
from pydantic import BaseModel, EmailStr

class user(BaseModel):
    username : str
    email : EmailStr
    password : str

class login(BaseModel):
    email : EmailStr
    password : str




    