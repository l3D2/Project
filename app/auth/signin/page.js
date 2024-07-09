"use client";

import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function login() {
  const router = useRouter();
  const handleGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" }); //"/dashboard"
      //router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center min-h-screen bg-gray-100 antialiased">
        <div className="container sm:mt-40 mt-24 my-auto max-w-md border-2 border-gray-200 p-3 bg-white">
          <div className="text-center m-6">
            <h1 className="text-3xl font-semibold text-gray-700">
              Welcome back
            </h1>
            <p className="text-gray-500">Sign in into your account</p>
          </div>

          <div className="m-6">
            <form className="mb-4">
              <div className="mb-6">
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
                  htmlFor="email"
                  className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                />
              </div>
              <div className="mb-6">
                <button
                  type="button"
                  className="w-full px-3 py-3 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none duration-100 ease-in-out"
                >
                  SignIn
                </button>
              </div>
              <p className="text-sm text-center">
                <a
                  href="#!"
                  className="font-semibold text-gray-400 hover:text-gray-600 focus:outline-none focus:underline"
                >
                  Forgot password?
                </a>
              </p>
            </form>

            <div className="flex flex-row justify-center mb-8">
              <span className="absolute bg-white px-4 text-gray-500">
                or sign-in with
              </span>
              <div className="w-full bg-gray-200 mt-3 h-px"></div>
            </div>

            <div className="flex flex-row gap-2">
              <button
                type="submit"
                className=" bg-white border border-black text-black w-full p-2 flex flex-row justify-center gap-2 items-center rounded-sm hover:bg-gray-200 duration-100 ease-in-out"
                onClick={handleGoogle}
              >
                <GoogleIcon />
                Google
              </button>
              <button className="bg-gray-700 text-white w-full p-2 flex flex-row justify-center gap-2 items-center rounded-sm hover:bg-gray-800 duration-100 ease-in-out">
                <GitHubIcon />
                Github
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
