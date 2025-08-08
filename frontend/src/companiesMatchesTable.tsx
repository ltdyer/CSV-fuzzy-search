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
  Typography,
  Collapse,
  Box,
} from "@mui/material";
import {
  type CompaniesTableProps,
  type getCompanyResponse,
} from "./Interfaces/interfaces";
import { useApi } from "./Api/useApi";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import React from "react";

export function CompaniesMatchesTable({ tableData }: CompaniesTableProps) {
  const { getCompanyById } = useApi();
  const [openRows, setOpenRows] = useState<Record<string | number, boolean>>(
    {}
  );
  const [fetchedCompanyData, setFetchedCompanyData] =
    useState<getCompanyResponse>();

  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getCompanyDetails = async (companyId: number) => {
    const result: getCompanyResponse = await getCompanyById(companyId);
    setFetchedCompanyData(result);
    toggleRow(companyId);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ display: "none" }}>ID</TableCell>
              <TableCell>
                <b>Company Name</b>
              </TableCell>
              <TableCell>
                <b>Website</b>
              </TableCell>
              <TableCell>
                <b>Details</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData !== null
              ? tableData?.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow key={row.id}>
                      <TableCell style={{ display: "none" }}>
                        {row.id}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.website}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => getCompanyDetails(row.id)}
                        >
                          View Matched Entities
                          {openRows[row.id] ? <ExpandLess /> : <ExpandMore />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={3}
                      >
                        <Collapse
                          in={openRows[row.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Typography variant="subtitle1" gutterBottom>
                              Matched Entities
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Type</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {fetchedCompanyData
                                  ? fetchedCompanyData.entities.map(
                                      (entity, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{entity.name}</TableCell>
                                          <TableCell>{entity.type}</TableCell>
                                        </TableRow>
                                      )
                                    )
                                  : []}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              : []}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
