"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Content from "@/components/content";
import CardDevice from "@/components/cardDevice";
import GoogleMapView from "@/components/map";
import CardStat from "@/components/cardStatus";
import CardAdmin from "@/components/cardAdmin";
import CardFilter from "@/components/cardFilter";
import Divider from "@mui/material/Divider";
import CardReport from "@/components/cardReport";
import ListAdmin from "@/components/ListAdmin";
import { Box } from "@mui/material";

import { useSession } from "next-auth/react";

//Icon
import DevicesIcon from "@mui/icons-material/Devices";
import CloudIcon from "@mui/icons-material/Cloud";
import ApiIcon from "@mui/icons-material/Api";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// graph
import { LineChart } from "@mui/x-charts/LineChart";
import FilterChart from "@/components/FilterChart";
import FilterChart2 from "@/components/FilterChart2";
import TimeFilter from "@/components/TimeFilter";
import { useState } from "react";

// let testData = [2, 5.5, 2, 8.5, 1.5, 5, 20, 10];
export default function AdminDashboard() {
    const { data: session } = useSession();
    console.log(session);

    const getDataSet = () => {
        return DataSet;
    };

    return (
        <>
            <Navbar session={session} />
            <Content>
                <div>
                    <div>
                        <div className="grid grid-rows-2 grid-cols-2 col-span-2 gap-2">
                            <CardStat>
                                <DevicesIcon />
                                {"Stock Device"}
                                {"100"}
                            </CardStat>
                            <CardStat>
                                <CloudIcon />
                                {"Cloud"}
                                {"100"}
                            </CardStat>
                            <CardStat>
                                <ApiIcon />
                                {"API"}
                                {"100"}
                            </CardStat>
                            <CardStat>
                                <DevicesIcon />
                                {"LINE"}
                                {"100"}
                            </CardStat>
                        </div>

                        <div className="width-fit">
                            <FilterChart
                                className="width-fit"
                                dataSet={getDataSet}
                            />
                            {/* <FilterChart2 /> */}

                            <TimeFilter />

                            <LineChart
                                className="w-full"
                                xAxis={[
                                    {
                                        id: "time",
                                        data: [1, 2, 3, 5, 8, 10, 11, 12],
                                    },
                                ]}
                                series={[
                                    {
                                        data: [1, 4, 3, 5, 6, 8, 9, 10],
                                    },
                                ]}
                                height={300}
                            />

                            <LineChart
                                className="w-full"
                                xAxis={[
                                    {
                                        id: "time",
                                        data: [1, 2, 3, 5, 8, 10, 11, 12],
                                    },
                                ]}
                                series={[
                                    {
                                        data: [1, 4, 3, 5, 6, 8, 9, 10],
                                    },
                                ]}
                                height={300}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid w-full gap-2">
                    {/* <CardDevice /> */}
                    <CardAdmin>
                        <AdminPanelSettingsIcon />
                        {"Administrator"}
                    </CardAdmin>
                    <ListAdmin />
                    <p className="text-center pb-2">Last Update xx:xx</p>
                </div>
                <div>
                    <buttonTest />
                </div>
            </Content>
        </>
    );
}
