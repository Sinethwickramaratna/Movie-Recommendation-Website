import pandas as pd
import numpy as np
import joblib
from sklearn.metrics.pairwise import cosine_similarity

import os

class MovieRecommender:
  def __init__(self, genres, release_year, runtime, vote_average, language,adult=0):
      self.genres = genres
      self.release_year = release_year
      self.runtime = runtime
      self.vote_average = vote_average
      self.language = language
      self.adult = adult
      BASE_DIR = os.path.dirname(os.path.abspath(__file__))

      data_path = os.path.join(BASE_DIR, "..", "..", "data", "movie_data.csv")

      self.movie_data = pd.read_csv(data_path)
      self.language_data = pd.read_csv(os.path.join(BASE_DIR, "..","..","data", "language_codes.csv"))

      self.genre_data = pd.read_csv(os.path.join(BASE_DIR, "..","..","data", "movie_genres.csv"))

      self.movie_titles = pd.read_csv(os.path.join(BASE_DIR, "..","..","data", "movie_titles.csv"))

      self.mlb = joblib.load(os.path.join(BASE_DIR,"..","..","data","scalers","mlb.joblib"))
      self.preprocessor = joblib.load(os.path.join(BASE_DIR,"..","..","data","scalers","preprocessor.joblib"))


  def recommend_movies(self):
    genres = self.genre_data["Genres"].apply(lambda x: eval(x) if pd.notnull(x) else [])
    encoded_genres = self.mlb.transform(genres)
    preprocessed_data = self.preprocessor.transform(self.movie_data[["Runtime", "Vote_average", "Adult"]])

    if hasattr(preprocessed_data, "toarray"):
        preprocessed_data = preprocessed_data.toarray()
    final_data = np.hstack((preprocessed_data, encoded_genres))

    genres_encoded = self.mlb.transform([self.genres])

    language_code = self.language_data[self.language_data["Language_name"] == self.language.lower()]["Language_code"].values

    user_input = pd.DataFrame({
        "Runtime": [self.runtime],
        "Vote_average": [self.vote_average],
        "Adult": [self.adult],
    })
    user_preprocessed = self.preprocessor.transform(user_input)

    if hasattr(user_preprocessed, "toarray"):
        user_preprocessed = user_preprocessed.toarray()
    user_final = np.hstack((user_preprocessed, genres_encoded))

    filtered_indices = self.movie_data[
        (self.movie_data["Release_year"] == self.release_year) &
        (self.movie_data["Language"] == language_code[0] if len(language_code) > 0 else "Unknown")
    ].index
    filtered_final_data = final_data[filtered_indices]

    similarities = cosine_similarity(user_final, filtered_final_data)

    top5_local = similarities.argsort()[0][-5:][::-1]
    top5_idx = filtered_indices[top5_local]
    movie_list = []
    for idx in top5_idx:
        movie_list.append({
            "Movie_id": self.movie_titles.iloc[idx]['Movie_id'].item(),
        })

    return movie_list
