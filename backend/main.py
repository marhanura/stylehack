from fastapi import FastAPI
from api import recommend

app = FastAPI()
app.include_router(recommend.router)

