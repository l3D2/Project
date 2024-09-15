"use client";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";

import {
    Chart,
    PointElement,
    LineElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
} from "chart.js";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { Line } from "react-chartjs-2";

Chart.register(
    PointElement,
    LineElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale
);

const filterDataByDate = (data, startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return data.filter((item) => {
        const date = dayjs(item.datetime);
        return date.isAfter(start) && date.isBefore(end);
    });
};

const aggregateDataByMonth = (data) => {
    const aggregatedData = {};

    data.forEach((item) => {
        const month = dayjs(item.datetime).format("YYYY-MM");
        if (!aggregatedData[month]) {
            aggregatedData[month] = {
                EC: 0,
                Humidity: 0,
                PH: 0,
                Temp: 0,
                Temp_Water: 0,
                count: 0,
            };
        }
        aggregatedData[month].EC += item.EC;
        aggregatedData[month].Humidity += item.Humidity;
        aggregatedData[month].PH += item.PH;
        aggregatedData[month].Temp += item.Temp;
        aggregatedData[month].Temp_Water += item.Temp_Water;
        aggregatedData[month].count += 1;
    });

    return Object.keys(aggregatedData).map((month) => ({
        datetime: month,
        EC: aggregatedData[month].EC / aggregatedData[month].count,
        Humidity: aggregatedData[month].Humidity / aggregatedData[month].count,
        PH: aggregatedData[month].PH / aggregatedData[month].count,
        Temp: aggregatedData[month].Temp / aggregatedData[month].count,
        Temp_Water:
            aggregatedData[month].Temp_Water / aggregatedData[month].count,
    }));
};

const aggregateDataByYear = (data) => {
    const aggregatedData = {};

    data.forEach((item) => {
        const year = dayjs(item.datetime).format("YYYY");
        if (!aggregatedData[year]) {
            aggregatedData[year] = {
                EC: 0,
                Humidity: 0,
                PH: 0,
                Temp: 0,
                Temp_Water: 0,
                count: 0,
            };
        }
        aggregatedData[year].EC += item.EC;
        aggregatedData[year].Humidity += item.Humidity;
        aggregatedData[year].PH += item.PH;
        aggregatedData[year].Temp += item.Temp;
        aggregatedData[year].Temp_Water += item.Temp_Water;
        aggregatedData[year].count += 1;
    });

    return Object.keys(aggregatedData).map((year) => ({
        datetime: year,
        EC: aggregatedData[year].EC / aggregatedData[year].count,
        Humidity: aggregatedData[year].Humidity / aggregatedData[year].count,
        PH: aggregatedData[year].PH / aggregatedData[year].count,
        Temp: aggregatedData[year].Temp / aggregatedData[year].count,
        Temp_Water:
            aggregatedData[year].Temp_Water / aggregatedData[year].count,
    }));
};

const getDeviceIds = (data) => {
    const deviceIds = data.map((item) => item.device_id);
    return [...new Set(deviceIds)];
};

export default function UserChart() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
    const [endDate, setEndDate] = useState(dayjs());
    const [viewMode, setViewMode] = useState("day"); // "day", "month", "year"
    const [uniqueDeviceIds, setUniqueDeviceIds] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [optionsChart, setOptionsChart] = useState({});
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "EC",
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                data: [],
            },
            {
                label: "Humidity",
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
                const deviceIds = getDeviceIds(response.data);
                setUniqueDeviceIds(deviceIds);
                setSelectedDeviceId(deviceIds[0] || "");
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
        if (uniqueDeviceIds.length > 0) {
            setSelectedDeviceId(uniqueDeviceIds[0]);
        }
    }, [uniqueDeviceIds]);

    const filteredByDeviceIdData = data.filter(
        (item) => item.device_id === selectedDeviceId
    );

    const handleDeviceIdChange = (event) => {
        setSelectedDeviceId(event.target.value);
    };

    const filteredData = filterDataByDate(
        filteredByDeviceIdData,
        startDate,
        endDate
    );

    const processedData =
        viewMode === "month"
            ? aggregateDataByMonth(filteredData)
            : viewMode === "year"
            ? aggregateDataByYear(filteredData)
            : filteredData;

    useEffect(() => {
        setChartData({
            labels: processedData.map((items) =>
                dayjs(items.datetime).format(
                    viewMode === "year"
                        ? "YYYY"
                        : viewMode === "month"
                        ? "MM/YYYY"
                        : "DD/MM/YYYY"
                )
            ),
            datasets: [
                {
                    label: "EC",
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    data: processedData.map((items) => items.EC),
                },
                {
                    label: "Humidity",
                    backgroundColor: "rgba(250,192,192,0.4)",
                    borderColor: "rgba(250,192,192,1)",
                    data: processedData.map((items) => items.Humidity),
                },
                {
                    label: "PH",
                    backgroundColor: "rgba(250,234,192,0.4)",
                    borderColor: "rgba(250,234,192,1)",
                    data: processedData.map((items) => items.PH),
                },
                {
                    label: "Air Temp",
                    backgroundColor: "rgba(250,24,192,0.4)",
                    borderColor: "rgba(250,24,192,1)",
                    data: processedData.map((items) => items.Temp),
                },
                {
                    label: "Water Temp",
                    backgroundColor: "rgba(150,234,192,0.4)",
                    borderColor: "rgba(150,234,192,1)",
                    data: processedData.map((items) => items.Temp_Water),
                },
            ],
        });

        setOptionsChart({
            responsive: true,
            maintainAspectRatio: false,
        });
    }, [startDate, endDate, data, viewMode]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    const handleStartDateChange = (newValue) => {
        if (endDate && newValue && newValue.isAfter(endDate)) {
            alert("Start date cannot be after end date");
        } else {
            setStartDate(newValue);
        }
    };

    const handleEndDateChange = (newValue) => {
        if (startDate && newValue && newValue.isBefore(startDate)) {
            alert("End date cannot be before start date");
        } else {
            setEndDate(newValue);
        }
    };

    return (
        <>
            <div className="p-4">
                <div className="flex space-x-4 items-center justify-center">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date and Time"
                            value={startDate}
                            format="DD/MM/YYYY"
                            onChange={handleStartDateChange}
                            shouldDisableDate={(date) =>
                                endDate && date.isAfter(endDate, "day")
                            }
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="End Date and Time"
                            value={endDate}
                            format="DD/MM/YYYY"
                            onChange={handleEndDateChange}
                            shouldDisableDate={(date) =>
                                startDate && date.isBefore(startDate, "day")
                            }
                        />
                    </LocalizationProvider>
                    <div className="">
                        <label htmlFor="device-select">Select View Mode</label>
                        <select
                            id="viewmode-select"
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                            className="w-fit h-fit"
                        >
                            <option value="day">View by Day</option>
                            <option value="month">View by Month</option>
                            <option value="year">View by Year</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="device-select">Select Device ID:</label>
                        <select
                            id="device-select"
                            value={selectedDeviceId}
                            onChange={handleDeviceIdChange}
                        >
                            <option value="">--Select Device ID--</option>
                            {uniqueDeviceIds.map((deviceId) => (
                                <option key={deviceId} value={deviceId}>
                                    {deviceId}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="w-full h-72 mt-10">
                    <Line data={chartData} options={optionsChart} />
                </div>
            </div>
        </>
    );
}
