"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { UserLocationContext } from "@/context/context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import CardStat from "@/components/cardStatus";
import Divider from "@mui/material/Divider";
import CardReport from "@/components/cardReport";
import GoogleMapView from "@/components/map";
import { GoogleMapProvider } from "@/context/GoogleMapProvider";
import DataTable from "@/components/dataTable";
import { useMarkers } from "@/context/FilterMap";
import { UserChart } from "@/components/UserChart.js";

// MUI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

// Icons
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import WaterIcon from "@mui/icons-material/Water";
import BoltIcon from "@mui/icons-material/Bolt";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import DevicesIcon from "@mui/icons-material/Devices";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import TerrainIcon from "@mui/icons-material/Terrain";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function Device() {
  const { data: session, status } = useSession();
  const { location } = useContext(UserLocationContext);
  const searchParams = useSearchParams();
  const [value, setValue] = useState(1);
  const { markers, setMarkers } = useMarkers();
  const [deviceID, setDeviceID] = useState(null);
  const [deviceData, setDeviceData] = useState([]);

  const [interval, setInterval] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [mData, setData] = useState({
    H: 0, //Humidity
    A: 0, //Air
    EC: 0, //Electrical Conductivity
    PH: 0, //PH
    W: 0, //Water Heating
    date: "N/A",
  });

  const [rData, setRData] = useState([]);

  const columns = [
    {
      field: "datetime",
      headerName: "Date Time",
      headerClassName: "super-app-theme--header",
      type: "dateTime",
      valueGetter: (value) => value && new Date(value),
      flex: 1,
      editable: false,
      resizable: false,
    },
    {
      field: "ec",
      headerName: "EC",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
    {
      field: "ph",
      headerName: "PH",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
    {
      field: "t",
      headerName: "Temperature",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
    {
      field: "h",
      headerName: "Humidity",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
    {
      field: "ta",
      headerName: "Temperature Air",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
  ];

  const options_interval = [10, 30, 60, 120];

  const fetchDevice = async () => {
    const res = await fetch(
      `https://api.bd2-cloud.net/api/device/${deviceID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await res.json();
    console.log("Device", json);
    if (res.ok) {
      const result = Object.values(json).map((item, index) => {
        return {
          id: item.device_id,
          name: item.device_name,
          land: item.cat_id,
          land_name: item.cat_name,
          location: JSON.parse(item.location),
          status: item.status,
          battery: item.battery,
          blip: 1,
        };
      });
      setDeviceData(result);
      setMarkers(result);
    } else {
      console.error("Failed to fetch device.");
    }
  };
  console.log("Device Data", deviceData);
  const fetchData = async () => {
    const res = await fetch(`https://api.bd2-cloud.net/api/data/${deviceID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (res.ok) {
      const result = Object.values(json).map((item, index) => ({
        id: index,
        datetime: item.datetime,
        h: item.Humidity, //Humidity
        ta: item.Temp, //Air
        ec: item.EC, //Electrical Conductivity
        ph: item.PH, //PH
        t: item.Temp_Water, //Water Heating
      }));
      setRData(result);
    } else {
      console.error("Failed to fetch device.");
    }
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

    if (json.length > 0) {
      const date = new Date(json[0].datetime).toLocaleString();
      setData({
        H: json[0].Humidity,
        A: json[0].Temp,
        EC: json[0].EC,
        PH: json[0].PH,
        W: json[0].Temp_Water,
        date: date,
      });
    }
  };

  useEffect(() => {
    if (session && session.user) {
      const id = searchParams.get("id");
      setDeviceID(id);
      if (deviceID) {
        fetchDevice();
        fetchData();
        fetchLastestData(deviceID);
      }
    }
  }, [session, deviceID]);

  // Check status session
  if (status === "loading") {
    return null; // Loading indicator
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  }

  if (!deviceID) return <div>Oops have something went wrong.</div>;
  else
    return (
      <>
        <Navbar session={session} />
        <Content>
          {"Device"}
          <div>
            <div className="grid grid-cols-4 gap-x-2">
              <CardStat>
                <DevicesIcon />
                {"Name"}
                {deviceData.length > 0 &&
                deviceData[0].name != null &&
                deviceData[0].name != undefined
                  ? deviceData[0].name
                  : "N/A"}
              </CardStat>
              <CardStat>
                <TerrainIcon />
                {"Lands"}
                {deviceData.length > 0 &&
                deviceData[0].land_name != null &&
                deviceData[0].land_name != undefined
                  ? deviceData[0].land_name
                  : "N/A"}
              </CardStat>
              <CardStat>
                <DevicesIcon />
                {"Status"}
                {deviceData.length > 0 &&
                deviceData[0].status != null &&
                deviceData[0].status != undefined
                  ? deviceData[0].status == 0
                    ? "Offline"
                    : "Online"
                  : "N/A"}
              </CardStat>
              <CardStat>
                <BatteryChargingFullIcon />
                {"Battery"}
                {deviceData.length > 0 &&
                deviceData[0].battery != null &&
                deviceData[0].battery != undefined
                  ? deviceData[0].battery + " %"
                  : "N/A"}
              </CardStat>
            </div>
            <div className="my-2">
              <Divider className="bg-gray-600" style={{ height: "2px" }} />
            </div>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  className="bg-white text-black rounded mb-1"
                >
                  <Tab value={1} label="Map" />
                  <Tab value={2} label="Data" />
                  <Tab value={3} label="Graph" />
                  <Tab value={4} label="Config" />
                </Tabs>
              </Box>
              {value == 1 ? (
                <GoogleMapProvider>
                  <GoogleMapView location={location} />
                </GoogleMapProvider>
              ) : value == 2 ? (
                <DataTable columns={columns} rows={rData} />
              ) : value == 3 ? (
                <UserChart deviceID={deviceID} session={session} />
              ) : value == 4 ? (
                <div className="bg-white w-full p-3">
                  <div className="flex flex-row justify-start mb-8">
                    <span className="absolute bg-white ml-20 px-4 text-gray-600">
                      Settings
                    </span>
                    <div className="w-full bg-gray-400 mt-3 h-px"></div>
                  </div>
                  <Autocomplete
                    disablePortal
                    id="interval"
                    name="interval"
                    options={options_interval}
                    noOptionsText="No Options"
                    onChange={(e, newValue) => {
                      console.log(newValue);
                    }}
                    value={value.topic}
                    sx={{
                      width: 300,
                      "& .MuiInputBase-root": {
                        color: "black", // Font color for the input text
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "gray", // Default border color
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black", // Border color on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black", // Border color when focused
                        },
                        "& .MuiSvgIcon-root": {
                          color: "black", // Color of the dropdown arrow
                        },
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Interval"
                        InputLabelProps={{
                          style: { color: "black" }, // Label color
                        }}
                      />
                    )}
                  />
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="bg-gray-500 rounded p-3 mt-5 hover:bg-green-400 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : null}
            </Box>
          </div>
          <div className="grid w-full gap-2">
            <CardReport>
              <ThermostatIcon />
              {"Temperature"}
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center">
                  <WaterIcon className="sm:max-xl:text-sm" />
                  {mData.W == null || mData.W == undefined
                    ? "N/A"
                    : `${mData.W} °C`}
                </span>
                <span className="inline-flex items-center">
                  <AirIcon className="sm:max-xl:text-sm" />
                  {mData.A == null || mData.A == undefined
                    ? "N/A"
                    : `${mData.A} °C`}
                </span>
              </div>
            </CardReport>
            <CardReport>
              <BoltIcon />
              {"Electrical Conductivity"}
              <span className="inline-flex items-center">
                {mData.EC == null || mData.EC == undefined
                  ? "N/A"
                  : `${mData.EC} µS/cm`}
              </span>
            </CardReport>
            <CardReport>
              <WaterDropIcon />
              {"Potential of Hydrogen"}
              <div className="flex items-center">
                <div className=" h-5 w-20 rounded bg-green-300"></div>
                <span className="ml-2">
                  {mData.PH == null || mData.PH == undefined
                    ? "N/A"
                    : `${mData.PH}`}
                </span>
              </div>
            </CardReport>
            <CardReport>
              <AirIcon />
              {"Humidity"}
              <span className="inline-flex items-center">
                {mData.H == null || mData.H == undefined
                  ? "N/A"
                  : `${mData.H} %`}
              </span>
            </CardReport>
            <div className="text-center">
              <p>Measuring on</p>
              <span>{mData.date}</span>
            </div>
          </div>
        </Content>
        <button className="fixed bottom-5 right-5 border border-white rounded-[100%] p-3 bg-slate-500">
          <PlayArrowIcon />
        </button>
      </>
    );
}
