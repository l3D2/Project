"use client";

import * as React from "react";
import bcrypt from "bcryptjs";
import Tooltip from "@mui/material/Tooltip";
import { signOut } from "next-auth/react";
//Icons
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function register() {
  const [UserData, setUserData] = React.useState({
    email: "",
    name: "",
    imgurl: "",
  });

  React.useEffect(() => {
    const searchParams = new URLSearchParams(
      window.location.search.split("?")[1]
    ); // Extract query string
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const imgurl = searchParams.get("imgurl");
    setUserData({ email, name, imgurl });
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hashedpassword = await bcrypt.hash(password, 10);
      const data = {
        email: UserData.email,
        name: UserData.name,
        imgurl: UserData.imgurl,
        password: hashedpassword,
      };

      const response = await fetch(
        "https://api.bd2-cloud.net/api/user/register",
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const json = await response.json();
      if (response.ok && json.status === 200) {
        console.log("Registration Successful!");
        handleSignOut();
      } else if (response.ok && json.status === 500) {
        alert("User is not registered.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <div className="flex justify-center min-h-screen bg-gray-100 antialiased">
        <div className="container sm:mt-40 mt-24 my-auto max-w-md border-2 border-gray-200 p-3 bg-white">
          <div className="text-center m-6">
            <h1 className="text-3xl font-semibold text-gray-700">Register</h1>
            <p className="text-gray-500">Sign up your account</p>
          </div>
          <div className="flex justify-center">
            <img
              src={UserData.imgurl}
              className=" rounded-full border-2 border-black"
            />
          </div>
          <div className="m-6">
            <img src="" alt="" srcSet="" />
            <form className="mb-4">
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Account Name
                </label>
                <input
                  type="text"
                  name="AccountName"
                  id="AccountName"
                  placeholder={UserData.name}
                  disabled
                  className="w-full px-3 py-2 mb-1 placeholder-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-white dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={UserData.email}
                  disabled
                  className="w-full px-3 py-2 mb-1 placeholder-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-white dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
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
              </div>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!vaildateForm}
                  className={
                    vaildateForm
                      ? "w-full px-3 py-3 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none duration-100 ease-in-out"
                      : "w-full px-3 py-3 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none duration-100 ease-in-out"
                  }
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
