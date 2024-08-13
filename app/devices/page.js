"use client";

import { useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";

//components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import DataTable from "@/components/dataTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
//Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

export default function Devices() {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async () => {
    const res = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const handleAddDevice = async () => {
    console.log("Add new device");
  };

  const handleEdit = (id) => {
    console.log(`Edit device with id: ${id}`);
    // Implement your edit logic here
  };

  const handleDelete = (id) => {
    console.log(`Delete device with id: ${id}`);
    // Implement your delete logic here
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      width: 80,
      resizable: false,
    },
    {
      field: "datetime",
      headerName: "Register Time",
      headerClassName: "super-app-theme--header",
      type: "dateTime",
      valueGetter: (value) => value && new Date(value),
      flex: 0.3,
      editable: false,
      resizable: false,
    },
    {
      field: "name",
      headerName: "Device Name",
      headerClassName: "super-app-theme--header",
      type: "string",
      flex: 1,
      editable: false,
      resizable: false,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      type: "actions",
      flex: 0.25,
      resizable: false,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<InfoIcon />}
          label="Info"
          onClick={() => console.log(`Add device with id: ${id}`)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(id)}
        />,
      ],
    },
  ];

  const rows = [
    { id: 1, datetime: "11/11/11", name: "Jon", age: 14 },
    { id: 2, datetime: "12/11/11", name: "Cersei", age: 31 },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <>
      <Navbar session={session} />
      <Content>
        {"All Devices"}
        <div>
          <DataTable columns={columns} rows={rows} />
        </div>
      </Content>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h1 className="text-black text-center text-lg">Add Device</h1>
          <div className="flex justify-center text-black my-3">
            <div className="w-full max-w-[300px]">
              <div className="relative w-full h-10">
                <input
                  className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                  placeholder=" "
                />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                  MAC-ADDRESS
                </label>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <div className=" absolute bottom-5 right-5">
        <button
          className="bg-gray-400 rounded-full p-2 shadow-sm"
          onClick={handleOpen}
        >
          <AddIcon />
        </button>
      </div>
    </>
  );
}
