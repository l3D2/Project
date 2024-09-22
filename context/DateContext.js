import React, { createContext, useState } from "react";
import dayjs from "dayjs";

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
    const [startDate, setStartDate] = useState(dayjs().subtract(15, "day"));
    const [endDate, setEndDate] = useState(dayjs());

    return (
        <DateContext.Provider
            value={{ startDate, setStartDate, endDate, setEndDate }}
        >
            {children}
        </DateContext.Provider>
    );
};
