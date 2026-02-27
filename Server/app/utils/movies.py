import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import pandas as pd
from typing import List, Optional
import math

load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = os.getenv("TMDB_BASE_URL")

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_PATH, "../../data/genres_details.csv")
genre_details = pd.read_csv(csv_path)

language_path = os.path.join(BASE_PATH, "../../data/language_codes.csv")
language_details = pd.read_csv(language_path)

def get_model_movie_details(movie_id: int):
    url = f"{TMDB_BASE_URL}movie/{movie_id}"
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
            "vote_count": data.get("vote_count"),
            "language": lang_name
        }
        return movie

    else:
        return None

def get_trending_movies():
    url = f"{TMDB_BASE_URL}trending/movie/week"
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
    sort_by: str = "Latest",
    language: Optional[str] = None,
    limit: int = 20,
    page: int = 1
):
    url = f"{TMDB_BASE_URL}discover/movie"

    movies = []
    
    # Map frontend sort strings to valid TMDB sort_by parameters
    sort_mapping = {
        "Latest": "primary_release_date.desc",
        "Top Rated": "vote_average.desc",
        "Popularity": "popularity.desc",
        "A-Z": "original_title.asc"
    }
    tmdb_sort_by = sort_mapping.get(sort_by, "popularity.desc")

    today = datetime.today().strftime("%Y-%m-%d")

    params = {
        "api_key": TMDB_API_KEY,
        "language": "en-US",
        "sort_by": tmdb_sort_by,
        "page": page,
    }

    if sort_by == "Latest":
        params["primary_release_date.lte"] = today

    if genres:
        # User passes genre names - we need to map them back to ids for the TMDB api
        # Extract and split strings in case FastAPI parsed "Action,Adventure" as a single element ["Action,Adventure"]
        genre_ids = []
        flat_genres = []
        for g in genres:
            flat_genres.extend([x.strip() for x in g.split(",")])
            
        for g_name in flat_genres:
            name_str = str(g_name).strip().lower()
            matching_genre = genre_details[genre_details["Genre_name"].str.strip().str.lower() == name_str]
            if not matching_genre.empty:
                genre_ids.append(str(matching_genre["Genre_id"].values[0]))
        if genre_ids:
            params["with_genres"] = ",".join(genre_ids)

    if release_year:
        params["primary_release_year"] = release_year

    if sort_by == "Top Rated":
        # Ensure we only get movies with a statistically significant number of votes
        params["vote_count.gte"] = 300

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

    # Fetch pages continuously until we meet the limit of movies that have a poster image
    while len(movies) < limit:
        response = requests.get(url, params=params)

        if response.status_code != 200:
            break

        data = response.json()
        results = data.get("results", [])
        
        if not results:
            break # No more results from TMDB

        for movie in results:
            if len(movies) >= limit:
                break
                
            # Filter: only include movies with valid images
            if not movie.get("poster_path"):
                continue

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
            
        # Increment page parameter to request the next batch if limit hasn't been met yet
        params["page"] += 1

    return movies

def search_movies(query: str, limit: int = 10, page: int = 1):
    url = f"{TMDB_BASE_URL}search/movie"
    movies = []
    
    params = {
        "api_key": TMDB_API_KEY,
        "language": "en-US",
        "query": query,
        "page": page,
        "include_adult": False
    }

    # Fetch exactly the page requested by frontend
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        
        # We enforce limits differently when searching per-page
        # Limit usually applies per page payload constraints now
        limited_results = data.get("results", [])[:limit]

        for movie in limited_results:
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

def get_movie_cast(movie_id: int, limit: int = 5):
    url = f"{TMDB_BASE_URL}movie/{movie_id}/credits"
    
    params = {
        "api_key": TMDB_API_KEY,
        "language": "en-US"
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return []

    data = response.json()
    cast_list = data.get("cast", [])

    cast = []
    for member in cast_list[:limit]:
        cast.append({
            "cast_id": member.get("id"),
            "name": member.get("name"),
            "character": member.get("character"),
            "profile_path": member.get("profile_path"),
            "known_for_department": member.get("known_for_department"),
            "popularity": member.get("popularity")
        })

    return cast