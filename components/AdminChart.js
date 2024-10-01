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
const countUniqueDevices = (data) => {
  const dateObject = {};

  data.forEach((item) => {
    const date = dayjs(item.datetime).format("YYYY-MM-DD");
    if (!dateObject[date]) {
      dateObject[date] = new Set();
    }
    dateObject[date].add(item.device_id);
  });

  const result = Object.keys(dateObject).map((date) => ({
    stockDevice: dateObject[date].size,
    datetime: date,
  }));

  return result;
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
  console.log("Day", data);
  const aggregatedData = {};

  data.forEach((item) => {
    const day = dayjs(item.datetime).format("YYYY-MM-DD");
    if (!aggregatedData[day]) {
      aggregatedData[day] = {
        stockDevice: 0,
        count: 0,
      };
    }
    aggregatedData[day].stockDevice += item.stockDevice;
    aggregatedData[day].count += 1;
  });

  return Object.keys(aggregatedData).map((day) => ({
    datetime: day,
    stockDevice: Math.round(
      aggregatedData[day].stockDevice / aggregatedData[day].count
    ),
  }));
};

const aggregateDataByMonth = (data) => {
  const aggregatedData = {};

  data.forEach((item) => {
    const month = dayjs(item.datetime).format("YYYY-MM");
    if (!aggregatedData[month]) {
      aggregatedData[month] = {
        stockDevice: 0,
        count: 0,
      };
    }
    aggregatedData[month].stockDevice += item.stockDevice;
    aggregatedData[month].count += 1;
  });

  return Object.keys(aggregatedData).map((month) => ({
    datetime: month,
    stockDevice: Math.round(
      aggregatedData[month].stockDevice / aggregatedData[month].count
    ),
  }));
};

const aggregateDataByYear = (data) => {
  const aggregatedData = {};

  data.forEach((item) => {
    const year = dayjs(item.datetime).format("YYYY");
    if (!aggregatedData[year]) {
      aggregatedData[year] = {
        stockDevice: 0,
        count: 0,
      };
    }
    aggregatedData[year].stockDevice += item.stockDevice;
    aggregatedData[year].count += 1;
  });

  return Object.keys(aggregatedData).map((year) => ({
    datetime: year,
    stockDevice: Math.round(
      aggregatedData[year].stockDevice / aggregatedData[year].count
    ),
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
        label: "EC",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        data: [],
      },
      {
        label: "Humidity",
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
        setReportData(response2.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (uniqueDeviceIds.length > 0) {
      setSelectedDeviceId(uniqueDeviceIds[0]);
    }
  }, [uniqueDeviceIds]);

  useEffect(() => {
    const result = countUniqueDevices(data);

    const filteredData = filterDataByDate(result, startDate, endDate);
    const processedData =
      viewMode === "month"
        ? aggregateDataByMonth(filteredData)
        : viewMode === "year"
        ? aggregateDataByYear(filteredData)
        : viewMode === "day"
        ? aggregateDataByDay(filteredData)
        : filteredData;
    const processedData2 = filterDataByDate(reportData, startDate, endDate);
    console.log("PCD1", processedData);
    console.log("PCD2", processedData2);
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
          data: processedData.map((items) => items.stockDevice),
        },
        {
          label: "Report",
          backgroundColor: "rgba(250,192,192,0.4)",
          borderColor: "rgba(250,192,192,1)",
          data: processedData2.map((items) => items.report),
        },
      ],
    });

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
