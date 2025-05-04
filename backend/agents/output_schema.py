from pydantic import BaseModel
from typing import List

class Product(BaseModel):
    category: str
    name: str
    links: List[str]

class RecommendationOutput(BaseModel):
    products: List[Product]
