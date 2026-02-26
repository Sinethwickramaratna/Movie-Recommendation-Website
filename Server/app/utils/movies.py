import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import pandas as pd
from typing import List, Optional
import math

load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_PATH, "../../data/genres_details.csv")
genre_details = pd.read_csv(csv_path)

language_path = os.path.join(BASE_PATH, "../../data/language_codes.csv")
language_details = pd.read_csv(language_path)

def get_model_movie_details(movie_id: int):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}"
    params = {
        "api_key": TMDB_API_KEY,
        "language": "en-US"
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        lang_code = data.get("original_language")
        lang_name = "Unknown"
        if not language_details.loc[language_details["Language_code"] == lang_code].empty:
            lang_name = language_details.loc[language_details["Language_code"] == lang_code, "Language_name"].values[0]
        movie = {
            "movie_id": data.get("id"),
            "title": data.get("title"),
            "overview": data.get("overview"),
            "genres": [
                genre_details.loc[genre_details["Genre_id"] == genre["id"], "Genre_name"].values[0]
                for genre in data.get("genres", [])
                if not genre_details.loc[genre_details["Genre_id"] == genre["id"]].empty
            ],
            "poster_path": data.get("poster_path"),
            "release_date": data.get("release_date"),
            "runtime": data.get("runtime"),
            "vote_average": data.get("vote_average"),
            "language": lang_name
        }
        return movie

    else:
        return None

def get_trending_movies():
    url = f"https://api.themoviedb.org/3/trending/movie/week"
    params = {
        "api_key": TMDB_API_KEY,
        "language": "en-US"
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        trending_movies = []
        for movie in data.get("results", [])[:10]:  # Get top 10 trending movies

            lang_code = movie.get("original_language")
            lang_name = "Unknown"
            if not language_details.loc[language_details["Language_code"] == lang_code].empty:
                lang_name = language_details.loc[language_details["Language_code"] == lang_code, "Language_name"].values[0]


            trending_movies.append({
                "movie_id": movie.get("id"),
                "title": movie.get("title", ""),
                "genres": [
                    genre_details.loc[genre_details["Genre_id"] == genre_id, "Genre_name"].values[0]
                    for genre_id in movie.get("genre_ids", [])
                    if not genre_details.loc[genre_details["Genre_id"] == genre_id].empty
                ], 
                "poster_path": movie.get("poster_path", ""),
                "release_date": movie.get("release_date", ""),
                "language": lang_name
            })
        return trending_movies
    else:
        return []

def get_filtered_movies(
    genres: Optional[List[str]] = None,
    release_year: Optional[int] = None,
    min_vote: Optional[float] = None,
    latest: bool = False,
    language: Optional[str] = None,
    limit: int = 10
):
    url = "https://api.themoviedb.org/3/discover/movie"

    movies = []
    page = 1

    today = datetime.today().strftime("%Y-%m-%d") if latest else None
    # Calculate how many pages we need
    pages_needed = math.ceil(limit / 20)

    while page <= pages_needed:
        params = {
            "api_key": TMDB_API_KEY,
            "language": "en-US",
            "sort_by": "release_date.desc" if latest else "popularity.desc",
            "page": page,
            "primary_release_date.lte": today,
        }

        if genres:
            params["with_genres"] = ",".join(map(str, genres))

        if release_year:
            params["primary_release_year"] = release_year

        if min_vote:
            params["vote_average.gte"] = min_vote
        
        if language:
            lang_row = language_details[
                language_details["Language_name"].str.strip().str.lower() == language.strip().lower()
            ]

            if not lang_row.empty:
                params["with_original_language"] = lang_row["Language_code"].values[0]
            else:
                raise ValueError(f"Language '{language}' not found")

        response = requests.get(url, params=params)

        if response.status_code != 200:
            break

        data = response.json()
        results = data.get("results", [])

        for movie in results:
            if len(movies) >= limit:
                break
            lang_code = movie.get("original_language")
            lang_name = "Unknown"
            if not language_details.loc[language_details["Language_code"] == lang_code].empty:
                lang_name = language_details.loc[language_details["Language_code"] == lang_code, "Language_name"].values[0]


            movies.append({
                "movie_id": movie.get("id"),
                "title": movie.get("title"),
                "genres": [
                    genre_details.loc[genre_details["Genre_id"] == genre_id, "Genre_name"].values[0]
                    for genre_id in movie.get("genre_ids", [])
                    if not genre_details.loc[genre_details["Genre_id"] == genre_id].empty
                ],
                "poster_path": movie.get("poster_path"),
                "release_date": movie.get("release_date"),
                "language": lang_name
            })

        page += 1

    return movies[:limit]

def search_movies(query: str, limit: int = 10):
    url = "https://api.themoviedb.org/3/search/movie"

    movies = []
    page_number = math.ceil(limit / 20)

    for page in range(1, page_number + 1):

        params = {
            "api_key": TMDB_API_KEY,
            "language": "en-US",
            "query": query,
            "page": page,
            "include_adult": False
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            break

        data = response.json()

        for movie in data.get("results", []):
            if len(movies) >= limit:
                break
            
            lang_code = movie.get("original_language")
            lang_name = "Unknown"
            if not language_details.loc[language_details["Language_code"] == lang_code].empty:
                lang_name = language_details.loc[language_details["Language_code"] == lang_code, "Language_name"].values[0]


            movies.append({
                "movie_id": movie.get("id"),
                "title": movie.get("title"),
                "genres": [
                    genre_details.loc[genre_details["Genre_id"] == genre_id, "Genre_name"].values[0]
                    for genre_id in movie.get("genre_ids", [])
                    if not genre_details.loc[genre_details["Genre_id"] == genre_id].empty
                ],
                "poster_path": movie.get("poster_path"),
                "release_date": movie.get("release_date"),
                "language": lang_name
            })

    return movies