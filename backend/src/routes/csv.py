from datetime import datetime
from fastapi import Depends, HTTPException, status, APIRouter, Response, UploadFile, File
from src.db.dbConnection import get_db
import io
import csv
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.crud import get_all_csvs
from src.db.schemas import CSVSchema, CompanySchema
from src.db.models import CSVFile, Company

router = APIRouter()

@router.get('/', response_model=CSVSchema)
async def get_all(session: AsyncSession = Depends(get_db)):
    result = await get_all_csvs(db_session=session)
    print(result)
    pass

@router.post("/upload")
async def upload_csv(session: AsyncSession = Depends(get_db), file: UploadFile = File(...)):
    contents = await file.read()
    decoded = contents.decode("utf-8")
    csv_io = io.StringIO(decoded)
    reader = csv.DictReader(csv_io)
    print(file)
    curr_date = datetime.now()
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
    await session.commit()

    return {
        "csv_id": csv_record.id,
        "inserted_companies": len(companies),
        "filename": csv_record.filename
    }
