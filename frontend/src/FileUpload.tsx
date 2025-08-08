import { useState } from "react";
import { Button, Input } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useApi } from "./Api/useApi";
import type { CsvTableRowData } from "./Interfaces/interfaces";

interface FileUploadProps {
  handleCsvUploadData: (csvData: any) => {};
}

export const FileUpload = ({ handleCsvUploadData }: FileUploadProps) => {
  const [csv, setCsv] = useState<File>();
  const { upload } = useApi();

  const handleFileSet = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      setCsv(input.files[0]);
    }
  };

  const handleButtonClick = async () => {
    if (csv) {
      const formData = new FormData();
      formData.append("file", csv);

      const result = await upload(formData);
      const parsedResult: CsvTableRowData = result["csv_record"];
      // const response = await fetch("http://localhost:8080/upload", {
      //   method: "POST",
      //   body: formData,
      // });

      // const result = await response.json();
      console.log(parsedResult);
      handleCsvUploadData(parsedResult);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFileSet(e)}></input>
      <Button
        component="label"
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        onClick={handleButtonClick}
      >
        Upload Files
      </Button>
    </div>
  );
};
