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
  const [device, setDevice] = useState([
    {
      id: "N/A",
      name: "N/A",
      land: "N/A",
      land_name: "N/A",
      location: "N/A",
      status: "N/A",
      blip: 0,
    },
  ]);
  const [countLands, setCountLands] = useState(0);
  const fetchDevices = async () => {
    const id = session.user.id;
    try {
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
      if (res.ok && json.status !== 404) {
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
      } else if (json.status === 404) {
      } else {
        console.error("Failed to fetch device.");
        throw new Error("Failed to fetch device.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchLands = async () => {
    const id = session.user.id;
    try {
      const res = await fetch(`https://api.bd2-cloud.net/api/category/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      if (res.ok && json.status !== 404) {
        setCountLands(json.length);
      } else if (json.status == 404) {
      } else {
        console.error("Failed to fetch device.");
        throw new Error("Failed to fetch device.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (session && session.user) {
      fetchDevices();
      fetchLands();
    }
  }, [session]);
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
  return (
    <>
      <Navbar session={session} />
      <Content>
        {"Dashboard"}
        <div>
          <div className="grid grid-cols-2 gap-x-2">
            <CardStat>
              <DevicesIcon />
              {"Device"}
              {device.filter((d) => d.status === 1).length +
                "/" +
                (device[0].id == "N/A" ? 0 : device.length)}
            </CardStat>
            <CardStat>
              <DevicesIcon />
              {"Lands"}
              {countLands}
            </CardStat>
          </div>
          <div className="my-2">
            <Divider className="bg-gray-600" style={{ height: "2px" }} />
          </div>
          {/* <GoogleMapProvider> */}
          <GoogleMapView location={location} />
          {/* </GoogleMapProvider> */}
        </div>
        <div className="grid w-full gap-2">
          <CardDevice rdata={device} />
        </div>
      </Content>
    </>
  );
}
