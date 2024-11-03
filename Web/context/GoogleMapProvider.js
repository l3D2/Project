"use client";
import { createContext, useContext } from "react";
import { LoadScript } from "@react-google-maps/api";
import Skeleton from "@mui/material/Skeleton";

const GoogleMapContext = createContext(null);

export function GoogleMapProvider({ children }) {
  const libraries = ["places"];
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
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
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      //loadingElement={loading}
      loadingElement={<div style={{ display: "none" }} />}
    >
      <GoogleMapContext.Provider value={true}>
        {children}
      </GoogleMapContext.Provider>
    </LoadScript>
  );
}

export function useGoogleMap() {
  return useContext(GoogleMapContext);
}
