from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime
from pydantic import BaseModel
from ..database import HeartRateRecord
from ..dependencies import get_session, get_user
from ..process import classify_heart_rate

router = APIRouter(
    prefix="/heart-rate",
    tags=["heart-rate"],
)

class HeartRateIn(BaseModel):
    heart_rate: int

@router.get("", response_model=List[HeartRateRecord])
async def get_heart_rates(
    session: Session = Depends(get_session)
):
    """
    Retrieve the last 20 heart rate readings.
    """
    statement = select(HeartRateRecord).order_by(HeartRateRecord.timestamp.desc()).limit(20)
    results = session.exec(statement).all()
    return results

@router.post("", status_code=status.HTTP_201_CREATED)
async def ingest_heart_rate(
    data: HeartRateIn,
    session: Session = Depends(get_session),
    user: User = Depends(get_user)
):
    status_label = classify_heart_rate(data.heart_rate)
    
    record = HeartRateRecord(
        user_id=user.id,
        heart_rate=data.heart_rate,
        status=status_label,
        timestamp=datetime.utcnow()
    )
    
    session.add(record)
    session.commit()
    session.refresh(record)
    
    return record
