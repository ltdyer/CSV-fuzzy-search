from datetime import datetime
from fastapi import Depends, HTTPException, status, APIRouter, Response, UploadFile, File
from src.db.dbConnection import get_db
import io
import csv
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.crud import get_all_csvs
from src.db.schemas import CSVSchema, CompanySchema
from src.db.models import CSVFile, Company
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from src.utils.matching import match_entity

router = APIRouter()

@router.get('/getAllCsv')
async def get_all(session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(CSVFile)
        .options(selectinload(CSVFile.companies))
        )
    csv_files = result.scalars().all()

    return {
        "csv_files": [csv_files]
    }

@router.post("/upload")
async def upload_csv(session: AsyncSession = Depends(get_db), file: UploadFile = File(...)):
    contents = await file.read()
   
    decoded = contents.decode("utf-8")
    csv_io = io.StringIO(decoded)
    reader = csv.DictReader(csv_io)
    csv_record = CSVFile(filename=file.filename, status="Pending Review")
    session.add(csv_record)
    await session.flush()

    companies = []
    for row in reader:
        name = row.get("Company Name")
        website = row.get("Website")
        if name and website:
            company = Company(name=name, website=website, csv_file_id=csv_record.id)
            companies.append(company)
    
    session.add_all(companies)
    await session.flush()

    entity_matches_obj =  match_entity(companies=companies)
    session.add_all(entity_matches_obj["entity_db"])
    await session.commit()


    return {
        "csv_record": csv_record
    }
