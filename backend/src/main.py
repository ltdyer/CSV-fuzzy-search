from fastapi import FastAPI, APIRouter
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
from src.routes import csv

from src.db.models import Base
from src.db.dbConnection import lifespan

# DATABASE_URL = "postgresql+asyncpg://user:password@db:5432/mydb"

# engine = create_async_engine(DATABASE_URL, echo=True)
# AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)
#     yield
#     await engine.dispose()

app = FastAPI(lifespan=lifespan)

app.include_router(router=csv.router)

# async def get_db():
#     async with AsyncSessionLocal() as session:
#         yield session



@app.get("/")
def read_root():
    return {"Hello": "Worldd"}

