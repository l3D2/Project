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
import CardAdmin from "@/components/cardAdmin";
import ListAdmin from "@/components/ListAdmin";
import AdminChart from "@/components/AdminChart";
import dayjs from "dayjs";

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
                    <AdminChart />
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

// "use client";
// import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
// import Content from "@/components/content";
// import CardDevice from "@/components/cardDevice";
// import GoogleMapView from "@/components/map";
// import CardStat from "@/components/cardStatus";
// import CardAdmin from "@/components/cardAdmin";
// import CardFilter from "@/components/cardFilter";
// import Divider from "@mui/material/Divider";
// import CardReport from "@/components/cardReport";
// import ListAdmin from "@/components/ListAdmin";
// import { Box } from "@mui/material";

// import { useSession } from "next-auth/react";

// //Icon
// import DevicesIcon from "@mui/icons-material/Devices";
// import CloudIcon from "@mui/icons-material/Cloud";
// import ApiIcon from "@mui/icons-material/Api";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// // graph
// import { LineChart } from "@mui/x-charts/LineChart";
// import FilterChart from "@/components/FilterChart";
// import FilterChart2 from "@/components/FilterChart2";
// import TimeFilter from "@/components/TimeFilter";
// import { useState } from "react";

// // let testData = [2, 5.5, 2, 8.5, 1.5, 5, 20, 10];
// export default function AdminDashboard() {
//     const { data: session } = useSession();
//     console.log(session);

//     const getDataSet = () => {
//         return DataSet;
//     };

//     return (
//         <>
//             <Navbar session={session} />
//             <Content>
//                 <div>
//                     <div>
//                         <div className="grid grid-rows-2 grid-cols-2 col-span-2 gap-2">
//                             <CardStat>
//                                 <DevicesIcon />
//                                 {"Stock Device"}
//                                 {"100"}
//                             </CardStat>
//                             <CardStat>
//                                 <CloudIcon />
//                                 {"Cloud"}
//                                 {"100"}
//                             </CardStat>
//                             <CardStat>
//                                 <ApiIcon />
//                                 {"API"}
//                                 {"100"}
//                             </CardStat>
//                             <CardStat>
//                                 <DevicesIcon />
//                                 {"LINE"}
//                                 {"100"}
//                             </CardStat>
//                         </div>

//                         <div className="width-fit">
//                             <FilterChart
//                                 className="width-fit"
//                                 dataSet={getDataSet}
//                             />
//                             {/* <FilterChart2 /> */}

//                             <TimeFilter />

//                             <LineChart
//                                 className="w-full"
//                                 xAxis={[
//                                     {
//                                         id: "time",
//                                         data: [1, 2, 3, 5, 8, 10, 11, 12],
//                                     },
//                                 ]}
//                                 series={[
//                                     {
//                                         data: [1, 4, 3, 5, 6, 8, 9, 10],
//                                     },
//                                 ]}
//                                 height={300}
//                             />

//                             <LineChart
//                                 className="w-full"
//                                 xAxis={[
//                                     {
//                                         id: "time",
//                                         data: [1, 2, 3, 5, 8, 10, 11, 12],
//                                     },
//                                 ]}
//                                 series={[
//                                     {
//                                         data: [1, 4, 3, 5, 6, 8, 9, 10],
//                                     },
//                                 ]}
//                                 height={300}
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="grid w-full gap-2">
//                     {/* <CardDevice /> */}
//                     <CardAdmin>
//                         <AdminPanelSettingsIcon />
//                         {"Administrator"}
//                     </CardAdmin>
//                     <ListAdmin />
//                     <p className="text-center pb-2">Last Update xx:xx</p>
//                 </div>
//                 <div>
//                     <buttonTest />
//                 </div>
//             </Content>
//         </>
//     );
// }
