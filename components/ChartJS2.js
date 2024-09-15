"use clients";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

import dayjs from "dayjs";

export default function ChartJS2() {
    const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
    const [endDate, setEndDate] = useState(dayjs());
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    "https://api.bd2-cloud.net/api/data"
                );
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
    console.log(data);
    const dataTemp = {
        labels: [
            "01/01/2024",
            "02/01/2024",
            "03/01/2024",
            "04/01/2024",
            "05/01/2024",
            "06/01/2024",
            "07/01/2024",
        ],
        datasets: [
            {
                label: "My First dataset",
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };
    console.log(dayjs(endDate).format());
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(dayjs(newValue))}
                    format="DD/MM/YYYY"
                    renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(dayjs(newValue))}
                    format="DD/MM/YYYY"
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <Line data={dataTemp} options={options} />
        </div>
    );
}
