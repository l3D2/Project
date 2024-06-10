"use client";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import React from "react";

export default function GoogleMapView() {
  const containerStyle = {
    width: "100%",
    height: "80vh",
  };
  const coordinates = { lat: 51.5074, lng: 0.1278 };
  return (
    <div>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={coordinates}
          zoom={13}
        />
      </LoadScript>
    </div>
  );
}
