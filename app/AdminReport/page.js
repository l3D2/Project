"use client";

import Navbar from "@/components/navbar";
import Content from "@/components/content";
import CardStat from "@/components/cardStatus";
import Divider from "@mui/material/Divider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { UserLocationContext } from "@/context/context";
import CardAdmin from "@/components/CardAdmin";
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
    const [countDevices, setCountDevices] = useState(0);
    const router = useRouter();
    const { location } = useContext(UserLocationContext);
    const [lastUpdateTime, setLastUpdateTime] = useState(dayjs());

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
                    <div className="grid grid-cols-4 gap-x-2">
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
                        <Divider
                            className="bg-gray-600"
                            style={{ height: "2px" }}
                        />
                    </div>
                    <CardProblemReport />
                </div>
                <div className="grid w-full gap-2">
                    {/* <CardDevice /> */}
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
