"use client";
import React, { useState } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box"; // Import for conditional rendering

import { LineChart } from "@mui/x-charts/LineChart";

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

const data = [
    {
        value: "Stock Device",
        content: "Displays data from locally stored devices.",
        data: [1, 2, 3, 4, 5, 5],
    },
    {
        value: "Cloud",
        content: "Shows data fetched from the cloud storage.",
        data: [2, 4, 5, 5, 6, 5.5],
    },
    {
        value: "API",
        content: "Visualizes data retrieved from external APIs.",
        data: [2, 4, 1, 2, 3, 2.5],
    },
    {
        value: "LINE",
        content: "Presents data specifically related to the LINE platform.",
        data: [1, 3, 2, 4, 3, 4.5],
    },
];

function FilterChart() {
    const [filterChart, setFilterChart] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setFilterChart(value); // Update state with selected values
    };

    const filteredData = data.filter((item) =>
        filterChart.includes(item.value)
    ); // Filter data based on selection
    const filteredDataSeries = filteredData.map((item) => ({
        data: item.data,
        label: item.value,
    })); // Create series for filtered data

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
                    {data.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            <Checkbox
                                checked={filterChart.includes(item.value)}
                            />
                            <ListItemText primary={item.value} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Conditional rendering based on selected options */}
            <Box sx={{ mt: 2 }}>
                {filterChart.length > 0 && (
                    <div>
                        <h4>Selected Filters:</h4>
                        <ul>
                            {filterChart.map((selectedValue) => (
                                <li key={selectedValue}>
                                    {
                                        data.find(
                                            (item) =>
                                                item.value === selectedValue
                                        )?.content
                                    }
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Box>

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
