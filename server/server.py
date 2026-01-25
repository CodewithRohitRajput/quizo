from fastapi import FastAPI
from routes.auth import router as auth_route
from routes.quiz import router as quiz_route
app = FastAPI()

app.include_router(auth_route)
app.include_router(quiz_route)
