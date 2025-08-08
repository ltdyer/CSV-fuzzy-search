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
  Modal,
  Box,
} from "@mui/material";
import { type CsvTableProps, type Company } from "./Interfaces/interfaces";
import { useApi } from "./Api/useApi";

interface csvDetailsResponse {
  num_of_rows: number;
  num_of_entities: number;
}

export function CsvTable({ tableData, onClickDetailsButton }: CsvTableProps) {
  const [selectedCsvId, setSelectedCsvId] = useState<number>();
  const [panelOpen, setPanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState<string[]>();
  const { getCsvDetails } = useApi();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleViewClick = (selectedCsvId: number) => {
    setSelectedCsvId(selectedCsvId);
    setPanelOpen(true);
    onClickDetailsButton(selectedCsvId, true);
  };

  const handleDetailsClick = async (selectedCsvId: number) => {
    const results: csvDetailsResponse = await getCsvDetails(selectedCsvId);
    console.log(results);
    setModalDetails([
      results.num_of_rows.toString(),
      results.num_of_entities.toString(),
    ]);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalDetails([]);
  };

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
              <TableCell>View</TableCell>
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
                        onClick={() => handleViewClick(row.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDetailsClick(row.id)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : []}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalDetails
              ? `Number of Rows: ${modalDetails[0]}`
              : "Wow couldnt find details"}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalDetails
              ? `Number of Matches: ${modalDetails[1]}`
              : "Wow couldnt find details"}
          </Typography>
        </Box>
      </Modal>

      {/* <DetailsPanel isOpen={panelOpen} csvId={selectedCsvId} /> */}
    </>
  );
}
