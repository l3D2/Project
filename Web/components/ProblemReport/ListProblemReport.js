import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  Button,
  TablePagination,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import dayjs from "dayjs";

const ListProblemReport = ({ emails, readItClick }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenModal = (email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
    readItClick(email);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmail(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Received</TableCell>
              <TableCell>Read Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((email, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleOpenModal(email)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      email.status == 1
                        ? "#d4edda"
                        : index % 2 === 0
                        ? "#f9f9f9"
                        : "white",
                    "&:hover": {
                      backgroundColor:
                        email.status == 1 ? "#c3e6cb" : "#f1f1f1",
                    },
                  }}
                >
                  <TableCell>{email.name}</TableCell>
                  <TableCell>{email.topic}</TableCell>
                  <TableCell>
                    {dayjs(email.date).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    {email.status == 1 ? (
                      <MarkEmailReadIcon
                        style={{
                          marginLeft: 8,
                          color: "green",
                        }}
                      />
                    ) : (
                      <EmailIcon
                        style={{
                          marginLeft: 8,
                          color: "red",
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={emails.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      {selectedEmail && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box className="bg-gray-400 p-6 rounded-lg shadow-lg w-1/2 mx-auto mt-40">
            <div className="mb-2">
              <Typography variant="h6" component="h2" className="mb-4">
                Email Content
              </Typography>
              <Typography>
                <strong>From:</strong> {selectedEmail.name}
              </Typography>
              <Typography>
                <strong>Subject:</strong> {selectedEmail.topic}
              </Typography>
              <Typography>
                <strong>Received:</strong>{" "}
                {dayjs(selectedEmail.date).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <div className="mt-1 p-3 bg-gray-50 text-black rounded">
                <Typography className="mt-4">{selectedEmail.detail}</Typography>
              </div>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default ListProblemReport;
