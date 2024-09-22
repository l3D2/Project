import React from "react";

function SelectViewModeChart({ viewMode, setViewMode }) {
    return (
        <div>
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
    );
}

export default SelectViewModeChart;
