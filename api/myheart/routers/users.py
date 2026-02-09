from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.get("/")
async def read_users():
    return [{"username": "smart_user"}]

@router.get("/me")
async def read_user_me():
    return {"username": "current_user"}
