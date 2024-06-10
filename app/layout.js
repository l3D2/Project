"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import React, { useState, useEffect } from "react";

const metadata = {
  title: "Water Application",
};

export default function RootLayout({ children }) {
  // Variables
  const [userLocation, setUserLocation] = useState([]); // Save user location

  useEffect(() => {
    getUserLocation();
  }, []);

  //Function
  // Get user location
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos);
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
