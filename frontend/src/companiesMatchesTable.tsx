import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Drawer,
  Typography,
} from "@mui/material";
import { type CompaniesTableProps } from "./Interfaces/interfaces";

export function CompaniesMatchesTable({ tableData }: CompaniesTableProps) {
  const [selectedDetails, setSelectedDetails] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDetailsClick = (details: string) => {
    setSelectedDetails(details);
    setDrawerOpen(true);
  };

  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ display: "none" }}>ID</TableCell>
              <TableCell>Filename</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uploaded At</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData !== null
              ? tableData?.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ display: "none" }}>{row.id}</TableCell>
                    <TableCell>{row.filename}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.uploaded_at}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDetailsClick(row.companies)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : []}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
