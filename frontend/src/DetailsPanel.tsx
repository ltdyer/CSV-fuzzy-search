import { Button, ButtonGroup, Drawer, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import {
  type DetailsProps,
  type getCsvResponse,
  type Company,
  type CompanyTableRowData,
  type status,
} from "./Interfaces/interfaces";
import { CompaniesMatchesTable } from "./CompaniesMatchesTable";
import { useApi } from "./Api/useApi";
import {
  ArrowBack,
  Check,
  PriorityHigh,
  GppBad,
  Download,
} from "@mui/icons-material";

export const DetailsPanel = ({ isOpen, csvId, close }: DetailsProps) => {
  const [id, setId] = useState<number>(csvId || 0);
  const [companies, setCompanies] = useState<Array<Company>>([]);
  const { getCsvById, updateCsvStatus, downloadCsv } = useApi();

  useEffect(() => {
    console.log(isOpen);
    if (isOpen) {
      const getCsv = async () => {
        const result: getCsvResponse = await getCsvById(id);
        console.log(result);
        setCompanies(result.companies);
      };
      getCsv();
    }
  }, [open]);

  const closePanel = () => {
    setId(0);
    setCompanies([]);
    close();
  };

  const updateStatus = async (status: status) => {
    await updateCsvStatus(id, status);
    closePanel();
  };

  const download = async () => {
    await downloadCsv(id);
  };

  return (
    <>
      <ButtonGroup aria-label="Medium-sized button group">
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<ArrowBack />}
          onClick={closePanel}
        >
          Close Panel
        </Button>
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<PriorityHigh />}
          onClick={() => updateStatus("Under Review")}
          color={"secondary"}
        >
          Mark Under Review
        </Button>
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<Check />}
          onClick={() => updateStatus("Approved")}
          color={"success"}
        >
          Approve CSV
        </Button>
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<GppBad />}
          onClick={() => updateStatus("Rejected")}
          color={"error"}
        >
          Reject CSV
        </Button>
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<Download />}
          onClick={download}
          color={"secondary"}
        >
          Download CSV
        </Button>
      </ButtonGroup>

      <CompaniesMatchesTable tableData={companies} />
    </>
  );
};
