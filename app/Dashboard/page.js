"use client";

import Navbar from "@/components/navbar";
import Content from "@/components/content";
import CardDevice from "@/components/cardDevice";
import GoogleMapView from "@/components/map";
import CardStat from "@/components/cardStatus";
import CardFilter from "@/components/cardFilter";
import Divider from "@mui/material/Divider";
import CardReport from "@/components/cardReport";
import { GoogleMapProvider } from "@/context/GoogleMapProvider";
import { useSession } from "next-auth/react";

//Icon
import ThermostatIcon from "@mui/icons-material/Thermostat";
import AirIcon from "@mui/icons-material/Air";
import WaterIcon from "@mui/icons-material/Water";
import BoltIcon from "@mui/icons-material/Bolt";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import DevicesIcon from "@mui/icons-material/Devices";

export default function Dashboard() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <>
      <Navbar session={session} />
      <Content>
        {"Dashboard"}
        <div>
          <div className="grid grid-cols-4 gap-x-2">
            <div className="grid grid-rows-2 grid-cols-2 col-span-2 gap-2">
              <CardStat>
                <DevicesIcon />
                {"Device"}
                {"100"}
              </CardStat>
              <CardStat>
                <DevicesIcon />
                {"Lands"}
                {"100"}
              </CardStat>
              <CardStat>
                <DevicesIcon />
                {"Device"}
                {"100"}
              </CardStat>
              <CardStat>
                <DevicesIcon />
                {"Lands"}
                {"100"}
              </CardStat>
            </div>
            <div className="col-span-2 row-span-2">
              <CardFilter />
            </div>
          </div>
          <Divider className="my-1 bg-gray-600" style={{ height: "1.5px" }} />
          <GoogleMapProvider>
            <GoogleMapView />
          </GoogleMapProvider>
        </div>
        <div className="grid w-full gap-2">
          <CardDevice />
        </div>
      </Content>
    </>
  );
}
