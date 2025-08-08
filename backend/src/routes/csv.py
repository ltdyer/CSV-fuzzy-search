from datetime import datetime
from fastapi import Depends, HTTPException, status, APIRouter, Response, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
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

@router.get("/getCompany/{companyId}")
async def get_company(companyId: int, session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(Company).where(Company.id == companyId).options(selectinload(Company.entities))
    )
    company = result.scalar_one()
    return company

@router.get("/getCsv/{csvId}")
async def get_csv(csvId: int, session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(CSVFile).where(CSVFile.id == csvId).options(selectinload(CSVFile.companies))
    )
    csv_file = result.scalar_one()
    return csv_file

class UpdateCSVStatus(BaseModel):
    csvId: int
    status: str

@router.put("/updateCsvStatus")
async def update_csv_status(body: UpdateCSVStatus, session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(CSVFile).where(CSVFile.id == body.csvId)
    )
    csv_file = result.scalar_one()
    csv_file.status = body.status

    await session.commit()
    return csv_file

@router.get("/getCsvDetails/{csv_id}")
async def get_csv_details(csv_id: int, session: AsyncSession = Depends(get_db)):
    csv_result = await session.execute(
        select(CSVFile).where(CSVFile.id == csv_id).options(selectinload(CSVFile.companies))
    )
    csv_file = csv_result.scalar_one()

    companies = csv_file.companies
    company_ids = [company.id for company in companies]
    companies_result = await session.execute(
        select(Company).where(Company.id.in_(company_ids)).options(selectinload(Company.entities))
    )
    all_companies = companies_result.scalars().all()

    num_of_rows = len(all_companies)
    num_of_entities = 0
    for comp in all_companies:
        num_of_entities += len(comp.entities)

    return {
        "num_of_rows": num_of_rows,
        "num_of_entities": num_of_entities
    }

@router.get("/downloadCsv/{csv_id}")
async def download_csv(csv_id: int, session: AsyncSession = Depends(get_db)):
    csv_result = await session.execute(
        select(CSVFile).where(CSVFile.id == csv_id).options(selectinload(CSVFile.companies))
    )
    csv_file = csv_result.scalar_one()

    # recreate csv
    output = io.StringIO()
    fieldnames = list(csv_file.companies[0].__dict__.keys())
    fieldnames = [f for f in fieldnames if not f.startswith('_') and f != 'csv_file_id' and f != 'id']
    new_column = "entities"
    fieldnames.append(new_column)

    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()

    # get companies
    companies = csv_file.companies
    company_ids = [company.id for company in companies]
    companies_result = await session.execute(
        select(Company).where(Company.id.in_(company_ids)).options(selectinload(Company.entities))
    )
    all_companies = companies_result.scalars().all()

    # add entities to new row
    print(fieldnames)
    for comp in all_companies:
        row = comp.__dict__.copy()
        row = {k: v for k, v in row.items() if not k.startswith('_') and k != 'csv_file_id' and k != 'id'}
        row[new_column] = [entity.name for entity in comp.entities]
        writer.writerow(row)
    
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=csvfile_{csv_id}.csv"}
    )


#@router.get("/getEntities/{}")
        
    
