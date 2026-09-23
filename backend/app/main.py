from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.uploads import router as upload_router
from backend.app.api.analytics import router as analytics_router
from backend.app.api.datasets import router as datasets_router
from backend.app.api.chat import router as chat_router
from backend.app.api.forecast import router as forecast_router
from backend.app.api.recommendations import router as recommendations_router
from backend.app.api.alerts import router as alerts_router
from backend.app.api.auth import router as auth_router

from backend.app.database.connection import engine
from backend.app.models.base import Base

# Import models so SQLAlchemy knows about their tables
from backend.app.models.dataset import Dataset
from backend.app.models.user import User


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="OpsPilot",
    description="AI-Powered Business Operations Intelligence Platform",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# API routers
app.include_router(upload_router)
app.include_router(analytics_router)
app.include_router(datasets_router)
app.include_router(chat_router)
app.include_router(forecast_router)
app.include_router(recommendations_router)
app.include_router(alerts_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "OpsPilot is running!",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }