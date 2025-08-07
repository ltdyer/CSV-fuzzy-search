from datetime import datetime
from typing import List
from pydantic import BaseModel


class EntityMatchSchema(BaseModel):
    id: int 
    name: str
    type: str | None
    company_id: int
    

    class Config:
        from_attributes = True

class CompanySchema(BaseModel):
    id: int 
    name: str
    website: str | None
    csv_file_id: int
    entities: List[EntityMatchSchema] = []

    class Config:
        from_attributes = True

class CSVSchema(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime
    companies: List[CompanySchema] = []

    class Config:
        from_attributes = True



