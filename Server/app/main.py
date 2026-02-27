from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import movies, categories, languages

app = FastAPI(title="Movie Recommender API", description="An API for recommending movies based on user preferences.", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies.router, prefix="/api/movies", tags=["Movies"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
app.include_router(languages.router, prefix="/api/languages", tags=["Languages"])

@app.get("/")
def root():
  return {"message": "Welcome to the Movie Recommender API! Use the /movies/recommend endpoint to get movie recommendations based on your preferences."}

