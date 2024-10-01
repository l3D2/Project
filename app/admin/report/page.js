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
import CardProblemReport from "@/components/ProblemReport/CardProblemReport";

//Icon
import DevicesIcon from "@mui/icons-material/Devices";
import CloudIcon from "@mui/icons-material/Cloud";
import ApiIcon from "@mui/icons-material/Api";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// Date
export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lastUpdateTime, setLastUpdateTime] = useState(dayjs());

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
          <div className="grid grid-cols-4 gap-x-2 ">
            <div className="grid grid-cols-4 gap-2 col-span-4">
              <CardStat className="col-span-1">
                <DevicesIcon />
                {"Stock Device"}
                {"100"}
              </CardStat>
              <CardStat className="col-span-1">
                <CloudIcon />
                {"Cloud"}
                {"100"}
              </CardStat>
              <CardStat className="col-span-1">
                <ApiIcon />
                {"API"}
                {"100"}
              </CardStat>
              <CardStat className="col-span-1">
                <DevicesIcon />
                {"LINE"}
                {"100"}
              </CardStat>
            </div>
          </div>

          <div className="my-2">
            <Divider className="bg-gray-600" style={{ height: "2px" }} />
          </div>
          <CardProblemReport />
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
