import React from "react";

function DeviceSelect({
    selectedDeviceId,
    handleDeviceIdChange,
    uniqueDeviceIds,
}) {
    return (
        <div>
            <label htmlFor="device-select">Select Device ID:</label>
            <select
                id="device-select"
                value={selectedDeviceId}
                onChange={handleDeviceIdChange}
            >
                <option value="">--Select Device ID--</option>
                {uniqueDeviceIds.map((deviceId) => (
                    <option key={deviceId} value={deviceId}>
                        {deviceId}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DeviceSelect;
