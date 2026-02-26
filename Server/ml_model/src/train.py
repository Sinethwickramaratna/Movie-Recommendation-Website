import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder, MultiLabelBinarizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import numpy as np
import joblib

import os

num_std = ["Runtime", "Vote_average"]

csv_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "movie_genres.csv")
genres = pd.read_csv(csv_path)["Genres"].apply(lambda x: eval(x) if pd.notnull(x) else [])

movie_data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "movie_data.csv")
movie_data = pd.read_csv(movie_data_path)

mlb = MultiLabelBinarizer()
mlb.fit(genres)

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), num_std),
    ],
    remainder="passthrough"
)

pipeline = Pipeline([
  ('preprocessor', preprocessor),
])

pipeline.fit(movie_data[["Runtime", "Vote_average", "Adult"]])

joblib.dump(mlb, os.path.join(os.path.dirname(__file__),'..','..','data','scalers','mlb.joblib'))
joblib.dump(pipeline, os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'scalers','preprocessor.joblib'))

