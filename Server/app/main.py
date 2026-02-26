from fastapi import FastAPI
from app.routers import movies, categories, languages

app = FastAPI(title="Movie Recommender API", description="An API for recommending movies based on user preferences.", version="1.0.0")

app.include_router(movies.router, prefix="/movies", tags=["Movies"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
app.include_router(languages.router, prefix="/languages", tags=["Languages"])

@app.get("/")
def root():
  return {"message": "Welcome to the Movie Recommender API! Use the /movies/recommend endpoint to get movie recommendations based on your preferences."}

