"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { UserLocationContext } from "@/context/context";
import Navbar from "@/components/navbar";
import Content from "@/components/content";
import CardStat from "@/components/cardStatus";
import Divider from "@mui/material/Divider";
import CardReport from "@/components/cardReport";
import GoogleMapView from "@/components/map";
import DataTable from "@/components/dataTable";
import { useMarkers } from "@/context/FilterMap";
import UserChart from "@/components/UserChart.js";
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import Swal from "sweetalert2";
// MUI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import { styled } from "@mui/material/styles";

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
import NotificationsIcon from "@mui/icons-material/Notifications";

const Input = styled(MuiInput)`
  width: 65px;
`;

export default function Device() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { location } = useContext(UserLocationContext);
  const searchParams = useSearchParams();
  const [value, setValue] = useState(1);
  const { markers, setMarkers } = useMarkers();
  const [deviceID, setDeviceID] = useState(null);
  const [deviceData, setDeviceData] = useState([
    {
      id: "N/A",
      name: "N/A",
      macaddress: "N/A",
      land: "N/A",
      land_name: "N/A",
      location: "N/A",
      status: "N/A",
      battery: "N/A",
      interval: 10,
      blip: 0,
    },
  ]);
  const [intervals, setIntervals] = useState(0);
  const [mData, setData] = useState({
    H: 0, //Humidity
    A: 0, //Air
    EC: 0, //Electrical Conductivity
    PH: 0, //PH
    W: 0, //Water Heating
    date: "N/A",
  });

  const [rData, setRData] = useState([
    {
      id: 0,
      datetime: "N/A",
      h: 0, //Humidity
      ta: 0, //Air
      ec: 0, //Electrical Conductivity
      ph: 0, //PH
      t: 0, //Water Heating
    },
  ]);

  const [valuePH, setValuePH] = useState({
    state: 0,
    min: 0,
    max: 0,
    value: [0, 7],
  });
  const [valueEC, setValueEC] = useState({
    state: 0,
    min: 0,
    max: 0,
  });
  const [valueTemp, setValueTemp] = useState({
    state: 0,
    min: 0,
    max: 0,
  });
  const [valueTempW, setValueTempW] = useState({
    state: 0,
    min: 0,
    max: 0,
  });
  const [valueH, setValueH] = useState({
    state: 0,
    min: 0,
    max: 0,
  });
  const [time, setTime] = useState({
    H: 0,
    M: 0,
    S: 0,
  });

  const fetchNoti = async () => {
    const id = deviceID;
    try {
      const res = await fetch(
        `https://api.bd2-cloud.net/api/notification/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      console.log(json);
      if (res.ok && json.status !== 404) {
        setValueEC({
          min: json[0].ec_min,
          max: json[0].ec_max,
          state: json[0].notify_ec,
        });
        setValuePH({
          min: json[0].ph_min,
          max: json[0].ph_max,
          state: json[0].notify_ph,
        });
        setValueTemp({
          min: json[0].temp_min,
          max: json[0].temp_max,
          state: json[0].notify_temp,
        });
        setValueTempW({
          min: json[0].tempw_min,
          max: json[0].tempw_max,
          state: json[0].notify_tempw,
        });
        setValueH({
          min: json[0].humi_min,
          max: json[0].humi_max,
          state: json[0].notify_humi,
        });
      } else if (json.status == 404) {
        console.log("");
      } else {
        console.log("Failed to fetch setting notification");
        throw new Error("Failed to fetch setting notification");
      }
    } catch (err) {
      console.log("Error fetching data");
    }
  };

  const handleUpdate = async () => {
    const id = deviceID;
    const data = JSON.stringify({
      ec_min: valueEC.min,
      ec_max: valueEC.max,
      notify_ec: valueEC.state ? 1 : 0,
      ph_min: valuePH.min,
      ph_max: valuePH.max,
      notify_ph: valuePH.state ? 1 : 0,
      temp_min: valueTemp.min,
      temp_max: valueTemp.max,
      notify_temp: valueTemp.state ? 1 : 0,
      tempw_min: valueTempW.min,
      tempw_max: valueTempW.max,
      notify_tempw: valueTempW.state ? 1 : 0,
      humi_min: valueH.min,
      humi_max: valueH.max,
      notify_humi: valueH.state ? 1 : 0,
    });
    try {
      const res = await fetch(
        `https://api.bd2-cloud.net/api/notification/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      );
      const json = await res.json();
      if (res.ok && json.status !== 404) {
        console.log("Data updated successfully");
        Swal.fire({
          title: "Success!",
          text: "Notification has been updated.",
          icon: "success",
          timer: 1000,
        });
      } else if (json.status == 404) {
        console.log("");
      } else {
        console.log("Failed to update data");
        Swal.fire({
          title: "Failed!",
          text: "Notification has been update failed.",
          icon: "failed",
          timer: 1000,
        });
        throw new Error("Failed to update data");
      }
    } catch (err) {
      console.log("Error updating data");
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
      headerName: "EC(µS/cm)",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
    {
      field: "ph",
      headerName: "pH",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
    {
      field: "t",
      headerName: "Temperature Water(°C)",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
    {
      field: "h",
      headerName: "Humidity(%)",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
    {
      field: "ta",
      headerName: "Temperature Air(°C)",
      headerClassName: "super-app-theme--header",
      type: "float",
      flex: 0.75,
      editable: false,
      resizable: false,
    },
  ];

  const fetchDevice = async () => {
    try {
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
      if (res.ok && json.status !== 404) {
        const result = Object.values(json).map((item, index) => {
          return {
            id: item.device_id,
            name: item.device_name,
            macaddress: item.mac_address,
            land: item.cat_id,
            land_name: item.cat_name,
            location: JSON.parse(item.location),
            status: item.status,
            battery: item.battery,
            interval: item.interval,
            blip: 1,
          };
        });
        // Check if deviceData and result are different
        if (JSON.stringify(deviceData) !== JSON.stringify(result)) {
          setDeviceData(result);
          setMarkers(result);
        }
      } else if (json.status == 404) {
      } else {
        console.error("Failed to fetch device.");
        throw new Error("Failed to fetch device");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://api.bd2-cloud.net/api/data/${deviceID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      if (res.ok && json.status !== 404) {
        const result = Object.values(json).map((item, index) => ({
          id: index,
          datetime: item.datetime,
          h: item.Humidity.toFixed(2), //Humidity
          ta: item.Temp.toFixed(2), //Air
          ec: item.EC.toFixed(2), //Electrical Conductivity
          ph: item.PH.toFixed(2), //PH
          t: item.Temp_Water.toFixed(2), //Water Heating
        }));
        setRData(result);
      } else if (json.status == 404) {
        console.log("");
      } else {
        console.error("Failed to fetch device.");
        throw new Error("Failed to fetch device");
      }
    } catch (err) {
      console.log(err);
    }
    // console.log(rData);
  };

  const fetchLastestData = async () => {
    try {
      const res = await fetch(
        `https://api.bd2-cloud.net/api/data/lastest/${deviceID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();

      if (res.ok && json.status !== 404) {
        const date = new Date(json[0].datetime).toLocaleString();
        setData({
          H: json[0].Humidity,
          A: json[0].Temp,
          EC: json[0].EC,
          PH: json[0].PH,
          W: json[0].Temp_Water,
          date: date,
        });
        const d = new Date(json[0].datetime);
        // รับเวลาปัจจุบัน
        const currentDate = new Date();
        // คำนวณความแตกต่างระหว่างวันที่
        let diffInMilliseconds = currentDate - d;
        // แปลงความแตกต่างเป็นชั่วโมง นาที และวินาที
        let seconds = Math.floor(diffInMilliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        setTime({
          H: hours,
          M: minutes,
          S: seconds,
        });
      } else if (json.status == 404) {
        console.log("");
      } else {
        console.log("Fetch data failed");
        throw new Error("Fetch data failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleMeasure = async () => {
    const res = await fetch("https://mqtt.bd2-cloud.net/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: deviceData[0].macaddress,
        message: "measure",
        responseTopic: deviceData[0].macaddress,
      }),
    });
    const json = await res.json();
    if (res.ok && json.success == true) {
      Swal.fire({
        title: "Measure",
        text: "Send measure command to device.",
        icon: "success",
        timer: 1000,
      });
    } else {
      Swal.fire({
        title: "Measure",
        text: "Send measure command to device failed.",
        icon: "failed",
        timer: 1000,
      });
    }
  };

  const handleSetInterval = async () => {
    const msg = `cfg_interval_${intervals}`;
    console.log(msg);
    try {
      const resUpdate = await fetch(
        `https://api.bd2-cloud.net/api/device/updateInterval`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interval: intervals,
            id: deviceID,
          }),
        }
      );
      const json = await resUpdate.json();
      if (resUpdate.ok && json.status !== 404) {
        console.log("Data updated successfully");
        Swal.fire({
          title: "Success!",
          text: "Interval has been updated.",
          icon: "success",
          timer: 1000,
        });
        try {
          const res = await fetch("https://mqtt.bd2-cloud.net/publish", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic: deviceData[0].macaddress,
              message: msg,
              responseTopic: deviceData[0].macaddress,
            }),
          });
          const json = res.json();
          if (res.ok) {
            console.log(json);
          }
        } catch (err) {
          console.log("Error send MQTT");
        }
      } else if (json.status == 404) {
        console.log("");
      } else {
        console.log("Failed to update data");
        Swal.fire({
          title: "Failed!",
          text: "Interval has been update failed.",
          icon: "failed",
          timer: 1000,
        });
        throw new Error("Failed to update data");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleInterval = async (newValue) => {
    setIntervals(newValue);
  };

  const realTime = async () => {
    await fetchLastestData();
    await fetchData();
    await fetchDevice();
  };
  useEffect(() => {
    if (deviceID) {
      // เรียกข้อมูลทันทีเมื่อโหลดหน้า
      realTime();
    }
    // เรียกใช้ real-time ทุกๆ 5 วินาที
    const interval = setInterval(() => {
      realTime();
      // console.log("Updating real-time data");
    }, 10000); // ปรับเป็น 5 วินาที

    return () => clearInterval(interval); // เคลียร์ interval เมื่อคอมโพเนนต์ unmount
  }, [mData]);
  useEffect(() => {
    fetchDevice();
    fetchData();
    fetchLastestData();
    fetchNoti();
    if (deviceData[0].interval != null && deviceData[0].interval != undefined)
      setInterval(deviceData[0].interval);
  }, [deviceID]);
  useEffect(() => {
    if (session && session.user) {
      const id = searchParams.get("id");
      setDeviceID(id);
    }
  }, [session]); // Added necessary dependencies

  // Check status session
  if (status === "loading") {
    return null; // Loading indicator
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  } else if (session?.user?.role !== "U") {
    router.replace("/admin/dashboard");
  }
  var coords = {};
  if (deviceData[0].location == null || deviceData[0].location == undefined) {
    coords = {
      lat: location.lat,
      lng: location.lng,
    };
  } else {
    coords = {
      lat: deviceData[0].location.lat,
      lng: deviceData[0].location.lng,
    };
  }
  if (!deviceID) return <div>Oops have something went wrong.</div>;
  else
    return (
      <>
        <Navbar session={session} />
        <Content>
          {"Device"}
          <div>
            <div className="grid grid-cols-4 gap-2">
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
                  : "none"}
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
                  ? parseFloat(deviceData[0].battery).toFixed(2) > 100? 100 + " %" : parseFloat(deviceData[0].battery).toFixed(2) + " %"
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
                  <Tab value={5} label="Notification" />
                </Tabs>
              </Box>
              {value == 1 ? (
                <GoogleMapView location={coords} />
              ) : value == 2 ? (
                <div className="bg-gray-200">
                  <DataTable columns={columns} rows={rData} />
                </div>
              ) : value == 3 ? (
                <div className="bg-gray-200">
                  <UserChart deviceID={deviceID} rdata={rData} />
                </div>
              ) : value == 4 ? (
                <div className="bg-white w-full p-3">
                  <div className="flex flex-row justify-start mb-8">
                    <span className="absolute bg-white ml-20 px-4 text-gray-600">
                      Settings
                    </span>
                    <div className="w-full bg-gray-400 mt-3 h-px"></div>
                  </div>
                  <label
                    for="countries"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                  >
                    Current interval {deviceData[0].interval} minutes
                  </label>
                  <select
                    id="intervals"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={intervals}
                    onChange={(e) => handleInterval(e.target.value)} // Adjust according to your state handling
                  >
                    <option value="">Choose an interval</option>
                    <option value="10">10</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="120">120</option>
                  </select>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleSetInterval}
                      className="bg-gray-500 rounded p-3 mt-5 hover:bg-green-400 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : value == 5 ? (
                <div>
                  <div className="grid grid-cols-3 gap-2">
                    <Card>
                      <NotificationsIcon />
                      <div className="flex justify-between items-center">
                        <span>PH Notification</span>
                        <Switch
                          edge="end"
                          onChange={(e) => {
                            setValuePH((prev) => ({
                              ...prev,
                              state: !valuePH.state,
                            }));
                          }}
                          checked={valuePH.state}
                        />
                      </div>
                      <div className="w-5/6 text-gray-500">
                        <span>Min</span>
                        <div className="flex space-x-4">
                          <Slider
                            value={
                              typeof valuePH.min === "number" ? valuePH.min : 0
                            }
                            min={0}
                            max={valuePH.max - 1}
                            onChange={(e) => {
                              setValuePH((prev) => ({
                                ...prev,
                                min: parseInt(e.target.value),
                              }));
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valuePH.min}
                            size="small"
                            onChange={(e) => {
                              setValuePH((prev) => ({
                                ...prev,
                                min: parseInt(e.target.value),
                              }));
                            }}
                            inputProps={{
                              step: 5,
                              min: 0,
                              max: valuePH.max - 1,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>
                        <span>Max</span>
                        <div className="flex space-x-5">
                          <Slider
                            value={
                              typeof valuePH.max === "number" ? valuePH.max : 0
                            }
                            min={valuePH.min + 1}
                            max={14}
                            onChange={(e) => {
                              setValuePH((prev) => ({
                                ...prev,
                                max: parseInt(e.target.value),
                              }));
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valuePH.max}
                            size="small"
                            onChange={(e) => {
                              setValuePH((prev) => ({
                                ...prev,
                                max: parseInt(e.target.value),
                              }));
                            }}
                            inputProps={{
                              step: 10,
                              min: valuePH.min + 1,
                              max: 14,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                    <Card>
                      <NotificationsIcon />
                      <div className="flex justify-between items-center">
                        <span>EC Notification</span>
                        <Switch
                          edge="end"
                          onChange={(e) => {
                            setValueEC((prev) => ({
                              ...prev,
                              state: !valueEC.state,
                            }));
                          }}
                          checked={valueEC.state}
                        />
                      </div>
                      <div className="w-5/6 text-gray-500">
                        <span>Min</span>
                        <div className="flex space-x-4">
                          <Slider
                            value={
                              typeof valueEC.min === "number" ? valueEC.min : 0
                            }
                            min={1}
                            max={valueEC.max - 1}
                            onChange={(e, newValue) => {
                              if (newValue < valueEC.max) {
                                // Ensure min cannot exceed max
                                setValueEC((prev) => ({
                                  ...prev,
                                  min: newValue,
                                }));
                              }
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valueEC.min}
                            size="small"
                            onChange={(e) => {
                              const newMin = Math.min(
                                parseInt(e.target.value),
                                valueEC.max - 1
                              );
                              setValueEC((prev) => ({
                                ...prev,
                                min: newMin,
                              }));
                            }}
                            inputProps={{
                              step: 1,
                              min: 1,
                              max: valueEC.max - 1,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>

                        <span>Max</span>
                        <div className="flex space-x-5">
                          <Slider
                            value={
                              typeof valueEC.max === "number" ? valueEC.max : 0
                            }
                            min={valueEC.min + 1}
                            max={15}
                            onChange={(e, newValue) => {
                              if (newValue > valueEC.min) {
                                // Ensure max cannot go below min
                                setValueEC((prev) => ({
                                  ...prev,
                                  max: newValue,
                                }));
                              }
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valueEC.max}
                            size="small"
                            onChange={(e) => {
                              const newMax = Math.max(
                                parseInt(e.target.value),
                                valueEC.min + 1
                              );
                              setValueEC((prev) => ({
                                ...prev,
                                max: newMax,
                              }));
                            }}
                            inputProps={{
                              step: 1,
                              min: valueEC.min + 1,
                              max: 15,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                    <Card>
                      <NotificationsIcon />
                      <div className="flex justify-between items-center">
                        <span>Temp Notification</span>
                        <Switch
                          edge="end"
                          onChange={(e) => {
                            setValueTemp((prev) => ({
                              ...prev,
                              state: !valueTemp.state,
                            }));
                          }}
                          checked={valueTemp.state}
                        />
                      </div>
                      <div className="w-5/6 text-gray-500">
                        <span>Min</span>
                        <div className="flex space-x-4">
                          <Slider
                            min={0}
                            max={valueTemp.max - 1}
                            value={
                              typeof valueTemp.min === "number"
                                ? valueTemp.min
                                : 0
                            }
                            onChange={(e) => {
                              setValueTemp((prev) => ({
                                ...prev,
                                min: parseInt(e.target.value),
                              }));
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valueTemp.min}
                            size="small"
                            onChange={(e) => {
                              setValueTemp((prev) => ({
                                ...prev,
                                min: parseInt(e.target.value),
                              }));
                            }}
                            inputProps={{
                              step: 1,
                              min: 0,
                              max: valueTemp.max - 1,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>
                        <span>Max</span>
                        <div className="flex space-x-5">
                          <Slider
                            min={valueTemp.min + 1}
                            max={60}
                            value={
                              typeof valueTemp.max === "number"
                                ? valueTemp.max
                                : 0
                            }
                            onChange={(e) => {
                              setValueTemp((prev) => ({
                                ...prev,
                                max: parseInt(e.target.value),
                              }));
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valueTemp.max}
                            size="small"
                            onChange={(e) => {
                              setValueTemp((prev) => ({
                                ...prev,
                                max: parseInt(e.target.value),
                              }));
                            }}
                            inputProps={{
                              step: 1,
                              min: valueTemp.min + 1,
                              max: 60,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                    <Card>
                      <NotificationsIcon />
                      <div className="flex justify-between items-center">
                        <span>Temp Water Notification</span>
                        <Switch
                          edge="end"
                          onChange={(e) => {
                            setValueTempW((prev) => ({
                              ...prev,
                              state: !valueTempW.state,
                            }));
                          }}
                          checked={valueTempW.state}
                        />
                      </div>
                      <div className="w-5/6 text-gray-500">
                        <span>Min</span>
                        <div className="flex space-x-4">
                          <Slider
                            min={-40}
                            max={valueTempW.max - 1}
                            value={
                              typeof valueTempW.min === "number"
                                ? valueTempW.min
                                : 0
                            }
                            onChange={(e) => {
                              setValueTempW((prev) => ({
                                ...prev,
                                min: parseInt(e.target.value),
                              }));
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valueTempW.min}
                            size="small"
                            onChange={(e) => {
                              setValueTempW((prev) => ({
                                ...prev,
                                min: parseInt(e.target.value),
                              }));
                            }}
                            inputProps={{
                              step: 1,
                              min: -40,
                              max: valueTempW.max - 1,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>
                        <span>Max</span>
                        <div className="flex space-x-5">
                          <Slider
                            min={valueTempW.min + 1}
                            max={80}
                            value={
                              typeof valueTempW.max === "number"
                                ? valueTempW.max
                                : 0
                            }
                            onChange={(e) => {
                              setValueTempW((prev) => ({
                                ...prev,
                                max: parseInt(e.target.value),
                              }));
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valueTempW.max}
                            size="small"
                            onChange={(e) => {
                              setValueTempW((prev) => ({
                                ...prev,
                                max: parseInt(e.target.value),
                              }));
                            }}
                            inputProps={{
                              step: 10,
                              min: valueTempW.min + 1,
                              max: 80,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                    <Card>
                      <NotificationsIcon />
                      <div className="flex justify-between items-center">
                        <span>Humidity Notification</span>
                        <Switch
                          edge="end"
                          onChange={(e) => {
                            setValueH((prev) => ({
                              ...prev,
                              state: !valueH.state,
                            }));
                          }}
                          checked={valueH.state}
                        />
                      </div>
                      <div className="w-5/6 text-gray-500">
                        <span>Min</span>
                        <div className="flex space-x-4">
                          <Slider
                            min={0}
                            max={valueH.max - 1}
                            value={
                              typeof valueH.min === "number" ? valueH.min : 0
                            }
                            onChange={(e) => {
                              setValueH((prev) => ({
                                ...prev,
                                min: parseInt(e.target.value),
                              }));
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valueH.min}
                            size="small"
                            onChange={(e) => {
                              setValueH((prev) => ({
                                ...prev,
                                min: parseInt(e.target.value),
                              }));
                            }}
                            inputProps={{
                              step: 1,
                              min: 0,
                              max: valueH.max - 1,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>
                        <span>Max</span>
                        <div className="flex space-x-5">
                          <Slider
                            min={valueH.min + 1}
                            max={100}
                            value={
                              typeof valueH.max === "number" ? valueH.max : 0
                            }
                            onChange={(e) => {
                              setValueH((prev) => ({
                                ...prev,
                                max: parseInt(e.target.value),
                              }));
                            }}
                            aria-labelledby="input-slider"
                            valueLabelDisplay="auto"
                          />
                          <Input
                            value={valueH.max}
                            size="small"
                            onChange={(e) => {
                              setValueH((prev) => ({
                                ...prev,
                                max: parseInt(e.target.value),
                              }));
                            }}
                            inputProps={{
                              step: 1,
                              min: valueH.min + 1,
                              max: 100,
                              type: "number",
                              "aria-labelledby": "input-slider",
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="flex justify-center my-5">
                    <button
                      type="button"
                      className="bg-green-300 rounded-md p-2 hover:bg-green-400"
                      onClick={handleUpdate}
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
                    : `${mData.W.toFixed(2)} °C`}
                </span>
                <span className="inline-flex items-center">
                  <AirIcon className="sm:max-xl:text-sm" />
                  {mData.A == null || mData.A == undefined
                    ? "N/A"
                    : `${mData.A.toFixed(2)} °C`}
                </span>
              </div>
            </CardReport>
            <CardReport>
              <BoltIcon />
              {"EC"}
              <span className="inline-flex items-center">
                {mData.EC == null || mData.EC == undefined
                  ? "N/A"
                  : `${mData.EC.toFixed(2)} µS/cm`}
              </span>
            </CardReport>
            <CardReport>
              <WaterDropIcon />
              {"pH"}
              <div className="flex items-center">
                <div
                  className={`h-5 w-20 rounded ${
                    mData.PH < 2
                      ? "bg-red-600"
                      : mData.PH >= 2 && mData.PH < 3
                      ? "bg-red-500"
                      : mData.PH >= 3 && mData.PH < 4
                      ? "bg-red-400"
                      : mData.PH >= 4 && mData.PH < 5
                      ? "bg-orange-400"
                      : mData.PH >= 5 && mData.PH < 6
                      ? "bg-orange-300"
                      : mData.PH >= 6 && mData.PH < 7
                      ? "bg-yellow-300"
                      : mData.PH >= 7 && mData.PH < 8
                      ? "bg-lime-400"
                      : mData.PH >= 8 && mData.PH < 9
                      ? "bg-lime-600"
                      : mData.PH >= 9 && mData.PH < 10
                      ? "bg-cyan-400"
                      : mData.PH >= 10 && mData.PH < 11
                      ? "bg-cyan-600"
                      : mData.PH >= 11 && mData.PH < 12
                      ? "bg-blue-600"
                      : mData.PH >= 12 && mData.PH < 13
                      ? "bg-indigo-800"
                      : mData.PH >= 13 && mData.PH < 14
                      ? "bg-purple-600"
                      : mData.PH >= 14
                      ? "bg-pink-600"
                      : "bg-gray-400"
                  }`}
                ></div>
                <span className="ml-2">
                  {mData.PH == null || mData.PH == undefined
                    ? "N/A"
                    : `${mData.PH.toFixed(2)}`}
                </span>
              </div>
            </CardReport>
            <CardReport>
              <AirIcon />
              {"Humidity"}
              <span className="inline-flex items-center">
                {mData.H == null || mData.H == undefined
                  ? "N/A"
                  : `${mData.H.toFixed(2)} %`}
              </span>
            </CardReport>
            <CardReport>
              <WaterIcon />
              {"Salinity"}
              <span className="inline-flex items-center">
                {mData.EC == null || mData.EC == undefined
                  ? "N/A"
                  : `${(mData.EC * 0.008).toFixed(2)} PSU`}
              </span>
            </CardReport>
            <div className="text-center text-gray-200">
              <p>Updated on {mData.date}</p>
              <p className="text-gray-100">
                {time.H > 0
                  ? `${time.H} hour${time.H !== 1 ? "s" : ""} ago`
                  : time.M > 0
                  ? `${time.M} minute${time.M !== 1 ? "s" : ""} ago`
                  : `${time.S} second${time.S !== 1 ? "s" : ""} ago`}
              </p>
            </div>
          </div>
        </Content>
        <button
          className="fixed bottom-5 right-5 border border-white rounded-[100%] p-3 bg-slate-500"
          onClick={handleMeasure}
        >
          <PlayArrowIcon />
        </button>
      </>
    );
}
