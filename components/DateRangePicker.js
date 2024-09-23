import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";

function DateRangePicker({ startDate, setStartDate, endDate, setEndDate }) {
  return (
    <div className="flex space-x-4 items-center justify-center  ">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date and Time"
          value={startDate}
          format="DD/MM/YYYY"
          onChange={(newValue) => {
            setStartDate(newValue);
          }}
          shouldDisableDate={(date) => endDate && date.isAfter(endDate, "day")}
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
          shouldDisableDate={(date) =>
            startDate && date.isBefore(startDate, "day")
          }
        />
      </LocalizationProvider>
    </div>
  );
}

export default DateRangePicker;
