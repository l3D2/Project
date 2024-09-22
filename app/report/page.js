"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
//Component
import Navbar from "@/components/navbar";
import Content from "@/components/content";

//Mui
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function report() {
  const { data: session, status } = useSession();
  const [value, setValue] = useState({
    id: null,
    name: null,
    topic: null,
    details: null,
  });
  const [device, setDevice] = useState([]);
  const router = useRouter();

  const options_topic = [
    { label: "Technical", value: 1 },
    { label: "Bugs", value: 2 },
    { label: "Services", value: 3 },
  ];

  useEffect(() => {
    if (session && session.user) {
      // Fetch data from API
      fetchDevice();
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

  const handleSaveReport = (e) => {
    console.log(e.target.value);
  };

  const fetchDevice = async () => {
    const id = session.user.id;
    const res = await fetch(`https://api.bd2-cloud.net/api/device/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    console.log(json);
    if (res.ok) {
      console.log("Fetched devices:", json);
      const result = Object.values(json).map((item, index) => ({
        label: item.device_name,
        uuid: item.device_id,
      }));
      setDevice(result);
      console.log("Formatted data:", device);
    } else {
      console.error("Failed to fetch device.");
    }
  };

  const submitReport = async () => {
    const res = await fetch("", {
      method: "POST",
      headers: {},
    });
  };

  return (
    <>
      <Navbar session={session} />
      <Content>
        {"Report"}
        <div className="flex justify-center">
          <div className="flex flex-col gap-3">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              name="id"
              options={device}
              noOptionsText="No Device"
              onChange={(e, newValue) => {
                setValue((prevState) => ({
                  ...prevState,
                  ["id"]: newValue.uuid,
                  ["name"]: newValue.label,
                }));
              }}
              value={value.name}
              sx={{
                width: 300,
                "& .MuiInputBase-root": {
                  color: "white", // Font color for the input text
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
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Device"
                  InputLabelProps={{
                    style: { color: "white" }, // Label color
                  }}
                />
              )}
            />
            <Autocomplete
              disablePortal
              id="topic"
              name="topic"
              options={options_topic}
              noOptionsText="No Topics"
              onChange={(e, newValue) => {
                setValue((prevState) => ({
                  ...prevState,
                  ["topic"]: newValue,
                }));
              }}
              value={value.topic}
              sx={{
                width: 300,
                "& .MuiInputBase-root": {
                  color: "white", // Font color for the input text
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
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Topic"
                  InputLabelProps={{
                    style: { color: "white" }, // Label color
                  }}
                />
              )}
            />
            <TextField
              id="outlined-multiline-static"
              label="Details"
              multiline
              rows={4}
              defaultValue=""
              onChange={(e, newValue) => {
                setValue((prevState) => ({
                  ...prevState,
                  ["report"]: newValue,
                }));
              }}
              value={value.report}
              sx={{
                width: 300,
                "& .MuiInputBase-root": {
                  color: "white", // Font color for the input text
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "gray", // Default border color
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", // Border color on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", // Border color when focused
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "white", // Label color
                  "&.Mui-focused": {
                    color: "white", // Label color when focused
                  },
                },
              }}
            />
            <button onClick={submitReport}>Send</button>
          </div>
        </div>
      </Content>
    </>
  );
}
