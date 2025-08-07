from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey
from datetime import datetime

Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    website: Mapped[str] = mapped_column(String, nullable=True)
    csv_file_id: Mapped[int] = mapped_column(ForeignKey("csv_files.id"))

    csv_file: Mapped["CSVFile"] = relationship(back_populates="companies")


class CSVFile(Base):
    __tablename__ = "csv_files"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    filename: Mapped[str] = mapped_column(String, nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(default=datetime.now())
    status: Mapped[str] = mapped_column(String, nullable=False)

    companies: Mapped[list["Company"]] = relationship(back_populates="csv_file")


