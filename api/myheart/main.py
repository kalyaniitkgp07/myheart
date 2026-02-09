from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import heart_rate, users
from .internal import admin
from .database import create_db_and_tables

app = FastAPI(title="Wearable Heart Rate API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(heart_rate.router)
app.include_router(users.router)
app.include_router(
    admin.router,
    prefix="/internal/admin",
    tags=["internal"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "HeartSync Professional API is running"}
