"use client";
import React, { useState, useEffect } from "react";
import ListProblemReport from "./ListProblemReport";

export default function CardProblemReport() {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        // ข้อมูลจำลองของอีเมล
        const emails = [
            {
                from: "john.doe@example.com",
                subject: "Meeting Reminder",
                receivedDate: "2024-09-20T10:30:00Z",
                content:
                    "This is a reminder for our meeting scheduled on 20th September.",
                isRead: true,
            },
            {
                from: "jane.smith@example.com",
                subject: "Project Update",
                receivedDate: "2024-09-21T14:45:00Z",
                content: "Here is the latest update on the project...",
                isRead: false,
            },
            {
                from: "newsletter@company.com",
                subject: "Monthly Newsletter",
                receivedDate: "2024-09-22T08:00:00Z",
                content: "Welcome to our monthly newsletter...",
                isRead: true,
            },
            {
                from: "support@service.com",
                subject: "Support Ticket Update",
                receivedDate: "2024-09-23T16:15:00Z",
                content: "Your support ticket has been updated...",
                isRead: false,
            },
            {
                from: "friend@example.com",
                subject: "Catch Up Soon!",
                receivedDate: "2024-09-24T12:00:00Z",
                content: "Hey, let’s catch up soon! How about this weekend?",
                isRead: false,
            },
            // เพิ่มข้อมูลอีก 50 ข้อมูล
            ...Array.from({ length: 50 }, (_, i) => ({
                from: `user${i}@example.com`,
                subject: `Subject ${i}`,
                receivedDate: `2024-09-${Math.floor(Math.random() * 30 + 1)
                    .toString()
                    .padStart(2, "0")}T${Math.floor(Math.random() * 24)
                    .toString()
                    .padStart(2, "0")}:${Math.floor(Math.random() * 60)
                    .toString()
                    .padStart(2, "0")}:00Z`,
                content: `This is the content of email ${i}.`,
                isRead: Math.random() > 0.5,
            })),
        ];

        // ตั้งค่าอีเมลใน state
        setEmails(emails);
    }, []);

    const readItClick = (email) => {
        setEmails((prevEmails) =>
            prevEmails.map((e) =>
                e.subject === email.subject ? { ...e, isRead: true } : e
            )
        );
    };

    return (
        <div>
            <ListProblemReport emails={emails} readItClick={readItClick} />
        </div>
    );
}
