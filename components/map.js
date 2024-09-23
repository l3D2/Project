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
    markers.map((item, index) => {
      fetchLastestData(item.id);
    });
  };

  const fetchLastestData = async (id) => {
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
    //console.log("Lastest data", json);

    // Assuming you want to store only the latest data as an object, not an array
    if (json.length > 0) {
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
    }
  };

  useEffect(() => {
    const needUpdate = markers.some((item) => !item.data);
    if (needUpdate) {
      updateMarkersData();
    }
  }, [markers]); // Run only when the markers array changes

  return (
    <GoogleMap
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={containerStyle}
      center={location.location}
      zoom={13}
      options={{
        mapId: "9ba910e137dad3c",
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {markers.map(({ id, name, location, data, blip }) =>
        blip !== false && blip !== 0 ? (
          <Marker
            key={id}
            position={location}
            onClick={() => handleActiveMarker(id)}
          >
            {activeMarker === id ? (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className="rounded shadow-sm px-3">
                  <div className="flex flex-col justify-center items-center space-y-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 text-white">
                      D
                    </div>
                    <div className="text-center">
                      <div className="text-gray-900 font-bold">{name}</div>
                      <div className="text-1xl font-bold text-gray-700">
                        Lat: {location.lat.toFixed(4)} | Lng:{" "}
                        {location.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-black flex flex-col text-left">
                      <div>
                        Humidity:{" "}
                        {data.humidity == null ||
                        data.humidity == undefined ||
                        data == undefined
                          ? "N/A"
                          : data.humidity}
                      </div>
                      <div>
                        Air:{" "}
                        {data.temp == null ||
                        data.temp == undefined ||
                        data == undefined
                          ? "N/A"
                          : data.temp}
                      </div>
                      <div>
                        Water:{" "}
                        {data.tempW == null ||
                        data.tempW == undefined ||
                        data == undefined
                          ? "N/A"
                          : data.tempW}
                      </div>
                      <div>
                        EC:{" "}
                        {data.ec == null ||
                        data.ec == undefined ||
                        data == undefined
                          ? "N/A"
                          : data.ec}
                      </div>
                      <div>
                        PH:{" "}
                        {data.ph == null ||
                        data.ph == undefined ||
                        data == undefined
                          ? "N/A"
                          : data.ph}
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
