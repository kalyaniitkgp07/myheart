from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, Session
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:pass@db:5432/heartrate"
    SECRET_API_KEY: str = "super-secret-key"

    class Config:
        env_file = ".env"

settings = Settings()

class HeartRateRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    heart_rate: int
    status: str  # "NORMAL" or "HIGH"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

engine = create_engine(settings.DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
