// import { styled } from "@mui/material/styles";
// import Tooltip from "@mui/material/Tooltip";
// import Stack from "@mui/material/Stack";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function Label({ componentName, valueType }) {
    const content = (
        <span>
            <strong>{componentName}</strong> for {valueType} editing
        </span>
    );

    return content;
}

export default function TimeFilter() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
                <DemoItem
                    label={
                        <Label
                            componentName="FirstTime"
                            valueType="date time"
                        />
                    }
                >
                    <DateTimePicker />
                </DemoItem>
                <DemoItem
                    label={
                        <Label componentName="LastTime" valueType="date time" />
                    }
                >
                    <DateTimePicker />
                </DemoItem>
            </DemoContainer>
        </LocalizationProvider>
    );
}
