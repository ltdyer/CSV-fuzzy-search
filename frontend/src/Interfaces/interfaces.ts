export interface Company {
  id: number;
  csv_file_id: number;
  website: string;
  name: string;
}

export interface CsvTableRowData {
  id: number;
  filename: string;
  status: string;
  uploaded_at: string;
}

export interface Entity {
  id: number;
  name: string;
  type: string;
}

export interface CompanyTableRowData {
  id: number;
  csv_file_id: number;
  name: string;
  website: string;
  //entities: Entity[];
}

export interface CompaniesTableProps {
  tableData: CompanyTableRowData[];
}

export interface CsvTableProps {
  tableData: CsvTableRowData[];
  onClickDetailsButton: (selectedCsvId: number, panelOpen: boolean) => void;
}

export interface DetailsProps {
  isOpen: boolean;
  csvId: number | null;
  close: () => void;
}

export interface getCsvResponse {
  id: number;
  status: string;
  csv_file: string;
  uploaded_at: string;
  companies: Company[];
}

export interface getCompanyResponse {
  id: number;
  csv_file_id: number;
  name: string;
  website: string;
  entities: Entity[];
}

export type status = "Under Review" | "Approved" | "Rejected";
