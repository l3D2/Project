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
                    </div>
                    <div className="my-2">
                        <Divider
                            className="bg-gray-600"
                            style={{ height: "2px" }}
                        />
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
}
