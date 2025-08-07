from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
from src.routes import csv

from src.db.models import Base
from src.db.dbConnection import lifespan

app = FastAPI(lifespan=lifespan)

origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=csv.router)




@app.get("/")
def read_root():
    return {"Hello": "Worldd"}

