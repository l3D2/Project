"use client";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useGoogleMap } from "@/context/GoogleMapProvider";
import { useMarkers } from "@/context/FilterMap";

export default function GoogleMapView(location) {
  const [activeMarker, setActiveMarker] = useState(null);
  const { markers, setMarkers } = useMarkers();
  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
  const containerStyle = {
    width: "100%",
    height: "80vh",
    borderRadius: "0.25rem",
  };

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

  const updateMarkersData = () => {
    markers.map(async (item, index) => {
      await fetchLastestData(item.id);
      fetchDeviceData(item.id);
    });
  };

  const fetchLastestData = async (id) => {
    if (id !== "N/A")
      try {
        const res = await fetch(
          `https://api.bd2-cloud.net/api/data/lastest/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const json = await res.json();
        if (res.ok && json.status !== 404) {
          const latestData = {
            datetime: json[0].datetime,
            ec: json[0].EC,
            ph: json[0].PH,
            temp: json[0].Temp,
            humidity: json[0].Humidity,
            tempW: json[0].Temp_Water,
          };

          // Update markers with the latest data as an object, not an array
          setMarkers((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, data: latestData } : item
            )
          );
        } else {
          const latestData = {
            datetime: "N/A",
            ec: 0,
            ph: 0,
            temp: 0,
            humidity: 0,
            tempW: 0,
          };
          // Update markers with the latest data as an object, not an array
          setMarkers((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, data: latestData } : item
            )
          );
          throw new Error("No data found");
        }
      } catch (err) {
        console.error("Error fetching data");
      }
  };

  const fetchDeviceData = async (id) => {
    if (id !== "N/A")
      try {
        const res = await fetch(`https://api.bd2-cloud.net/api/device/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();
        if (res.ok && json.status !== 404) {
          const deviceData = {
            status: json[0].status,
            battery: json[0].battery,
          };
          setMarkers((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, ddata: deviceData } : item
            )
          );
        } else {
          const deviceData = {
            status: 0,
            battery: 0,
          };
          setMarkers((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, ddata: deviceData } : item
            )
          );
          throw new Error("No data found");
        }
      } catch (err) {
        console.error("Error fetching device data");
      }
  };

  useEffect(() => {
    const needUpdate = markers.some((item) => !item.data);
    if (needUpdate) {
      updateMarkersData();
    }
    const interval = setInterval(() => {
      updateMarkersData();
    }, 25000);
    return () => clearInterval(interval);
  }, [markers]); // Run only when the markers array changes
  const coords = {
    lat: location.location.lat,
    lng: location.location.lng,
  };
  return (
    <GoogleMap
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={containerStyle}
      center={coords}
      zoom={13}
      options={{
        mapId: "9ba910e137dad3c",
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {markers.map(({ id, name, location, data, ddata, blip }) =>
        blip !== false &&
        blip !== 0 &&
        (location != null || location != "null") ? (
          <Marker
            key={id}
            position={location}
            onClick={() => handleActiveMarker(id)}
          >
            {activeMarker === id ? (
              <InfoWindow
                position={location}
                onCloseClick={() => setActiveMarker(null)}
              >
                <div className="rounded shadow-sm px-3">
                  <div className="flex flex-col justify-center items-center space-y-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 text-white">
                      D
                    </div>
                    <div className="text-center">
                      <div className="text-gray-900 font-bold">{name}</div>
                      <div className="font-bold text-gray-700">
                        status:
                        {ddata && ddata.status !== 1 ? "Offline" : "Online"} |
                        Battery:{" "}
                        {ddata && ddata.battery != null
                          ? ddata.battery.toFixed(2)
                          : 0}
                        %
                      </div>
                      <div className="text-1xl font-bold text-gray-700">
                        Lat: {location.lat.toFixed(2)} | Lng:{" "}
                        {location.lng.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-black flex flex-col text-left">
                      <div>
                        Humidity:{" "}
                        {(data && data.humidity != null) ||
                        (data && data.humidity != undefined)
                          ? data.humidity.toFixed(2) + " %"
                          : 0}
                      </div>
                      <div>
                        Air Temp:{" "}
                        {(data && data.temp != null) ||
                        (data && data.temp != undefined)
                          ? data.temp.toFixed(2) + " °C"
                          : 0}
                      </div>
                      <div>
                        Water Temp:{" "}
                        {(data && data.tempW != null) ||
                        (data && data.tempW != undefined)
                          ? data.tempW.toFixed(2) + " °C"
                          : 0}
                      </div>
                      <div>
                        EC:{" "}
                        {(data && data.ec != null) ||
                        (data && data.ec != undefined)
                          ? data.ec.toFixed(2) + " µS/cm"
                          : 0}
                      </div>
                      <div>
                        PH:{" "}
                        {(data && data.ph != null) ||
                        (data && data.ph != undefined)
                          ? data.ph.toFixed(2) + " pH"
                          : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        ) : null
      )}
    </GoogleMap>
  );
}
