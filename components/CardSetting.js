import React from "react";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function CardSetting({ deviceName }) {
    return (
        <div>
            <div className="flex flex-col shadow-lg m-1 p-5">
                <div className="flex items-center justify-between p-1 w-full">
                    <label htmlFor="">{deviceName}</label>
                    <FormControl component="fieldset">
                        <FormGroup aria-label="position" col>
                            <FormControlLabel
                                value="start"
                                control={<Switch color="primary" />}
                                labelPlacement="start"
                            />
                        </FormGroup>
                    </FormControl>
                </div>
                <div className="flex">
                    <TextField
                        className="mr-2 w-full"
                        id="MinEC"
                        label="Min value"
                        variant="outlined"
                        inputProps={{ type: "number", min: 0, max: 10 }}
                    />
                    <TextField
                        className="w-full"
                        id="MaxEC"
                        label="Max value"
                        variant="outlined"
                        inputProps={{ type: "number", min: 0, max: 10 }}
                    />
                </div>
                <div className="flex justify-between p-1"></div>
                <Button className="p-2 w-full" variant="contained">
                    Setting
                </Button>
            </div>
        </div>
    );
}
