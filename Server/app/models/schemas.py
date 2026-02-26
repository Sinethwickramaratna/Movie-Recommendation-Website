from pydantic import BaseModel
from typing import List
from typing import Optional

class MovieRequest(BaseModel):
    genres: List[str]
    release_year: int
    runtime: int
    vote_average: float
    language: str
    adult: int

class MovieDetails(BaseModel):
    movie_id: int
    title: str
    overview: str
    genres: List[str]
    poster_path: Optional[str]
    release_date: str
    runtime: int
    vote_average: float
    language: Optional[str]

class MovieResponse(BaseModel):
    recommended_movies: List[MovieDetails]

class MovieCardDetails(BaseModel):
    movie_id: int
    title: str
    genres: List[str]
    poster_path: Optional[str]
    release_date: str
    language: Optional[str]

class CategoryDetails(BaseModel):
    Genre_id: int
    Genre_name: str

class CategoryResponse(BaseModel):
    categories: List[CategoryDetails]

class LanguageDetails(BaseModel):
    Language_code: str
    Language_name: str

class LanguageResponse(BaseModel):
    languages: List[LanguageDetails]