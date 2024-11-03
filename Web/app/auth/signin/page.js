"use client";

import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const result = await signIn("credentials", {
        email, // Username to Login
        password, // Password to Login
        redirect: false, // Prevent auto redirect
      });

      if (result?.error) {
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Gmail or password is incorrect.",
          toast: true,
          width: "25rem",
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        // Show success alert and redirect
        Swal.fire({
          icon: "success",
          title: "Signed in successfully",
          toast: true,
          width: "25rem",
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          router.replace("/dashboard"); // Redirect to dashboard
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: "Please try again later.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: "Please try again later.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 antialiased">
      <div className="container sm:mt-40 mt-24 my-auto max-w-md border-2 border-gray-200 p-3 bg-white">
        <div className="text-center m-6">
          <h1 className="text-3xl font-semibold text-gray-700">Welcome back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <div className="m-6">
          <form className="mb-4" onSubmit={handleLogin}>
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mb-1 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <div className="mb-6">
              <button
                type="submit"
                className="w-full px-3 py-3 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none duration-100 ease-in-out"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="flex flex-row justify-center mb-8">
            <span className="absolute bg-white px-4 text-gray-500">
              or sign in with
            </span>
            <div className="w-full bg-gray-200 mt-3 h-px"></div>
          </div>

          <div className="flex flex-row gap-2">
            <button
              type="button"
              className="bg-white border border-black text-black w-full p-2 flex flex-row justify-center gap-2 items-center rounded-sm hover:bg-gray-200 duration-100 ease-in-out"
              onClick={handleGoogle}
            >
              <GoogleIcon />
              Google
            </button>
            {/* Uncomment and modify if you want to add GitHub sign-in later */}
            {/* <button className="bg-gray-700 text-white w-full p-2 flex flex-row justify-center gap-2 items-center rounded-sm hover:bg-gray-800 duration-100 ease-in-out">
              <GitHubIcon />
              GitHub
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
