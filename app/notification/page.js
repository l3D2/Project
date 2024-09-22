"use client";

import Navbar from "@/components/navbar";
import Content from "@/components/content";
import CardDevice from "@/components/cardDevice";
import CardStat from "@/components/cardStatus";
import CardFilter from "@/components/cardFilter";
import Divider from "@mui/material/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { UserLocationContext } from "@/context/context";
import { Box } from "@mui/material";
import CardSetting from "@/components/CardSetting";

import DevicesIcon from "@mui/icons-material/Devices";

export default function notification() {
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
    // if (status === "loading") {
    //     return null; // Loading indicator
    // }

    // if (!session) {
    //     router.replace("/auth/signin");
    //     return null;
    // }

    return (
        <>
            <Navbar session={session} />
            <Content>
                {"Dashboard"}
                <div>
                    <Box
                        className="bg-white"
                        component="section"
                        sx={{
                            p: 2,
                            borderRadius: 1,
                        }}
                    >
                        <p className="text-slate-500">Setting Notification</p>
                        <div className="grid grid-cols-3 ">
                            <CardSetting deviceName={"EC Sensor"} />
                            <CardSetting deviceName={"PH Sensor"} />
                            <CardSetting deviceName={"Battery"} />
                            <CardSetting deviceName={"Temp Sensor"} />
                            <CardSetting deviceName={"EC Sensor"} />
                            <CardSetting deviceName={"EC Sensor"} />
                        </div>

                        {/* <div className="flex justify-between">
                            
                            <CardSetting deviceName={"EC Sensor"} />
                            <CardSetting deviceName={"EC Sensor"} />
                        </div> */}
                    </Box>
                </div>
                <div className="grid w-full gap-2">
                    <CardDevice />
                </div>
            </Content>
        </>
    );
}
