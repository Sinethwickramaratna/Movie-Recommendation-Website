import pandas as pd
import os

BASE_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

category_path = os.path.join(BASE_PATH, "data/genres_details.csv")

category_data = pd.read_csv(category_path)

def get_categories():
  categories = category_data.to_dict(orient="records")
  return categories