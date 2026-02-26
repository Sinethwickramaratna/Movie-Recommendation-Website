from fastapi import APIRouter, Query
from app.models.schemas import MovieRequest, MovieResponse, MovieCardDetails, MovieDetails
from app.models.movie_model import MovieRecommender
import requests
from dotenv import load_dotenv
import os
from typing import List, Optional 
import pandas as pd

load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

router = APIRouter()

recommender = MovieRecommender(
    genres=[],
    release_year=0,
    runtime=0,
    vote_average=0.0,
    language="",
    adult=0
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
language_path = os.path.join(BASE_DIR, "../../data/language_codes.csv")
genre_path = os.path.join(BASE_DIR, "../../data/genres_details.csv")

language_details = pd.read_csv(language_path)
genre_details = pd.read_csv(genre_path)

@router.post("/recommend", response_model=MovieResponse)
def recommend_movies(request: MovieRequest):
    recommender.genres = request.genres
    recommender.release_year = request.release_year
    recommender.runtime = request.runtime
    recommender.vote_average = request.vote_average
    recommender.language = request.language
    recommender.adult = request.adult
    recommendations = recommender.recommend_movies()
    print(recommendations)

    movie_details = []
    from app.utils.movies import get_model_movie_details
    for rec in recommendations:
        details = get_model_movie_details(rec["Movie_id"])
        if details:
            movie_details.append(details)
        
    return {"recommended_movies": movie_details}


@router.get("/trending", response_model=List[MovieCardDetails])
def get_trending_movies():
    from app.utils.movies import get_trending_movies
    return get_trending_movies()
    


@router.get("/new_releases", response_model=List[MovieCardDetails])
def filtered_movies(
    genres: Optional[List[int]] = Query(None),
    release_year: Optional[int] = Query(None, ge=1900),
    min_vote: Optional[float] = Query(None, ge=0, le=10),
    latest: bool = Query(True),
    language: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=100)
):
    from app.utils.movies import get_filtered_movies

    return get_filtered_movies(
        genres=genres,
        release_year=release_year,
        min_vote=min_vote,
        latest=latest,
        language=language,
        limit=limit
    )

@router.get("/search", response_model=List[MovieCardDetails])
def search_movies(query: str, limit: int = Query(10, ge=1, le=100)):
    from app.utils.movies import search_movies

    return search_movies(query=query, limit=limit)

@router.get("/discover/{movie_id}", response_model=MovieDetails)
def get_movie_details(movie_id: int):
    from app.utils.movies import get_model_movie_details

    details = get_model_movie_details(movie_id)
    if details:
        return details
    else:
        return None
