from datetime import datetime, timedelta
from jose import jwt
from dotenv import load_dotenv
import os
import bcrypt

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

    hashed_bytes = hashed_pass if isinstance(hashed_pass, (bytes, bytearray)) else hashed_pass.encode('utf-8')

    return bcrypt.verifypw(password_bytes,hashed_bytes)


    
def create_access_token(data : dict):
    if not secret:
        raise ValueError("SECRET_KEY is not set (set env var SECRET_KEY)")
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=time)
    to_encode.update({"exp" : expire})

    return  jwt.encode(to_encode,secret,algorithm=algorithm)