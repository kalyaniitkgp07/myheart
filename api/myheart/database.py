from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, Session, Relationship
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:pass@db:5432/heartrate"
    SECRET_API_KEY: str = "super-secret-key"

    class Config:
        env_file = ".env"

settings = Settings()

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: Optional[str] = None
    
    records: list["HeartRateRecord"] = Relationship(back_populates="user")

class HeartRateRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    heart_rate: int
    status: str  # "NORMAL" or "HIGH"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="records")

engine = create_engine(settings.DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    # Create a dummy user
    with Session(engine) as session:
        if not session.query(User).filter(User.username == "dummy_user").first():
            user = User(username="dummy_user", email="dummy_user@example.com")
            session.add(user)
            session.commit()

def get_session():
    with Session(engine) as session:
        yield session
