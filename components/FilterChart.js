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

function FilterChart() {
    const [filterChart, setFilterChart] = useState([]);
    const [data, setData] = useState(null);
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
                console.log(response.data.length);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // label data
    const labelData = {
        label: "Stock Device",
        data: data?.map((items) => ({
            device_id: items.device_id,
            datetime: items.datetime,
        })),
    };
    console.log(labelData);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setFilterChart(value); // Update state with selected values
    };

    const filteredData = dataSets.filter((item) =>
        filterChart.includes(item.value)
    ); // Filter data based on selection
    const filteredDataSeries = filteredData.map((item) => ({
        data: item.dataSet.map((dataSetItem) => dataSetItem.data), // Get data from each dataSet item
        label: item.value,
    }));

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
                    {dataSets.map((item) => (
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
                xAxis={[{ data: [1, 2, 3, 4, 5, 6] }]} // Replace with your actual x-axis data
                series={filteredDataSeries} // Use filtered data series
                width={500}
                height={300}
            />
        </div>
    );
}

export default FilterChart;
