from movie_recommend import *

if __name__ == "__main__":
    genres = ["Action", "Adventure"]
    release_year = 2010
    runtime = 120
    vote_average = 7.5
    language = "English"

    recommender = MovieRecommender(genres, release_year, runtime, vote_average, language)
    recommendations = recommender.recommend_movies()
    print("Top 5 recommended movies:")
    for movie in recommendations:
        print(f"Movie ID: {movie['Movie_id']}, Title: {movie['Title']}")