"use client";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

import { Line } from "react-chartjs-2";
function transformData(data) {
    const groupedData = {};
    // จัดกลุ่มข้อมูลตาม device_id และวันที่
    data?.forEach((item) => {
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

function filterDataByDateRange(startDate, endDate, timeData, dataValues) {
    const start = dayjs(startDate).startOf("day"); // Ensure start date is at the beginning of the day
    const end = dayjs(endDate).endOf("day"); // Ensure end date is at the end of the day

    return timeData.reduce(
        (acc, date, index) => {
            const currentDate = dayjs(date);
            if (
                currentDate.isSame(start) ||
                currentDate.isSame(end) ||
                (currentDate.isAfter(start) && currentDate.isBefore(end))
            ) {
                acc.filteredTimeData.push(date);
                acc.filteredDataValues.push(dataValues[index]);
            }
            return acc;
        },
        { filteredTimeData: [], filteredDataValues: [] }
    );
}

export default function FilterChart2() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
    const [endDate, setEndDate] = useState(dayjs());
    const [optionsChart, setOptionsChart] = useState({});
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Stock",
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                data: [],
            },
            {
                label: "Line",
                data: [],
            },
        ],
    });

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

    useEffect(() => {
        const result = transformData(data);
        const { filteredTimeData, filteredDataValues } = filterDataByDateRange(
            startDate,
            endDate,
            result.timeData,
            result.dataValues
        );

        setChartData({
            labels: filteredTimeData.map((date) =>
                dayjs(date).format("DD/MM/YYYY")
            ),
            datasets: [
                {
                    label: "Stock",
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    data: filteredDataValues,
                },
                {
                    label: "Line",
                    data: filteredDataValues,
                },
            ],
        });

        setOptionsChart({
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: Math.max(...filteredDataValues) + 1,
                },
            },
        });
    }, [startDate, endDate, data]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="p-4">
                <div className="flex space-x-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date and Time"
                            value={startDate}
                            format="DD/MM/YYYY"
                            onChange={(newValue) => {
                                setStartDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="End Date and Time"
                            value={endDate}
                            format="DD/MM/YYYY"
                            onChange={(newValue) => {
                                setEndDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                </div>
                <div className="w-96 h-72 mt-4">
                    <Line data={chartData} options={optionsChart} />
                </div>
                <div className="w-96 h-72 mt-4">
                    <div>User Graph</div>
                    <Line
                        data={{
                            labels: [
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                            ],
                            datasets: [
                                {
                                    label: "My First dataset",
                                    data: [10, 10, 10, 10, 10],
                                    fill: false,
                                    backgroundColor: "rgb(75, 192, 192)",
                                    borderColor: "rgba(75, 192, 192, 0.2)",
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </>
    );
}
