import * as React from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

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
// this data maybe use array not string
const data = ["Stock Device", "Cloud", "API", "LINE"];

// ประเภทของอุปกรณ์, วันเวลาที่ต้องการแสดง

function print(props) {
    console.log(props);
}

export default function FilterChart() {
    const [filterChart, setFilterChart] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setFilterChart(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
        console.log("value " + value);
        console.log("event " + filterChart);
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
                    {data.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox
                                checked={filterChart.indexOf(name) > -1}
                            />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
