"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import DataTable from "@/components/dataTable";
import QrCodeScanner from "@/components/qrScanner";
import { GridActionsCellItem } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button, Modal, Box } from "@mui/material";
import QRCode from "qrcode";
import QrCodeGenerator from "@/components/QrCodeGenarate";

//Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import QrCode2Icon from "@mui/icons-material/QrCode2";

export default function Devices() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState({});
  const [qrcode, setQrcode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [rows, setRows] = useState([]);
  const [editData, setEData] = useState({
    id: "",
    mac_address: "",
  });
  const [qrCodeGenerateOpen, setQrCodeGenerateOpen] = useState(false);
  const handleQrCodeGenerateOpen = () => setQrCodeGenerateOpen(true);
  const handleQrCodeGenerateClose = () => setQrCodeGenerateOpen(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const fetchDevices = async () => {
    const id = session.user.id;
    try {
      const res = await fetch(
        `https://api.bd2-cloud.net/api/device/backend/get-device`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      console.log(json);
      if (res.ok && json.status !== 404) {
        setData(json);
        formatData(json);
      } else if (json.status == 404) {
        //console.log("No devices found");
        setRows([]);
        setData({});
      } else {
        console.error("Failed to fetch device.");
        throw new Error("Failed to fetch device.");
      }
    } catch (err) {
      console.error("Error: Failed to fetch device.");
    }
  };

  const formatData = (d) => {
    const result = Object.values(d).map((item, index) => ({
      id: item.device_id,
      mac_address: item.mac_address,
      datetime: item.create_ts,
      qr: item.qrUrl,
    }));
    setRows(result);
  };

  useEffect(() => {
    if (session && session.user) {
      fetchDevices();
    }
    const interval = setInterval(() => {
      fetchDevices();
    }, 60000);
    return () => clearInterval(interval);
  }, [session]);

  // Check status session
  if (status === "loading") {
    return null; // Loading indicator
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  } else if (session?.user?.role == "U") {
    router.replace("/dashboard");
  }

  const handleEdit = async (id) => {
    console.log(`Edit device with id: ${id}`);
    data.map((item) => {
      if (item.device_id === id) {
        setEData({
          id: item.device_id,
          mac_address: item.mac_address,
        });
      }
    });
    console.log("Edit data", editData);
    setIsEditing(!isEditing);
  };

  const handleUpdate = async () => {
    setQrCodeUrl("");
    const url = await QRCode.toDataURL(editData.mac_address, {
      width: 300,
      margin: 2,
    });
    setQrCodeUrl(url);
    const res = await fetch(`https://api.bd2-cloud.net/api/device/updateMAC`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceid: editData.id,
        mac_address: editData.mac_address,
        qrUrl: url,
      }),
    });
    const json = await res.json();
    if (res.ok && json.status !== 404) {
      console.log("Device updated successfully");
      fetchDevices();
    } else {
      console.error("Failed to update device.");
      setQrCodeUrl("");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Did you want to delete this device?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(
          `https://api.bd2-cloud.net/api/device/backend/delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              deviceid: id,
            }),
          }
        );
        const json = await res.json();
        if (res.ok && json.status !== 404) {
          console.log("Device deleted successfully");
          fetchDevices();
          Swal.fire({
            title: "Deleted!",
            text: "Device has been deleted.",
            icon: "success",
            timer: 1000,
          });
        } else {
          console.error("Failed to delete device.");
          Swal.fire({
            title: "Deleted!",
            text: "Have any problem to delete device.",
            icon: "failed",
            timer: 1000,
          });
        }
      }
    });
    //console.log(`Delete device with id: ${id}`);
  };

  const handleView = (id) => {
    console.log(`View device with id: ${id}`);
    data.map((item) => {
      if (item.device_id === id) {
        setQrcode(item.qrUrl);
      }
    });
    setIsViewing(!isViewing);
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
      field: "mac_address",
      headerName: "MAC-ADDRESS",
      headerClassName: "super-app-theme--header",
      type: "string",
      flex: 1,
      editable: false,
      resizable: false,
    },
    {
      field: "datetime",
      headerName: "Create Date",
      headerClassName: "super-app-theme--header",
      type: "dateTime",
      valueGetter: (value) => value && new Date(value),
      flex: 1,
      editable: false,
      resizable: false,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      type: "actions",
      flex: 0.8,
      resizable: false,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<InfoIcon />}
          label="Info"
          onClick={() => {
            handleView(id);
          }}
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
      <div className=" absolute bottom-5 right-5">
        <Button
          variant="contained"
          onClick={handleQrCodeGenerateOpen}
          className="bg-gray-400 rounded-full p-2 shadow-sm"
        >
          <QrCode2Icon />
        </Button>
      </div>
      {/* Modal Info Device */}
      <Modal
        open={isViewing}
        onClose={handleView}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h1 className="text-white text-center text-2xl">QR Code</h1>
          <div className="flex justify-center text-black my-3">
            {qrcode != "" ? <img src={qrcode} /> : " "}
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
                  className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-white border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-400 focus:text-blue-50"
                  placeholder=" "
                  onChange={(e) =>
                    setEData({ ...editData, mac_address: e.target.value })
                  }
                />
                <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-200 before:border-blue-gray-200 peer-focus:before:!border-gray-400 after:border-blue-gray-200 peer-focus:after:!border-gray-400">
                  MAC-Address
                </label>
              </div>
              {qrCodeUrl != "" ? (
                <div className="flex flex-row justify-center my-3">
                  <img src={qrCodeUrl} />
                </div>
              ) : (
                " "
              )}
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="button"
              className=" bg-gray-500 hover:bg-slate-400 py-2 px-4 rounded-md"
              onClick={handleUpdate}
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>
      {/* Modal Add Device */}
      <Modal
        open={qrCodeGenerateOpen}
        onClose={handleQrCodeGenerateClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <QrCodeGenerator uid={session?.user?.id} />
          {/* Add your QR code generation logic here */}
        </Box>
      </Modal>
    </>
  );
}
