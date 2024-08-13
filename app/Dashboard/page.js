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

//Icon
import DevicesIcon from "@mui/icons-material/Devices";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Check status session
  if (status === "loading") {
    return null; //Loading indicator
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
          <div className="my-2">
            <Divider className="bg-gray-600" style={{ height: "2px" }} />
          </div>
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
