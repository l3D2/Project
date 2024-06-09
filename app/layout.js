import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Water Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
