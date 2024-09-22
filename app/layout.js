"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import React, { useState, useEffect } from "react";
import AuthProvider from "./providers";
import { UserLocationProvider } from "@/context/context";
import { MarkerProvider } from "@/context/FilterMap";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <UserLocationProvider>
      <html lang="en">
        <head>
          <title>Water Application</title>
        </head>
        <body className={inter.className}>
          <div className="relative">
            <AuthProvider>
              <MarkerProvider>{children}</MarkerProvider>
            </AuthProvider>
          </div>
        </body>
      </html>
    </UserLocationProvider>
  );
}
