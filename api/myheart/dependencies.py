from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from sqlmodel import Session
from .database import engine, settings

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def get_session():
    with Session(engine) as session:
        yield session

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == settings.SECRET_API_KEY:
        return api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
