from fastapi import APIRouter, Query
from app.models.schemas import CategoryResponse

router = APIRouter()

@router.get("/list", response_model=CategoryResponse)
def get_categories():
  from app.utils.categories import get_categories
  return {"categories": get_categories()}