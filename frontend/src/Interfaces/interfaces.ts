export interface TableRowData {
  id: number;
  filename: string;
  status: string;
  companies: string;
  uploaded_at: string;
}

export interface CompaniesTableProps {
  tableData: TableRowData[];
}

export interface CsvTableProps {
  tableData: TableRowData[];
}
