import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { FileUpload } from "./FileUpload";
import { CsvTable } from "./CsvTable";
import { useApi } from "./Api/useApi";
import type { TableRowData } from "./Interfaces/interfaces";

function App() {
  const [count, setCount] = useState(0);
  const { getAllCsv } = useApi();
  const [csvData, setCsvData] = useState<TableRowData[]>([
    {
      id: 0,
      filename: "",
      status: "",
      companies: "",
      uploaded_at: "",
    },
  ]);

  useEffect(() => {
    const getCsv = async function () {
      const result = await getAllCsv();
      const csvFiles: TableRowData[] = result["csv_files"][0];
      setCsvData(csvFiles);
    };
    getCsv();
  }, []);

  useEffect(() => {
    console.log(csvData);
  }, [csvData]);

  const handleCsvUpload = (data: TableRowData) => {
    console.log(data);
    setCsvData((prevState) => [...prevState, data]);
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <FileUpload
          handleCsvUploadData={async (data) => handleCsvUpload(data)}
        />
        <CsvTable tableData={csvData} />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
