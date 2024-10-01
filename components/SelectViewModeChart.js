import React from "react";

function SelectViewModeChart({ viewMode, setViewMode }) {
  return (
    <div className="flex flex-col">
      <label htmlFor="device-select" className=" text-black">
        Select View Mode
      </label>
      <select
        id="viewmode-select"
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value)}
        className="w-fit h-fit text-black border-gray-400 border-2 hover:border-gray-600"
      >
        <option value="day">View by Day</option>
        <option value="month">View by Month</option>
        <option value="year">View by Year</option>
      </select>
    </div>
  );
}

export default SelectViewModeChart;
