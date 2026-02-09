from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from sqlmodel import Session, select
from .database import engine, settings, User

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


DUMMY_KEY_TO_USER_ID = {
    "super-secret-key": 1,
}

async def get_user(api_key_header: str = Security(api_key_header)):
    session = Session(engine)
    user_id = DUMMY_KEY_TO_USER_ID.get(api_key_header)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).one_or_none()
    return user
    