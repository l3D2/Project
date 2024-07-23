"use client";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";

const startDate = new Date(2023, 6, 23); // เริ่มต้นวันที่ 23 ก.ค. 2023 (เดือนมีค่าเริ่มต้นที่ 0)
const endDate = new Date(2024, 6, 23); // สิ้นสุดวันที่ 23 ก.ค. 2024 (เดือนมีค่าเริ่มต้นที่ 0)
const timeData = [];

let currentDate = new Date(startDate);

while (currentDate <= endDate) {
    const date = new Date(currentDate); // สร้างวันที่ใหม่โดยใช้ currentDate

    // เซ็ตเวลาเป็นเที่ยงคืน (00:00:00)
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    timeData.push(date);

    // เพิ่มวันที่ใน currentDate ให้เป็นวันถัดไป
    currentDate.setDate(currentDate.getDate() + 1);
}

// ตรวจสอบผลลัพธ์
console.log(timeData);

const y1 = [5, 5, 10, 90, 85, 70, 30, 25, 25];
const y2 = [90, 85, 70, 25, 23, 40, 45, 40, 50];

const valueFormatter = (date) =>
    date.getHours() === 0
        ? date.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
          })
        : date.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
          });

const config = {
    series: [{ data: y1 }],
    height: 300,
};
const xAxisCommon = {
    data: timeData,
    scaleType: "time",
    valueFormatter,
};
export default function TickNumber() {
    return (
        <Box sx={{ width: "100%", maxWidth: 800 }}>
            <LineChart
                xAxis={[
                    {
                        ...xAxisCommon,
                        tickMinStep: 3600 * 1000 * 24, // min step: 24h
                    },
                    {
                        ...xAxisCommon,
                        id: "half days",
                        tickMinStep: 3600 * 1000 * 12, // min step: 12hu
                    },
                ]}
                {...config}
            />
        </Box>
    );
}
