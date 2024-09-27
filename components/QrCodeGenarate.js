"use client";

import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import { TextField, Button, Container, Box, Typography } from "@mui/material";

const QrCodeGenerator = () => {
    const [macAddress, setMacAddress] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const downloadLinkRef = useRef(null);

    const generateQrCode = async () => {
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
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: "center", mt: 5 }}>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={generateQrCode}
                >
                    Generate QR Code
                </Button>
                {qrCodeUrl && (
                    <Box sx={{ mt: 2 }}>
                        <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            style={{ width: "100%" }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            href={qrCodeUrl}
                            download="mac_address_qr.png"
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
