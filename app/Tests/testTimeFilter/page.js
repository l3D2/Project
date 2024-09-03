"use client";

// Import React and necessary libraries
import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

// Function component to calculate time difference between two dates
export default function TestTimeFilter() {
    // State variables for selected dates/times and time difference
    const [selectedDateTimes, setSelectedDateTimes] = useState([]);
    const [timeDifference, setTimeDifference] = useState(null);

    // Function to handle date/time picker changes
    const handleChange = (newValue, index) => {
        if (!newValue) return; // Handle no selection gracefully

        const dayjsDate = dayjs(newValue);
        const year = dayjsDate.year();
        const month = dayjsDate.month() + 1; // Month is 0-indexed
        const day = dayjsDate.date();
        const time = dayjsDate.format("HH:mm");

        // Update state based on index (for two pickers)
        if (index === 0) {
            // First Picker
            setSelectedDateTimes([
                { dateTime: newValue, year, month, day, time },
                ...selectedDateTimes.slice(1), // Preserve existing selections (if any)
            ]);
        } else {
            // Second Picker
            setSelectedDateTimes([
                ...selectedDateTimes.slice(0, 1),
                { dateTime: newValue, year, month, day, time },
            ]);
        }

        // Calculate time difference if both are selected
        if (selectedDateTimes.length === 2) {
            const diff = dayjs(selectedDateTimes[1].dateTime).diff(
                dayjs(selectedDateTimes[0].dateTime)
            );
        } else {
            setTimeDifference(null); // Clear difference if only one selected
        }
    };

    // Return the React component
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                        label="Start Date/Time"
                        ampm={false}
                        ampmInClock={true}
                        onChange={(newValue) => handleChange(newValue, 0)} // First Picker
                    />
                    <DateTimePicker
                        label="End Date/Time"
                        ampm={false}
                        ampmInClock={true}
                        onChange={(newValue) => handleChange(newValue, 1)} // Second Picker
                    />
                </DemoContainer>
                <div>
                    {selectedDateTimes.length > 0 && (
                        <>
                            {selectedDateTimes.map((dateTimeInfo, index) => (
                                <div key={index}>
                                    <p>
                                        Selected Date/Time {index + 1}:{" "}
                                        {dateTimeInfo.dateTime.format(
                                            "YYYY-MM-DD HH:mm"
                                        )}
                                    </p>
                                </div>
                            ))}
                            {timeDifference && (
                                <p>Time Difference: {timeDifference}</p>
                            )}
                        </>
                    )}
                </div>
            </LocalizationProvider>
        </div>
    );
}
