"use client";

import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import dayjs from "dayjs";

const QrCodeGenerator = (uid) => {
  const [macAddress, setMacAddress] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const downloadLinkRef = useRef(null);
  const generateQrCode = async () => {
    try {
      const res = await fetch("https://api.bd2-cloud.net/api/device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          macAddress: macAddress,
          userid: uid.uid,
        }),
      });
      if (res.ok) {
        console.log("Device created successfully");
        try {
          const url = await QRCode.toDataURL(macAddress, {
            width: 300,
            margin: 2,
          });
          setQrCodeUrl(url);
          // Trigger download automatically
          if (downloadLinkRef.current) {
            downloadLinkRef.current.click();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log("Error to create device");
        throw new Error("Error creating device");
      }
    } catch (err) {
      console.log("Error to create device");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 1, color: "black" }}>
        <Typography variant="h6" gutterBottom>
          QR Code Generator
        </Typography>
        <TextField
          fullWidth
          label="Enter MAC Address"
          variant="outlined"
          value={macAddress}
          onChange={(e) => setMacAddress(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={generateQrCode}>
          Generate QR Code
        </Button>
        {qrCodeUrl && (
          <Box sx={{ mt: 2 }}>
            <img src={qrCodeUrl} alt="QR Code" style={{ width: "100%" }} />
            <Button
              variant="contained"
              color="secondary"
              href={qrCodeUrl}
              download={dayjs().format("DD_MM_YYYY_HH-mm-ss") + "_qr.png"}
              sx={{ mt: 2 }}
            >
              Download QR Code
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default QrCodeGenerator;
