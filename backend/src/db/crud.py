from typing import List
from src.db.models import CSVFile
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

async def get_all_csvs(db_session: AsyncSession) -> List[CSVFile]:
    all_csvs = (await db_session.execute(select(CSVFile))).all()
    return all_csvs

    