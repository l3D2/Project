"use client";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";

import {
  Chart,
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

import { Line } from "react-chartjs-2";
import DateRangePicker from "./DateRangePicker";
import SelectViewModeChart from "./SelectViewModeChart";

Chart.register(
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

// ฟังก์ชันนับจำนวน device_id ที่ไม่ซ้ำกันจากวันเดียวกัน
const countUniqueItems = (data, field, keyName = "stockDevice") => {
  const dateObject = {};
  if (data.length > 0) {
    data.forEach((item) => {
      const date = dayjs(item.datetime).format("YYYY-MM-DD");
      if (!dateObject[date]) {
        dateObject[date] = new Set();
      }
      dateObject[date].add(item[field]);
    });

    const result = Object.keys(dateObject).map((date) => ({
      [keyName]: dateObject[date].size,
      datetime: date,
    }));

    return result;
  }
};

const filterDataByDate = (data, startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return data.filter((item) => {
    const date = dayjs(item.datetime);
    return date.isAfter(start) && date.isBefore(end);
  });
};

const aggregateDataByDay = (data) => {
  const aggregatedData = {};
  if (data.length > 0) {
    data.forEach((item) => {
      const day = dayjs(item.datetime).format("YYYY-MM-DD");
      if (!aggregatedData[day]) {
        aggregatedData[day] = {
          device: 0,
          report: 0,
          count: 0,
        };
      }
      aggregatedData[day].device += item.device;
      aggregatedData[day].report += item.report; // นับจำนวนจริงจาก item.report
      aggregatedData[day].count += 1;
    });

    return Object.keys(aggregatedData).map((day) => ({
      datetime: day,
      device: Math.round(
        aggregatedData[day].device / aggregatedData[day].count
      ),
      report: aggregatedData[day].report, // ส่งค่า report ที่นับจำนวนจริงไป
    }));
  }
};

const aggregateDataByMonth = (data) => {
  const aggregatedData = {};

  data.forEach((item) => {
    const month = dayjs(item.datetime).format("YYYY-MM");
    if (!aggregatedData[month]) {
      aggregatedData[month] = {
        device: 0,
        report: 0,
        count: 0,
      };
    }
    aggregatedData[month].device += item.device;
    aggregatedData[month].report += item.report; // นับจำนวนจริงจาก item.report
    aggregatedData[month].count += 1;
  });

  return Object.keys(aggregatedData).map((month) => ({
    datetime: month,
    device: Math.round(
      aggregatedData[month].device / aggregatedData[month].count
    ),
    report: aggregatedData[month].report, // ส่งค่า report ที่นับจำนวนจริงไป
  }));
};

const aggregateDataByYear = (data) => {
  const aggregatedData = {};

  data.forEach((item) => {
    const year = dayjs(item.datetime).format("YYYY");
    if (!aggregatedData[year]) {
      aggregatedData[year] = {
        device: 0,
        report: 0,
        count: 0,
      };
    }
    aggregatedData[year].device += item.device;
    aggregatedData[year].report += item.report; // นับจำนวนจริงจาก item.report
    aggregatedData[year].count += 1;
  });

  return Object.keys(aggregatedData).map((year) => ({
    datetime: year,
    device: Math.round(
      aggregatedData[year].device / aggregatedData[year].count
    ),
    report: aggregatedData[year].report, // ส่งค่า report ที่นับจำนวนจริงไป
  }));
};

const getDeviceIds = (data) => {
  const deviceIds = data.map((item) => item.device_id);
  return [...new Set(deviceIds)];
};

export default function AdminChart() {
  const [data, setData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(dayjs().subtract(15, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("day"); // "day", "month", "year"
  const [uniqueDeviceIds, setUniqueDeviceIds] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [optionsChart, setOptionsChart] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Device",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        data: [],
      },
      {
        label: "Report",
        data: [],
      },
    ],
  });

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://api.bd2-cloud.net/api/data");
        const response2 = await axios.get(
          "https://api.bd2-cloud.net/api/report"
        );
        setData(response.data);
        if (response2.data.status != 404) setReportData(response2.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  // console.log(reportData);

  useEffect(() => {
    if (uniqueDeviceIds.length > 0) {
      setSelectedDeviceId(uniqueDeviceIds[0]);
    }
  }, [uniqueDeviceIds]);

  useEffect(() => {
    const deviceResult = countUniqueItems(data, "device_id", "device");
    const reportResult = countUniqueItems(reportData, "id", "report");
    if (deviceResult !== undefined && reportResult !== undefined) {
      const combinedData = deviceResult.map((deviceItem) => {
        const reportItem = reportResult.find(
          (reportItem) => reportItem.datetime === deviceItem.datetime
        );
        return {
          ...deviceItem,
          report: reportItem ? reportItem.report : null,
        };
      });
      const filteredData = filterDataByDate(combinedData, startDate, endDate);
      const processedData =
        viewMode === "month"
          ? aggregateDataByMonth(filteredData)
          : viewMode === "year"
          ? aggregateDataByYear(filteredData)
          : viewMode === "day"
          ? aggregateDataByDay(filteredData)
          : filteredData;
      const processedData2 = filterDataByDate(reportData, startDate, endDate);
      if (processedData2.length > 0) {
        setChartData({
          labels: processedData.map((items) =>
            dayjs(items.datetime).format(
              viewMode === "year"
                ? "YYYY"
                : viewMode === "month"
                ? "MM/YYYY"
                : "DD/MM/YYYY"
            )
          ),
          datasets: [
            {
              label: "Device",
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              data: processedData.map((items) => items.device),
            },
            {
              label: "Report",
              backgroundColor: "rgba(250,192,192,0.4)",
              borderColor: "rgba(250,192,192,1)",
              data: processedData.map((items) => items.report),
            },
          ],
        });
      }
    }
    setOptionsChart({
      responsive: true,
      maintainAspectRatio: false,
    });
  }, [selectedDeviceId, startDate, endDate, viewMode, data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="p-4">
        <div className="flex space-x-4 items-center justify-center">
          <DateRangePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
          <SelectViewModeChart viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <div className="w-full h-72 mt-10">
          <Line data={chartData} options={optionsChart} />
        </div>
      </div>
    </>
  );
}
