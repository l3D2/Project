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

const filterDataByDate = (data, startDate, endDate) => {
  const start = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).startOf("day");
  console.log(start);
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
        EC: 0,
        Humidity: 0,
        PH: 0,
        Temp: 0,
        Temp_Water: 0,
        count: 0,
      };
    }
    aggregatedData[day].EC += item.EC;
    aggregatedData[day].Humidity += item.Humidity;
    aggregatedData[day].PH += item.PH;
    aggregatedData[day].Temp += item.Temp;
    aggregatedData[day].Temp_Water += item.Temp_Water;
    aggregatedData[day].count += 1;
  });

  return Object.keys(aggregatedData).map((day) => ({
    datetime: day,
    EC: aggregatedData[day].EC / aggregatedData[day].count,
    Humidity: aggregatedData[day].Humidity / aggregatedData[day].count,
    PH: aggregatedData[day].PH / aggregatedData[day].count,
    Temp: aggregatedData[day].Temp / aggregatedData[day].count,
    Temp_Water: aggregatedData[day].Temp_Water / aggregatedData[day].count,
  }));
};

const aggregateDataByMonth = (data) => {
  const aggregatedData = {};

  data.forEach((item) => {
    const month = dayjs(item.datetime).format("YYYY-MM");
    if (!aggregatedData[month]) {
      aggregatedData[month] = {
        EC: 0,
        Humidity: 0,
        PH: 0,
        Temp: 0,
        Temp_Water: 0,
        count: 0,
      };
    }
    aggregatedData[month].EC += item.EC;
    aggregatedData[month].Humidity += item.Humidity;
    aggregatedData[month].PH += item.PH;
    aggregatedData[month].Temp += item.Temp;
    aggregatedData[month].Temp_Water += item.Temp_Water;
    aggregatedData[month].count += 1;
  });

  return Object.keys(aggregatedData).map((month) => ({
    datetime: month,
    EC: aggregatedData[month].EC / aggregatedData[month].count,
    Humidity: aggregatedData[month].Humidity / aggregatedData[month].count,
    PH: aggregatedData[month].PH / aggregatedData[month].count,
    Temp: aggregatedData[month].Temp / aggregatedData[month].count,
    Temp_Water: aggregatedData[month].Temp_Water / aggregatedData[month].count,
  }));
};

const aggregateDataByYear = (data) => {
  const aggregatedData = {};

  data.forEach((item) => {
    const year = dayjs(item.datetime).format("YYYY");
    if (!aggregatedData[year]) {
      aggregatedData[year] = {
        EC: 0,
        Humidity: 0,
        PH: 0,
        Temp: 0,
        Temp_Water: 0,
        count: 0,
      };
    }
    aggregatedData[year].EC += item.EC;
    aggregatedData[year].Humidity += item.Humidity;
    aggregatedData[year].PH += item.PH;
    aggregatedData[year].Temp += item.Temp;
    aggregatedData[year].Temp_Water += item.Temp_Water;
    aggregatedData[year].count += 1;
  });

  return Object.keys(aggregatedData).map((year) => ({
    datetime: year,
    EC: aggregatedData[year].EC / aggregatedData[year].count,
    Humidity: aggregatedData[year].Humidity / aggregatedData[year].count,
    PH: aggregatedData[year].PH / aggregatedData[year].count,
    Temp: aggregatedData[year].Temp / aggregatedData[year].count,
    Temp_Water: aggregatedData[year].Temp_Water / aggregatedData[year].count,
  }));
};

export default function UserChart() {
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
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://api.bd2-cloud.net/api/data");
        setData(response.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // console.log(data);

  useEffect(() => {
    const filteredData = filterDataByDate(data, startDate, endDate);
    console.log(filteredData);

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
          data: processedData.map((items) => items.EC),
        },
        {
          label: "Humidity",
          backgroundColor: "rgba(250,192,192,0.4)",
          borderColor: "rgba(250,192,192,1)",
          data: processedData.map((items) => items.Humidity),
        },
        {
          label: "PH",
          backgroundColor: "rgba(250,234,192,0.4)",
          borderColor: "rgba(250,234,192,1)",
          data: processedData.map((items) => items.PH),
        },
        {
          label: "Air Temp",
          backgroundColor: "rgba(250,24,192,0.4)",
          borderColor: "rgba(250,24,192,1)",
          data: processedData.map((items) => items.Temp),
        },
        {
          label: "Water Temp",
          backgroundColor: "rgba(150,234,192,0.4)",
          borderColor: "rgba(150,234,192,1)",
          data: processedData.map((items) => items.Temp_Water),
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
