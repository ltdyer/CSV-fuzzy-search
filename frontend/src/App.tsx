import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import excelLogo from "./assets/excel.svg";
import "./App.css";
import { FileUpload } from "./FileUpload";
import { CsvTable } from "./CsvTable";
import { useApi } from "./Api/useApi";
import type { CsvTableRowData } from "./Interfaces/interfaces";
import { DetailsPanel } from "./DetailsPanel";
import { Drawer } from "@mui/material";

function App() {
  const [count, setCount] = useState(0);
  const { getAllCsv } = useApi();
  const [csvData, setCsvData] = useState<CsvTableRowData[]>([
    {
      id: 0,
      filename: "",
      status: "",
      uploaded_at: "",
    },
  ]);

  const [selectedCsvId, setSelectedCsvId] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const getCsv = async function () {
      const result = await getAllCsv();
      const csvFiles: CsvTableRowData[] = result["csv_files"][0];
      setCsvData(csvFiles);
    };
    getCsv();
  }, []);

  const handleCsvUpload = (data: CsvTableRowData) => {
    console.log(data);
    setCsvData((prevState) => [...prevState, data]);
  };

  const openDetailsPanel = (csvId: number, panelOpen: boolean) => {
    setPanelOpen(panelOpen);
    setSelectedCsvId(csvId);
  };

  const closeDetailsPanel = () => {
    setPanelOpen(false);
    setSelectedCsvId(null);
    const getCsv = async function () {
      const result = await getAllCsv();
      const csvFiles: CsvTableRowData[] = result["csv_files"][0];
      setCsvData(csvFiles);
    };
    getCsv();
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={excelLogo} className="logo" alt="Excel logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>CSV Fuzzy Search</h1>
      <div className="card">
        <FileUpload
          handleCsvUploadData={async (data) => handleCsvUpload(data)}
        />
        <CsvTable tableData={csvData} onClickDetailsButton={openDetailsPanel} />
        <Drawer open={panelOpen}>
          <DetailsPanel
            isOpen={panelOpen}
            csvId={selectedCsvId}
            close={closeDetailsPanel}
          />
        </Drawer>
      </div>
    </>
  );
}

export default App;
