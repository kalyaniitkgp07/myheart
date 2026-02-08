from fastapi import FastAPI, Depends, HTTPException, Security, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader
from sqlmodel import Session, select
from .database import engine, HeartRateRecord, create_db_and_tables, get_session, settings
from pydantic import BaseModel
from datetime import datetime
from typing import List
from .process import classify_heart_rate

app = FastAPI(title="Wearable Heart Rate API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == settings.SECRET_API_KEY:
        return api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )

class HeartRateIn(BaseModel):
    heart_rate: int

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "Heart Rate Monitoring API is running"}

@app.get("/heart-rate", response_model=List[HeartRateRecord])
async def get_heart_rates(
    session: Session = Depends(get_session)
):
    """
    Retrieve the last 20 heart rate readings.
    """
    statement = select(HeartRateRecord).order_by(HeartRateRecord.timestamp.desc()).limit(20)
    results = session.exec(statement).all()
    return results


@app.post("/heart-rate", status_code=status.HTTP_201_CREATED)
async def ingest_heart_rate(
    data: HeartRateIn,
    session: Session = Depends(get_session),
    api_key: str = Depends(get_api_key)
):
    status_label = classify_heart_rate(data.heart_rate)
    
    record = HeartRateRecord(
        heart_rate=data.heart_rate,
        status=status_label,
        timestamp=datetime.utcnow()
    )
    
    session.add(record)
    session.commit()
    session.refresh(record)
    
    return record
