"use client";
//Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import DevicesIcon from "@mui/icons-material/Devices";
import ReportIcon from "@mui/icons-material/Report";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VerifiedIcon from "@mui/icons-material/Verified";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PersonIcon from "@mui/icons-material/Person";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import bcrypt from "bcryptjs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Navbar({ session }) {
  const [countDevices, setCountDevices] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility
  const [retryCount, setRetryCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: !session?.user?.name ? "N/A" : session?.user?.name,
    email: !session?.user?.email ? "N/A" : session?.user?.email,
    image: !session?.user?.image ? "N/A" : session?.user?.image,
  });
  const MySwal = withReactContent(Swal);

  const handleImageError = (e) => {
    if (retryCount < 3) {
      // Retry up to 3 times
      setRetryCount(retryCount + 1);
      setTimeout(() => {
        e.target.src = session?.user?.image;
      }, 2000 * retryCount); // Exponential backoff
    } else {
      e.target.src = ""; // Use fallback after retries
    }
  };

  const fetchCountDevices = async () => {
    const id = session?.user?.id;
    try {
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
      if (res.ok && json.status !== 404) {
        setCountDevices(json);
      } else {
        console.error("Failed to fetch device count:");
        throw new Error("Failed to fetch device count.");
      }
    } catch (err) {
      console.error("Failed to fetch device count:");
    }
  };

  const [focusPwd, setfocusPwd] = React.useState(false);
  const [focuscfPwd, setfocuscfPwd] = React.useState(false);
  const [statusPwd, setStatusPwd] = React.useState({
    isCount: false,
    hasLower: false,
    hasUpper: false,
    hasDigit: false,
    hasSpecialChar: false,
    isPasswordMatch: false,
  });
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [vaildateForm, setVaildateForm] = React.useState(false);

  const handleFocus = (e) => {
    if (e.target.name == "password") setfocusPwd(~focusPwd);
    else setfocuscfPwd(~focuscfPwd);
  };

  const handleOnChange = (e) => {
    if (e.target.name === "password") {
      const password = e.target.value;
      setPassword(password);
      const passwordRequirements = {
        isCount: password.length >= 8,
        hasLower: /[a-z]/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasDigit: /\d/.test(password),
        hasSpecialChar: /[@$!%*?&]/.test(password),
      };

      // Update `statusPwd` state using spread syntax and computed property names
      setStatusPwd({
        ...statusPwd,
        ...passwordRequirements,
      });
    } else if (e.target.name === "cfpassword") {
      const confirmPassword = e.target.value;
      setPasswordConfirm(confirmPassword);
      setStatusPwd({
        ...statusPwd,
        isPasswordMatch: confirmPassword === password,
      });
    }
  };

  React.useEffect(() => {
    if (
      statusPwd.isCount &&
      statusPwd.hasLower &&
      statusPwd.hasUpper &&
      statusPwd.hasDigit &&
      statusPwd.hasSpecialChar &&
      statusPwd.isPasswordMatch
    ) {
      setVaildateForm(true);
    } else {
      setVaildateForm(false);
    }
  });

  const handleProfile = () => {
    setIsOpen(!isOpen);
  };

  const handleUpdateProfile = async () => {
    let data;
    if (!vaildateForm && password != "") {
      const passwordHash = await bcrypt.hash(password, 10);
      data = JSON.stringify({
        email: profile.email,
        name: profile.name,
        password: passwordHash,
      });
    } else {
      data = JSON.stringify({ email: profile.email, name: profile.name });
    }
    try {
      const res = await fetch("https://api.bd2-cloud.net/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      const json = await res.json();
      if (res.ok && json.status !== 404) {
        setIsOpen(!isOpen);
        MySwal.fire({
          title: "Successfull",
          text: "Update profile successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Failed to update user profile:");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 550,
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: "10px",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  useEffect(() => {
    if (session) fetchCountDevices();
  }, [session]);

  const handleSignOut = async () => {
    try {
      const res = await fetch(
        "https://api.bd2-cloud.net/api/user/updateStatus",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: profile.email, status: 0 }),
        }
      );
      const json = await res.json();
      if (res.ok && json.status !== 404) {
        console.log("User status updated successfully.");
        MySwal.fire({
          title: "Successfull",
          text: "Sign out successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(async () => {
          await signOut({ callbackUrl: "/" });
        });
      } else {
        console.error("Failed to update user status:");
        throw new Error("Failed to update user status.");
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
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
        <MenuIcon className="text-gray-900 dark:text-white" />
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
                alt="Profile Image"
                width={75}
                height={75}
                style={{ borderRadius: "5%" }}
                onError={handleImageError}
              />
            </div>
            <div className="ml-3">
              <span style={{ fontSize: "14px" }}>
                Hello 👋{" "}
                <span className="inline-flex items-center px-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                  <VerifiedIcon className="mr-1" style={{ fontSize: "12px" }} />
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
          {session?.user?.role == "U" ? (
            <>
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
                    onClick={handleProfile}
                    className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                  >
                    <PersonIcon />
                    <span className="ms-3">Profile</span>
                  </a>
                </li>
              </ul>
            </>
          ) : (
            <>
              <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                <h6 className="text-center text-gray-800 dark:text-gray-500">
                  Menu
                </h6>
                <li>
                  <a
                    href="/admin/dashboard"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <DashboardIcon />
                    <span className="ms-3">Dashboard</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/devices"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <DevicesIcon />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Devices
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/report"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <ReportIcon />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Report
                    </span>
                  </a>
                </li>
              </ul>
            </>
          )}
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
      <Modal open={isOpen} onClose={handleProfile}>
        <Box sx={{ ...style, width: 400 }}>
          <div className="flex justify-center items-center">
            <div className="w-[400px] h-[300px] bg-white rounded-lg text-black">
              <div className="flex justify-center items-center p-3">
                <h1 className="text-xl font-semibold">Profile</h1>
              </div>
              <div className="flex justify-center items-center mb-2">
                <img
                  src={session?.user?.image}
                  alt="Profile Image"
                  width={80}
                  height={80}
                  style={{ borderRadius: "5%" }}
                  onError={handleImageError}
                />
              </div>
              <div className="mb-2 flex justify-center">
                <TextField
                  className="mb-2"
                  id="name"
                  label="Name"
                  onChange={(e) => {
                    setValue((prevState) => ({
                      ...prevState,
                      ["name"]: e.target.value,
                    }));
                  }}
                  value={profile.name}
                  sx={{
                    width: 300,
                    "& .MuiInputBase-root": {
                      color: "black", // Font color for the input text
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "gray", // Default border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black", // Border color on hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black", // Border color when focused
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "gray", // Label color
                      "&.Mui-focused": {
                        color: "black", // Label color when focused
                      },
                    },
                  }}
                />
              </div>
              <div className="mb-2 flex justify-center">
                <TextField
                  id="email"
                  label="Email"
                  value={profile.email}
                  disabled
                  sx={{
                    width: 300,
                    "& .MuiInputBase-root": {
                      color: "black", // Font color for the input text
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "gray", // Default border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "gray", // Border color on hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black", // Border color when focused
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "gray", // Label color
                      "&.Mui-focused": {
                        color: "black", // Label color when focused
                      },
                    },
                  }}
                />
              </div>
              <div className="flex flex-row justify-center mb-8">
                <span className="absolute bg-white px-4 text-gray-500">
                  reset password
                </span>
                <div className="w-full bg-gray-400 mt-3 h-px"></div>
              </div>
              <div className="flex flex-col justify-center">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Password
                </label>
                <div>
                  <Tooltip
                    open={focusPwd}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    placement="right"
                    title={
                      <React.Fragment>
                        <div className="inline-flex items-center">
                          {statusPwd.isCount ? (
                            <CheckCircleIcon className="mr-1 text-sm text-green-400" />
                          ) : (
                            <ErrorIcon className="mr-1 text-sm text-red-400" />
                          )}
                          {"Minimum length of 8 characters"}
                        </div>
                        <br />
                        <div className="inline-flex items-center">
                          {statusPwd.hasLower ? (
                            <CheckCircleIcon className="mr-1 text-sm text-green-400" />
                          ) : (
                            <ErrorIcon className="mr-1 text-sm text-red-400" />
                          )}
                          {"At least one lowercase letter"}
                        </div>
                        <br />
                        <div className="inline-flex items-center">
                          {statusPwd.hasUpper ? (
                            <CheckCircleIcon className="mr-1 text-sm text-green-400" />
                          ) : (
                            <ErrorIcon className="mr-1 text-sm text-red-400" />
                          )}
                        </div>
                        {"At least one uppercase letter"}
                        <br />
                        <div className="inline-flex items-center">
                          {statusPwd.hasDigit ? (
                            <CheckCircleIcon className="mr-1 text-sm text-green-400" />
                          ) : (
                            <ErrorIcon className="mr-1 text-sm text-red-400" />
                          )}
                          {"At least one digit"}
                        </div>
                        <br />
                        <div className="inline-flex items-center">
                          {statusPwd.hasSpecialChar ? (
                            <CheckCircleIcon className="mr-1 text-sm text-green-400" />
                          ) : (
                            <ErrorIcon className="mr-1 text-sm text-red-400" />
                          )}
                          {"At least one special character"}
                        </div>
                      </React.Fragment>
                    }
                    arrow
                  >
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      onChange={handleOnChange}
                      onFocus={handleFocus}
                      onBlur={handleFocus}
                      value={password == "" ? "" : password}
                      className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    />
                  </Tooltip>
                </div>

                <label
                  htmlFor="cfpassword"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Comfirm Password
                </label>
                <div>
                  <Tooltip
                    open={focuscfPwd}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    placement="right"
                    title={
                      <React.Fragment>
                        <div className="inline-flex items-center">
                          {statusPwd.isPasswordMatch ? (
                            <>
                              <CheckCircleIcon className="mr-1 text-sm text-green-400" />
                              <span>Password is match</span>
                            </>
                          ) : (
                            <>
                              <ErrorIcon className="mr-1 text-sm text-red-400" />
                              <span>Password isn&apos;t match</span>
                            </>
                          )}
                        </div>
                      </React.Fragment>
                    }
                    arrow
                  >
                    <input
                      type="password"
                      name="cfpassword"
                      id="cfpassword"
                      placeholder="Password"
                      onChange={handleOnChange}
                      onFocus={handleFocus}
                      onBlur={handleFocus}
                      value={passwordConfirm == "" ? "" : passwordConfirm}
                      className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                    />
                  </Tooltip>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    onClick={handleUpdateProfile}
                    className="p-2 my-2 bg-green-400 hover:bg-green-500 rounded"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
