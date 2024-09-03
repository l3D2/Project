"use client";
import React, { useState, useEffect } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box"; // Import for conditional rendering
import axios from "axios";

import { LineChart } from "@mui/x-charts/LineChart";
import { listItemClasses } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// pH 0 - 14 pH
// EC 1 - 15 ms/cm
// temp 0 - 60 c
// humidity: 0 - 100% RH and temp air -40 - 80 c
// ppt 0 - 30 ppt
// battery 0% - 100%

const dataSets = [
    {
        value: "Stock Device",
        content: "Displays data from locally stored devices.",
        dataSet: [
            {
                date: "2012-04-23T18:25:43.511",
                data: 4,
            },
            {
                date: "2012-04-23T19:30:45.111",
                data: 5,
            },
        ],
    },
    {
        value: "Cloud",
        content: "Shows data fetched from the cloud storage.",
        dataSet: [
            {
                date: "2012-04-23T18:25:43.511",
                data: 7,
            },
            {
                date: "2012-04-23T19:30:45.111",
                data: 8,
            },
        ],
    },
    {
        value: "API",
        content: "Visualizes data retrieved from external APIs.",
        dataSet: [
            {
                date: "2012-04-23T18:25:43.511",
                data: 1,
            },
            {
                date: "2012-04-23T19:30:45.111",
                data: 2,
            },
        ],
    },
    {
        value: "LINE",
        content: "Presents data specifically related to the LINE platform.",
        dataSet: [
            {
                date: "2012-04-23T18:25:43.511",
                data: 5,
            },
            {
                date: "2012-04-23T19:30:45.111",
                data: 10,
            },
        ],
    },
];
// array 1 have 2 index and array 2 have 1 index
const dataFake2 = [
    {
        device_id: "07408530-4b22-11ef-968b-42fe22515858",
        datetime: "2022-01-01T10:00:00",
    },
    {
        device_id: "07408530-4b22-11ef-968b-42fe22515858",
        datetime: "2022-01-01T11:00:00",
    },
    {
        device_id: "17408530-4b22-11ef-968b-42fe22515858",
        datetime: "2022-01-02T11:00:00",
    },
    {
        device_id: "17408530-4b22-11ef-968b-42fe22515858",
        datetime: "2022-01-01T11:00:00",
    },
];
const timeData = [
    new Date(2023, 7, 31),
    new Date(2023, 7, 31, 12),
    new Date(2023, 8, 1),
    new Date(2023, 8, 1, 12),
    new Date(2023, 8, 2),
    new Date(2023, 8, 2, 12),
    new Date(2023, 8, 3),
    new Date(2023, 8, 3, 12),
    new Date(2023, 8, 4),
    new Date(2023, 8, 5),
    new Date(2023, 9, 10),
];
function FilterChart() {
    const [filterChart, setFilterChart] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    console.log(data);
    function transformData(data) {
        const groupedData = {};

        // จัดกลุ่มข้อมูลตาม device_id และวันที่
        data.forEach((item) => {
            const date = item.datetime.split("T")[0];
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
        return dataSets;
    }

    const result = transformData(data);
    // console.log(result);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setFilterChart(value); // Update state with selected values
    };
    const y1 = [5, 5, 10, 90, 85, 70, 30, 25, 25];

    const filteredData = result.filter((item) =>
        filterChart.includes(item.value)
    ); // Filter data based on selection
    // console.log(filteredData);
    const filteredDataSeries = filteredData.map((item) => ({
        data: item.dataSet.map((dataSetItem) => dataSetItem.data), // Get data from each dataSet item
        label: item.value,
    }));
    console.log(filteredDataSeries);
    const filteredxAxis = result.flatMap((dataSet) =>
        dataSet.dataSet.map((item) => new Date(item.date))
    );
    // console.log(filteredxAxis);
    const valueFormatter = (date) => {
        return date.toLocaleDateString("th-TH", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });
    };
    const xAxisCommon = {
        data: timeData,
        scaleType: "time",
        valueFormatter,
        domain: [new Date(2023, 7, 31), new Date(2023, 9, 10)],
    };
    return (
        <div>
            <FormControl sx={{ mt: 2, width: "100%" }}>
                <InputLabel id="filter-chart-label">Filter</InputLabel>
                <Select
                    labelId="filter-chart-label"
                    id="filter-chart"
                    multiple
                    value={filterChart}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                >
                    {result.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            <Checkbox
                                checked={filterChart.includes(item.value)}
                            />
                            <ListItemText primary={item.value} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <LineChart
                xAxis={[
                    {
                        ...xAxisCommon,
                        domain: [new Date(2023, 8, 31), new Date(2023, 9, 10)],
                        tickInterval: 1,
                    },
                ]} // Replace with your actual x-axis data
                series={filteredDataSeries} // Use filtered data series
                yAxis={[{ id: "linearAxis", scaleType: "linear" }]}
                width={500}
                height={300}
            />
            {/* <LineChart
                xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }]} // Replace with your actual x-axis data
                series={filteredDataSeries} // Use filtered data series
                width={500}
                height={300}
            /> */}
        </div>
    );
}

export default FilterChart;
