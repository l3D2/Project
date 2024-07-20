"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import CardStat from "@/components/cardStatus";
import Divider from "@mui/material/Divider";
import CardReport from "@/components/cardReport";
import GoogleMapView from "@/components/map";
import { GoogleMapProvider } from "@/context/GoogleMapProvider";

// MUI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

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

export default function Devices() {
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { data: session } = useSession();

  return (
    <>
      <div className="relative">
        <Navbar session={session} />
        <Content>
          <div>
            <div className="grid grid-cols-4 gap-x-2">
              <CardStat>
                <DevicesIcon />
                {"Device Name"}
                {"Test01"}
              </CardStat>
              <CardStat>
                <TerrainIcon />
                {"Lands"}
                {"none"}
              </CardStat>
              <CardStat>
                <DevicesIcon />
                {"Status"}
                {"Online"}
              </CardStat>
              <CardStat>
                <BatteryChargingFullIcon />
                {"Battery"}
                {"100 %"}
              </CardStat>
            </div>
            <Divider className="my-1 bg-gray-600" style={{ height: "1.5px" }} />
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  className="bg-white text-black rounded mb-1"
                >
                  <Tab value={1} label="Map" />
                  <Tab value={2} label="Data" />
                  <Tab value={3} label="Graph" />
                </Tabs>
              </Box>
              <GoogleMapProvider>
                {value == 1 ? (
                  <GoogleMapView />
                ) : value == 2 ? (
                  <p>Data</p>
                ) : (
                  <p>Graph</p>
                )}
              </GoogleMapProvider>
            </Box>
          </div>
          <div className="grid w-full gap-2">
            <CardReport>
              <ThermostatIcon />
              {"Temperature"}
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center">
                  <WaterIcon className="sm:max-xl:text-sm" />
                  10 °C
                </span>
                <span className="inline-flex items-center">
                  <AirIcon className="sm:max-xl:text-sm" />
                  10 °C
                </span>
              </div>
            </CardReport>
            <CardReport>
              <BoltIcon />
              {"Electrical Conductivity"}
              <span className="inline-flex items-center">99 µS/cm</span>
            </CardReport>
            <CardReport>
              <WaterDropIcon />
              {"Potential of Hydrogen"}
              <div className="flex items-center">
                <div className=" h-5 w-20 rounded bg-green-300"></div>
                <span className="ml-2">10</span>
              </div>
            </CardReport>
            <CardReport>
              <AirIcon />
              {"Humidity"}
              <span className="inline-flex items-center">99 %</span>
            </CardReport>
            <p className="text-center">Last Update xx:xx</p>
          </div>
        </Content>
        <button className="fixed bottom-5 right-5 border border-white rounded-[100%] p-3 bg-slate-500">
          <PlayArrowIcon />
        </button>
      </div>
    </>
  );
}
