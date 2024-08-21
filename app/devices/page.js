"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

//components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import DataTable from "@/components/dataTable";
import QrCodeScanner from "@/components/qrScanner";
import { GridActionsCellItem } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

//Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

export default function Devices() {
  const { data: session, status } = useSession();
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState([]);
  const [editData, setEData] = useState({
    id: "",
    name: "",
    category: 0,
  });

  const fetchDevices = async () => {
    const id = session.user.id;
    const res = await fetch(`https://api.bd2-cloud.net/api/device/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (res.ok) {
      setData(json);
      console.log("Fetched devices:", json);
      formatData(json);
      console.log("Formatted data:", rows);
    } else {
      console.error("Failed to fetch device.");
    }
  };

  const formatData = (d) => {
    const result = Object.values(d).map((item, index) => ({
      id: item.device_id,
      datetime: item.register_ts,
      name: item.device_name,
    }));
    setRows(result);
  };

  useEffect(() => {
    if (session && session.user) {
      fetchDevices();
    }
  }, [session]);

  // Check status session
  if (status === "loading") {
    return null; // Loading indicator
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  }

  const handleOpenModal = () => {
    setOpen(!open);
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

  const handleEdit = async (id) => {
    console.log(`Edit device with id: ${id}`);
    setIsEditing(!isEditing);
  };

  const handleDelete = (id) => {
    console.log(`Delete device with id: ${id}`);
    // Implement your delete logic here
  };

  const handleScanSuccess = (decodedText, decodedResult) => {
    console.log(`Code matched: ${decodedText}`, decodedResult);
  };

  const handleScanFailure = (error) => {
    console.warn(`QR code scanning failed: ${error}`);
  };

  const handleChange = (e) => {
    console.log(`Category: ${e.target.value}`);
    setEData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      headerClassName: "super-app-theme--header",
      //width: 80,
      flex: 1,
      resizable: false,
    },
    {
      field: "datetime",
      headerName: "Register Time",
      headerClassName: "super-app-theme--header",
      type: "dateTime",
      valueGetter: (value) => value && new Date(value),
      flex: 1,
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
      flex: 1,
      resizable: false,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<InfoIcon />}
          label="Info"
          onClick={() => console.log(`INfo device with id: ${id}`)}
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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#37465c",
    border: "2px solid #000",
    borderRadius: "10px",
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
      {/* Modal Add Device */}
      <Modal
        open={open}
        onClose={handleOpenModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h1 className="text-white text-center text-2xl">Add Device</h1>
          <div className="flex justify-center text-black my-3">
            <div className="w-full max-w-[300px]">
              <div className="relative w-full h-10">
                <input
                  className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-white border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-400"
                  placeholder=" "
                />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-200 before:border-blue-gray-200 peer-focus:before:!border-gray-400 after:border-blue-gray-200 peer-focus:after:!border-gray-400">
                  MAC-ADDRESS
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center mb-8">
            <span
              className="absolute px-4 text-white"
              style={{ backgroundColor: "#37465c" }}
            >
              or
            </span>
            <div className="w-full bg-gray-200 mt-3 h-px"></div>
          </div>
          <div className="flex justify-center">
            <QrCodeScanner
              onScanSuccess={handleScanSuccess}
              onScanFailure={handleScanFailure}
            />
          </div>
          <div className="flex justify-center mt-5">
            <button
              type="button"
              className=" bg-gray-500 hover:bg-slate-400 py-2 px-4 rounded-md"
            >
              Add
            </button>
          </div>
        </Box>
      </Modal>
      {/* Modal Edit Device */}
      <Modal
        open={isEditing}
        onClose={handleEdit}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h1 className="text-white text-center text-2xl">Edit Infomation</h1>
          <div className="flex justify-center text-black my-3">
            <div className="w-full max-w-[300px]">
              <div className="relative w-full h-10">
                <input
                  className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-white border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-400"
                  placeholder=" "
                />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-200 before:border-blue-gray-200 peer-focus:before:!border-gray-400 after:border-blue-gray-200 peer-focus:after:!border-gray-400">
                  Device Name
                </label>
              </div>
              <div className="flex flex-row justify-center my-3">
                <div className="w-full bg-gray-50 opacity-70 h-px"></div>
              </div>
              <div className="relative w-full h-10 flex justify-center">
                <FormControl sx={{ m: 1, minWidth: 80 }}>
                  <InputLabel
                    id="category-label"
                    sx={{ color: "gray", "&.Mui-focused": { color: "white" } }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={editData.category}
                    onChange={handleChange}
                    autoWidth
                    label="Category"
                    sx={{
                      color: "white", // Font color
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "gray", // Default border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color on hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color when focused
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white", // Color of the dropdown arrow
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: "gray", // Background color for dropdown menu
                          "& .MuiMenuItem-root": {
                            color: "white", // Font color for menu items
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={21}>Twenty one</MenuItem>
                    <MenuItem value={22}>Twenty one and a half</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="button"
              className=" bg-gray-500 hover:bg-slate-400 py-2 px-4 rounded-md"
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>
      {/* Btn to open Modal */}
      <div className=" absolute bottom-5 right-5">
        <button
          className="bg-gray-400 rounded-full p-2 shadow-sm"
          onClick={handleOpenModal}
        >
          <AddIcon />
        </button>
      </div>
    </>
  );
}
