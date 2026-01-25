from datetime import datetime, timedelta
from jose import jwt
from dotenv import load_dotenv
import os
import bcrypt
from fastapi import Request, Depends, HTTPException

load_dotenv()
algorithm = os.getenv("ALGORITHM")
secret = os.getenv("SECRET_KEY")
time = int(os.getenv("TIME"))


def hashPassword(password : str):
    if not isinstance(password, str):
        password = str(password)

    password_bytes = password.encode('utf-8')

    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]

    salt = bcrypt.gensalt()
    hashed_pass = bcrypt.hashpw(password_bytes, salt)

    return hashed_pass.decode('utf-8')


def verifyPassword(password : str, hashed_pass : str):
    if not isinstance(password, str):
        password = str(password)
    
    password_bytes = password.encode('utf-8')

    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]

    hashed_bytes = hashed_pass.encode('utf-8')

    return bcrypt.checkpw(password_bytes,hashed_bytes)


    
def create_access_token(data : dict):
    if not secret:
        raise ValueError("SECRET_KEY is not set (set env var SECRET_KEY)")
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=time)
    to_encode.update({"exp" : expire})

    return  jwt.encode(to_encode,secret,algorithm=algorithm)




def get_current_user(request : Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=404, detail="token is not present")
    
    payload = jwt.decode(token , secret, algorithms=algorithm)
    user_id = payload.get("_id")

    if not user_id:
        raise HTTPException(status_code=404, detaail="user id not found")
    
    return user_id