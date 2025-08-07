from typing import List
from src.db.models import CSVFile, EntityMatch
from fastapi import HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.dbConnection import get_db


async def get_all_csvs(db_session: AsyncSession) -> List[CSVFile]:
    all_csvs = (await db_session.execute(select(CSVFile))).all()
    return all_csvs

# async def add_entities_to_db(entites: List[EntityMatch], session: AsyncSession = Depends(get_db)):
#     session.add_all(entites)
#     await session.commit()

    