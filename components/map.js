"use client";
import { GoogleMap } from "@react-google-maps/api";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { useGoogleMap } from "@/context/GoogleMapProvider";

export default function GoogleMapView() {
  const containerStyle = {
    width: "100%",
    height: "80vh",
    borderRadius: "0.25rem",
  };
  const coordinates = { lat: 51.5074, lng: 0.1278 };
  const isLoaded = useGoogleMap();

  if (!isLoaded) {
    return (
      <Skeleton
        sx={{ bgcolor: "grey.800" }}
        variant="rectangular"
        height="80vh"
        width="100%"
        className="rounded"
      />
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={coordinates}
      zoom={13}
    />
  );
}
