"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
//Component
import Navbar from "@/components/navbar";
import Content from "@/components/content";

//Mui
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function report() {
  const { data: session, status } = useSession();
  const [value, setValue] = useState("");
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

  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: "Pulp Fiction", year: 1994 },
  ];

  return (
    <>
      <Navbar session={session} />
      <Content>
        {"Report"}
        <div>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={top100Films}
            onChange={(e, newValue) => {
              setValue(newValue);
            }}
            value={value}
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
        </div>
      </Content>
    </>
  );
}
