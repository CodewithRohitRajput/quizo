from fastapi import FastAPI
from routes.auth import router as auth_route
from routes.quiz import router as quiz_route
from routes. question import router as question_route
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_route)
app.include_router(quiz_route)
app.include_router(question_route)
