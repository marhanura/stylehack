from fastapi import FastAPI
from api import recommend
from api import upload

app = FastAPI()
app.include_router(recommend.router)
app.include_router(upload.router)
