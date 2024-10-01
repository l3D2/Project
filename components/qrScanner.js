//Ver 3
import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

const QrCodeScanner = ({ onScanSuccess, onScanFailure }) => {
  const scannerRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Initialize the scanner
    const html5QrcodeScanner = new Html5QrcodeScanner(scannerRef.current.id, {
      fps: 10, // Frames per second
      qrbox: { width: 250, height: 250 }, // QR code scanning box
    });

    // Start the scanner
    if (isScanning) html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    // Clean up on unmount
    return () => {
      html5QrcodeScanner.clear();
    };
  }, [isScanning, onScanSuccess, onScanFailure]);

  const handleStartScanning = () => {
    if (!isScanning) setIsScanning(true);
  };

  const handleStopScanning = () => {
    if (isScanning) setIsScanning(false);
  };

  return (
    <div>
      <div
        id="qr-reader"
        ref={scannerRef}
        style={{
          width: "300px",
          display: isScanning ? "block" : "none",
        }}
      />
      <div className="flex justify-center mt-2">
        <button
          className={`${
            isScanning ? "bg-red-500" : "bg-green-500"
          } p-3 rounded-full flex items-center justify-center`}
          onClick={isScanning ? handleStopScanning : handleStartScanning}
        >
          <QrCodeScannerIcon className="text-white text-5xl mr-2" />
          <span className="text-white text-xl">
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default QrCodeScanner;
