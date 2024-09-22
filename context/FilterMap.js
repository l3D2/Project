"use client";
import { createContext, useContext, useState } from "react";

const MarkerContext = createContext(null);

export const MarkerProvider = ({ children }) => {
  const [markers, setMarkers] = useState([]);

  return (
    <MarkerContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MarkerContext.Provider>
  );
};

export function useMarkers() {
  return useContext(MarkerContext);
}
