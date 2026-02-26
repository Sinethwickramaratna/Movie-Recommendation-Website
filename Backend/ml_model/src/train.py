import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder, MultiLabelBinarizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import numpy as np
import joblib

import os

num_std = ["Runtime", "Vote_average"]
cat_ohe = ["Language"]

mlb = MultiLabelBinarizer()

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), num_std),
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_ohe),
    ],
    remainder="passthrough"
)

pipeline = Pipeline([
  ('preprocessor', preprocessor),
])

joblib.dump(mlb, os.path.join(os.path.dirname(__file__), 'model_files','mlb.joblib'))
joblib.dump(pipeline, os.path.join(os.path.dirname(__file__), 'model_files','preprocessor.joblib'))

