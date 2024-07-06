"use client";

import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useSession } from "next-auth/react";
export default function register() {
  return (
    <>
      <div className="flex justify-center min-h-screen bg-gray-100 antialiased">
        <div className="container sm:mt-40 mt-24 my-auto max-w-md border-2 border-gray-200 p-3 bg-white">
          <div className="text-center m-6">
            <h1 className="text-3xl font-semibold text-gray-700">Register</h1>
            <p className="text-gray-500">Sign up your account</p>
          </div>

          <div className="m-6">
            <img src="" alt="" srcset="" />
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
                  placeholder="Account Name"
                  className="w-full px-3 py-2 mb-1 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
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
                  placeholder="Email address"
                  className="w-full px-3 py-2 mb-1 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
                <label
                  htmlFor="AccountName"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="email"
                  id="email"
                  placeholder="Password"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />

                <label
                  htmlFor="AccountName"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Comfirm Password
                </label>
                <input
                  type="password"
                  name="email"
                  id="email"
                  placeholder="Password"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
              </div>
              <div className="mb-6">
                <button
                  type="button"
                  className="w-full px-3 py-3 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none duration-100 ease-in-out"
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
