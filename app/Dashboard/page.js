"use client";

import Navbar from "@/components/navbar";
import Content from "@/components/content";
import CardDevice from "@/components/cardDevice";
import GoogleMapView from "@/components/map";
import CardStat from "@/components/cardStatus";
import CardFilter from "@/components/cardFilter";
import Divider from "@mui/material/Divider";
import { GoogleMapProvider } from "@/context/GoogleMapProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { UserLocationContext } from "@/context/context";

//Icon
import DevicesIcon from "@mui/icons-material/Devices";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { location } = useContext(UserLocationContext);
  const [device, setDevice] = useState([]);
  const [countLands, setCountLands] = useState(0);

  const fetchDevices = async () => {
    const id = session.user.id;
    const res = await fetch(
      `https://api.bd2-cloud.net/api/device/get-device/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await res.json();
    if (res.ok) {
      const result = Object.values(json).map((item, index) => {
        return {
          id: item.device_id,
          name: item.device_name,
          land: item.cat_id,
          land_name: item.cat_name,
          location: JSON.parse(item.location),
          status: item.status,
          blip: 1,
        };
      });
      setDevice(result);
    } else {
      console.error("Failed to fetch device.");
    }
  };

  const fetchLands = async () => {
    const id = session.user.id;
    const res = await fetch(`https://api.bd2-cloud.net/api/category/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (res.ok) {
      setCountLands(json.length);
    } else {
      console.error("Failed to fetch device.");
    }

  useEffect(() => {
    if (session && session.user) {
      fetchDevices();
      fetchLands();
    }

  // Check status session
  if (status === "loading") {
    return null; // Loading indicator
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  }

  return (
    <>
      <Navbar session={session} />
      <Content>
        {"Dashboard"}
        <div>
          <div className="grid grid-cols-4 gap-x-2">
            <CardStat>
              <DevicesIcon />
              {"Device"}
              {device.length}
            </CardStat>
            <CardStat>
              <DevicesIcon />
              {"Lands"}
              {countLands}
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
          <div className="my-2">
            <Divider className="bg-gray-600" style={{ height: "2px" }} />
          </div>
          <GoogleMapProvider>
            <GoogleMapView location={location} />
          </GoogleMapProvider>
        </div>
        <div className="grid w-full gap-2">
          <CardDevice rdata={device} />
        </div>
      </Content>
    </>
  );
}
