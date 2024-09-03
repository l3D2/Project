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
<<<<<<< HEAD
    const { data: session } = useSession();
    console.log(session);
    return (
        <>
            <Navbar session={session} />
            <Content>
                <div>
                    {/* <div className="grid grid-cols-4 gap-x-2">
=======
  const { data: session, status } = useSession();
  const [countDevices, setCountDevices] = useState(0);
  const router = useRouter();
  const { location } = useContext(UserLocationContext);
  // Fetch device count function
  const fetchCountDevices = async () => {
    if (session && session.user) {
      const id = session.user.id;
      const res = await fetch(
        `https://api.bd2-cloud.net/api/device/getCount/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      if (res.ok) {
        setCountDevices(json);
      } else {
        console.error("Failed to fetch device count:");
      }
    }
  };

  useEffect(() => {
    if (session && session.user) {
      fetchCountDevices();
    }
  }, [session]);

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
>>>>>>> frontend
            <div className="grid grid-rows-2 grid-cols-2 col-span-2 gap-2">
              <CardStat>
                <DevicesIcon />
                {"Device"}
                {countDevices}
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
<<<<<<< HEAD
          </div> */}
                    <Divider
                        className="my-1 bg-gray-600"
                        style={{ height: "1.5px" }}
                    />
                    <GoogleMapView />
                </div>
                <div className="grid w-full gap-2">
                    {/* <CardDevice /> */}
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
                        <span className="inline-flex items-center">
                            99 µS/cm
                        </span>
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
        </>
    );
=======
          </div>
          <div className="my-2">
            <Divider className="bg-gray-600" style={{ height: "2px" }} />
          </div>
          <GoogleMapProvider>
            <GoogleMapView location={location} />
          </GoogleMapProvider>
        </div>
        <div className="grid w-full gap-2">
          <CardDevice />
        </div>
      </Content>
    </>
  );
>>>>>>> frontend
}
