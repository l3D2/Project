"use client";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";

export default function GoogleMapView() {
  const containerStyle = {
    width: "100%",
    height: "80vh",
    borderRadius: "0.25rem",
  };
  const coordinates = { lat: 51.5074, lng: 0.1278 };
  const loading = (
    <Skeleton
      sx={{ bgcolor: "grey.800" }}
      variant="rectangular"
      height="80vh"
      width="100%"
      className="rounded"
    />
  );
  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
        loadingElement={loading}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={coordinates}
          zoom={13}
        />
      </LoadScript>
    </div>
  );
}
