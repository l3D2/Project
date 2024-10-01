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
import DateRangePicker from "@/components/DateRangePicker";
import SelectViewModeChart from "@/components/SelectViewModeChart";

Chart.register(
  PointElement,
  LineElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const filterDataByDate = (data, startDate, endDate) => {
  const start = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).startOf("day");
  //console.log(start);
  return data.filter((item) => {
    const date = dayjs(item.datetime).startOf("day");
    return (
      date.isSame(start) ||
      date.isSame(end) ||
      (date.isAfter(start) && date.isBefore(end))
    );
  });
};

const aggregateDataByDay = (data) => {
  // console.log(data);
  const aggregatedData = {};

  data.forEach((item) => {
    const day = dayjs(item.datetime).format("YYYY-MM-DD");
    if (!aggregatedData[day]) {
      aggregatedData[day] = {
        ec: 0,
        h: 0,
        ph: 0,
        ta: 0,
        t: 0,
        count: 0,
      };
    }
    aggregatedData[day].ec += item.ec;
    aggregatedData[day].h += item.h;
    aggregatedData[day].ph += item.ph;
    aggregatedData[day].ta += item.ta;
    aggregatedData[day].t += item.t;
    aggregatedData[day].count += 1;
  });

  return Object.keys(aggregatedData).map((day) => ({
    datetime: day,
    ec: Math.round(aggregatedData[day].ec / aggregatedData[day].count),
    h: Math.round(aggregatedData[day].h / aggregatedData[day].count),
    ph: Math.round(aggregatedData[day].ph / aggregatedData[day].count),
    ta: Math.round(aggregatedData[day].ta / aggregatedData[day].count),
    t: Math.round(aggregatedData[day].t / aggregatedData[day].count),
  }));
};

const aggregateDataByMonth = (data) => {
  const aggregatedData = {};

  data.forEach((item) => {
    const month = dayjs(item.datetime).format("YYYY-MM");
    if (!aggregatedData[month]) {
      aggregatedData[month] = {
        ec: 0,
        h: 0,
        ph: 0,
        ta: 0,
        t: 0,
        count: 0,
      };
    }
    aggregatedData[month].ec += item.ec;
    aggregatedData[month].h += item.h;
    aggregatedData[month].ph += item.ph;
    aggregatedData[month].ta += item.ta;
    aggregatedData[month].t += item.t;
    aggregatedData[month].count += 1;
  });

  return Object.keys(aggregatedData).map((month) => ({
    datetime: month,
    ec: Math.round(aggregatedData[month].ec / aggregatedData[month].count),
    h: Math.round(aggregatedData[month].h / aggregatedData[month].count),
    ph: Math.round(aggregatedData[month].ph / aggregatedData[month].count),
    ta: Math.round(aggregatedData[month].ta / aggregatedData[month].count),
    t: Math.round(aggregatedData[month].t / aggregatedData[month].count),
  }));
};

const aggregateDataByYear = (data) => {
  const aggregatedData = {};

  data.forEach((item) => {
    const year = dayjs(item.datetime).format("YYYY");
    if (!aggregatedData[year]) {
      aggregatedData[year] = {
        ec: 0,
        h: 0,
        ph: 0,
        ta: 0,
        t: 0,
        count: 0,
      };
    }
    aggregatedData[year].ec += item.ec;
    aggregatedData[year].h += item.h;
    aggregatedData[year].ph += item.ph;
    aggregatedData[year].ta += item.ta;
    aggregatedData[year].t += item.t;
    aggregatedData[year].count += 1;
  });

  return Object.keys(aggregatedData).map((year) => ({
    datetime: year,
    ec: Math.round(aggregatedData[year].ec / aggregatedData[year].count),
    h: Math.round(aggregatedData[year].h / aggregatedData[year].count),
    ph: Math.round(aggregatedData[year].ph / aggregatedData[year].count),
    ta: Math.round(aggregatedData[year].ta / aggregatedData[year].count),
    t: Math.round(aggregatedData[year].t / aggregatedData[year].count),
  }));
};

export default function UserChart({ rdata }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(dayjs().subtract(15, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("day"); // "day", "month", "year"
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
    setData(rdata);
  }, []);

  useEffect(() => {
    const filteredData = filterDataByDate(data, startDate, endDate);

    const processedData =
      viewMode === "month"
        ? aggregateDataByMonth(filteredData)
        : viewMode === "year"
        ? aggregateDataByYear(filteredData)
        : viewMode === "day"
        ? aggregateDataByDay(filteredData)
        : filteredData;

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
          label: "EC",
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          data: processedData.map((items) => items.ec),
        },
        {
          label: "Humidity",
          backgroundColor: "rgba(250,192,192,0.4)",
          borderColor: "rgba(250,192,192,1)",
          data: processedData.map((items) => items.h),
        },
        {
          label: "PH",
          backgroundColor: "rgba(250,234,192,0.4)",
          borderColor: "rgba(250,234,192,1)",
          data: processedData.map((items) => items.ph),
        },
        {
          label: "Air Temp",
          backgroundColor: "rgba(250,24,192,0.4)",
          borderColor: "rgba(250,24,192,1)",
          data: processedData.map((items) => items.ta),
        },
        {
          label: "Water Temp",
          backgroundColor: "rgba(150,234,192,0.4)",
          borderColor: "rgba(150,234,192,1)",
          data: processedData.map((items) => items.t),
        },
      ],
    });

    setOptionsChart({
      responsive: true,
      maintainAspectRatio: false,
    });
  }, [startDate, endDate, viewMode, data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  //console.log("Data chart f", chartData);
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
