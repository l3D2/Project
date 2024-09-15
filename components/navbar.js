"use client";
//Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import DevicesIcon from "@mui/icons-material/Devices";
import ReportIcon from "@mui/icons-material/Report";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import VerifiedIcon from "@mui/icons-material/Verified";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function Navbar({ session }) {
    const [countDevices, setCountDevices] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility

    const fetchCountDevices = async () => {
        const id = session.user.id;
        const res = await fetch(
            `https://api.bd2-cloud.net/api/device/getCount/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const json = await res.json();
        if (res.ok) {
            setCountDevices(json);
        } else {
            console.error("Failed to fetch device count:");
        }
    };

    useEffect(() => {
        fetchCountDevices();
    }, []);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <button
                data-drawer-target="separator-sidebar"
                data-drawer-toggle="separator-sidebar"
                aria-controls="separator-sidebar"
                type="button"
                onClick={toggleSidebar} // Toggle sidebar visibility
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon className="text-gray-900" />
            </button>

            <aside
                id="separator-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform lg:translate-x-0 max-xl:w-60 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`} // Apply class based on state
                aria-label="Sidebar"
            >
                <div className="relative h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <div className="flex items-center">
                        <div>
                            <img
                                src={session?.user?.image}
                                alt=""
                                width={75}
                                height={75}
                                style={{ borderRadius: "5%" }}
                            />
                        </div>
                        <div className="ml-3">
                            <span style={{ fontSize: "14px" }}>
                                Hello 👋{" "}
                                <span className="inline-flex items-center px-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                    <VerifiedIcon
                                        className="mr-1"
                                        style={{ fontSize: "12px" }}
                                    />
                                    {session?.user?.role == "U"
                                        ? "User"
                                        : session?.user?.role == "A"
                                        ? "Admin"
                                        : "Dev"}
                                </span>
                                <p className="text-sm">{session?.user?.name}</p>
                                <p className="text-[13px] text-gray-300">
                                    {session?.user?.email}
                                </p>
                            </span>
                        </div>
                    </div>
                    <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                        <h6 className="text-center text-gray-800 dark:text-gray-500">
                            Menu
                        </h6>
                        <li>
                            <a
                                href="/dashboard"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <DashboardIcon />
                                <span className="ms-3">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/devices"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <DevicesIcon />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Devices
                                </span>
                                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                    {countDevices}
                                </span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/report"
                                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <ReportIcon />
                                <span className="flex-1 ms-3 whitespace-nowrap">
                                    Report
                                </span>
                            </a>
                        </li>
                    </ul>
                    <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                        <h6 className="text-center text-gray-800 dark:text-gray-500">
                            Setting
                        </h6>
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                            >
                                <NotificationsIcon />
                                <span className="ms-3">Notification</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                            >
                                <ContactPageIcon />
                                <span className="ms-3">Contact us</span>
                            </a>
                        </li>
                    </ul>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            onClick={handleSignOut}
                            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mb-2 mt-5"
                        >
                            <LogoutIcon className="text-sm me-2" />
                            Logout
                        </button>
                    </div>
                    {/* left-56 */}
                    <button
                        className="absolute top-1/2 left-52 p-3 bg-gray-700 rounded-full lg:hidden hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        type="button"
                        onClick={toggleSidebar}
                    >
                        <ArrowBackIosIcon className="text-xs" />
                    </button>
                </div>
            </aside>
        </>
    );
}
