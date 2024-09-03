"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import axios from "axios";
import { BarChart } from "@mui/x-charts";

const y1 = [5, 5, 10, 90, 85, 70, 30, 25, 25];
const y2 = [90, 85, 70, 25, 23, 40, 45, 40, 50];

const timeData1 = [
    new Date(2023, 7, 31),
    new Date(2023, 7, 31, 12),
    new Date(2023, 8, 1),
    new Date(2023, 8, 1, 12),
    new Date(2023, 8, 2),
    new Date(2023, 8, 2, 12),
    new Date(2023, 8, 3),
    new Date(2023, 8, 3, 12),
    new Date(2023, 8, 4),
    new Date(2023, 8, 4, 12),
    new Date(2023, 8, 5),
];

const valueFormatter = (date) =>
    date.toLocaleDateString("fr-FR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });

export default function FilterChart2() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // const [result, setResult] = useState();
    // const [test, setTest] = useState([]);
    // fetch data from phpmyadmin
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    "https://api.bd2-cloud.net/api/data"
                );
                setData(response.data);
            } catch (error) {
                setError(error);
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    // console.log(data);
    function transformData(data) {
        const groupedData = {};

        // จัดกลุ่มข้อมูลตาม device_id และวันที่
        data?.forEach((item) => {
            // const date = item.datetime.split("T")[0];
            const newDate = new Date(item.datetime); // Create a new Date object
            const year = newDate.getFullYear();
            const month = newDate.getMonth() + 1; // Month is 0-based, so add 1
            const day = newDate.getDate();
            const date = `${year}-${month}-${day}`; // Format date as YYYY-MM-DD
            const deviceId = item.device_id;
            if (!groupedData[date]) {
                groupedData[date] = new Set();
            }
            groupedData[date].add(deviceId);
            console.log(groupedData);
        });

        // สร้างโครงสร้างข้อมูลใหม่
        const dataSets = [];
        dataSets.push({
            value: "Stock Device",
            dataSet: Object.entries(groupedData).map(([date, deviceIds]) => ({
                date,
                data: deviceIds.size,
            })),
        });
        const dataValues = dataSets[0].dataSet.map((item) => item.data);
        const timeData = dataSets[0].dataSet.map((item) => new Date(item.date));
        return { timeData, dataValues };
    }

    const result = transformData(data);
    console.log(result.timeData);
    const config = {
        series: [{ data: result.dataValues, label: "Stock Data" }],
        height: 300,
    };
    const xAxisCommon = {
        data: result.timeData,
        scaleType: "band",
        valueFormatter,
    };
    return (
        <Box sx={{ width: "100%", maxWidth: 800 }}>
            {result.timeData.length > 0 && (
                <BarChart
                    xAxis={[
                        {
                            ...xAxisCommon,
                            // tickMinStep: 3600 * 1000 * 24, // min step: 24h
                        },
                        {
                            ...xAxisCommon,
                            id: "half days",
                            // tickMinStep: 3600 * 1000 * 12, // min step: 12h
                        },
                    ]}
                    {...config}
                />
            )}
        </Box>
    );
}
