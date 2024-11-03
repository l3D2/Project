"use client";
import Navbar from "@/components/navbar";
import Content from "@/components/content";
import CardStat from "@/components/cardStatus";
import Divider from "@mui/material/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { UserLocationContext } from "@/context/context";
import CardAdmin from "@/components/cardAdmin";
import AdminChart from "@/components/AdminChart";
import dayjs from "dayjs";

//Icon
import DevicesIcon from "@mui/icons-material/Devices";
import CloudIcon from "@mui/icons-material/Cloud";
import ApiIcon from "@mui/icons-material/Api";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { location } = useContext(UserLocationContext);
  const [lastUpdateTime, setLastUpdateTime] = useState(dayjs());
  const [serviceStatus, setServiceStatus] = useState({
    apiStatus: "Offline",
    lineStatus: "Offline",
    deviceTot: 0,
    deviceOnline: 0,
  });

  const checkServiceStatus = async () => {
    try {
      const resApi = await fetch("https://api.bd2-cloud.net/", {
        method: "GET",
      });
      if (resApi.ok) {
        setServiceStatus((prev) => ({ ...prev, apiStatus: "Online" }));
      } else {
        setServiceStatus((prev) => ({ ...prev, apiStatus: "Offline" }));
        throw new Error("API Service is Offline");
      }
    } catch (error) {
      //router.replace("/error");
    }
    try {
      const resLine = await fetch("https://api-line.bd2-cloud.net/", {
        method: "GET",
      });

      if (resLine.ok) {
        setServiceStatus((prev) => ({ ...prev, lineStatus: "Online" }));
      } else {
        setServiceStatus((prev) => ({ ...prev, lineStatus: "Offline" }));
        throw new Error("Line Service is Offline");
      }
    } catch (error) {
      //router.replace("/error");
    }
  };

  const fetchDevice = async () => {
    try {
      const res = await fetch(
        `https://api.bd2-cloud.net/api/device/backend/device`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log("Data", data);
      if (res.ok && data.status !== 404) {
        setServiceStatus((prev) => ({
          ...prev,
          deviceTot: data[0].total,
          deviceOnline: data[0].online,
        }));
      } else {
        throw new Error("Error fetch device");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (session && session.user) {
      checkServiceStatus();
      fetchDevice();
      console.log(serviceStatus);
    }
    const interval = setInterval(() => {
      checkServiceStatus();
      fetchDevice();
      setLastUpdateTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, [session]);

  // Check status session
  if (status === "loading") {
    return null; // Loading indicator
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  } else if (session?.user?.role == "U") {
    router.replace("/dashboard");
  }
  return (
    <>
      <Navbar session={session} />
      <Content>
        {"Dashboard"}
        <div className="bg-gray-200">
          <div className="grid grid-cols-4 gap-x-2">
            <div className="grid grid-cols-3 gap-2 col-span-4">
              <CardStat className="col-span-1">
                <DevicesIcon />
                {"Device"}
                {serviceStatus.deviceOnline + " / " + serviceStatus.deviceTot}
              </CardStat>
              <CardStat className="col-span-1">
                <ApiIcon />
                {"API"}
                {serviceStatus.apiStatus}
              </CardStat>
              <CardStat className="col-span-1">
                <DevicesIcon />
                {"LINE"}
                {serviceStatus.lineStatus}
              </CardStat>
            </div>
          </div>

          <div className="my-2">
            <Divider className="bg-gray-600" style={{ height: "2px" }} />
          </div>
          <AdminChart />
        </div>
        <div className="grid w-full gap-2 bg-gray-300">
          <CardAdmin>
            <AdminPanelSettingsIcon />
            {"Administrator"}
          </CardAdmin>
          <p className="text-center pb-2">
            Last Update {lastUpdateTime.format("HH:mm")}
          </p>
        </div>
      </Content>
    </>
  );
}
