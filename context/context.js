import { createContext, useState, useEffect } from "react";

//UserLocationContext
export const UserLocationContext = createContext(null);

export const UserLocationProvider = ({ children }) => {
  // State to hold the location data
  const [location, setUserLocation] = useState([]); // Save user location

  useEffect(() => {
    getUserLocation();
  }, []);
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  };

  return (
    <UserLocationContext.Provider value={{ location }}>
      {children}
    </UserLocationContext.Provider>
  );
};
