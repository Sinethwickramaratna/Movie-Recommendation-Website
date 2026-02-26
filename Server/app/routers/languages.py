import pandas as pd
from fastapi import APIRouter
import os
from app.models.schemas import LanguageResponse

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
languages_file = os.path.join(BASE_DIR,"data/language_codes.csv")
languages_df = pd.read_csv(languages_file)

@router.get("/list", response_model=LanguageResponse)
def get_languages():
    languages_list = languages_df.to_dict(orient="records")
    return {"languages": languages_list}