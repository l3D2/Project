"use client";
import React, { useState, useEffect } from "react";
import ListProblemReport from "./ListProblemReport";

export default function CardProblemReport() {
  const [report, setReport] = useState([
    {
      id: "N/A",
      uid: "N/A",
      name: "N/A",
      hwid: "N/A",
      date: "N/A",
      topic: "N/A",
      detail: "N/A",
      status: "N/A",
    },
  ]);

  const fetchReport = async () => {
    const res = await fetch(`https://api.bd2-cloud.net/api/report`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    const result = Object.values(json).map((item) => ({
      id: item.id,
      uid: item.accID,
      name: item.name,
      hwid: item.device_id,
      date: item.datetime,
      topic: item.topic,
      detail: item.detail,
      status: item.status,
    }));
    setReport(result);
  };

  useEffect(() => {
    fetchReport();
    const interval = setInterval(() => {
      fetchReport();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const readItClick = async (email) => {
    setReport((prevEmails) =>
      prevEmails.map((e) => (e.topic === email.topic ? { ...e, status: 1 } : e))
    );
    const res = await fetch(`https://api.bd2-cloud.net/api/report`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: email.id,
        status: 1,
      }),
    });
    if (res.ok) {
      console.log("Status updated successfully");
    } else {
      console.log("Status update failed");
    }
  };
  return (
    <div>
      <ListProblemReport emails={report} readItClick={readItClick} />
    </div>
  );
}
