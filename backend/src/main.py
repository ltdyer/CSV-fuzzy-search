from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager

from src.db.models import Base, User

DATABASE_URL = "postgresql+asyncpg://user:password@db:5432/mydb"

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: Close engine (optional)
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session



@app.get("/")
def read_root():
    return {"Hello": "Worldd"}

