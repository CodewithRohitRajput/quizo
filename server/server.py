from fastapi import FastAPI
from routes.auth import router as auth_route
app = FastAPI()

app.include_router(auth_route)

