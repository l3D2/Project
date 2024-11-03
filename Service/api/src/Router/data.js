const express = require("express");
const api_data = express.Router();
const database = require("../Database/db_module");
const fs = require("fs");
const path = require("path");

// สร้างฟังก์ชันเพื่อดึงชื่อไฟล์ตามวันที่
function getLogFileName() {
  const now = new Date();

  // Use toLocaleString to get the date in GMT+7 (Asia/Bangkok)
  const dateStr = now
    .toLocaleDateString("en-GB", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-"); // Format to YYYY-MM-DD

  return `log-${dateStr}.log`;
}

// กำหนดตำแหน่งโฟลเดอร์ที่เก็บ log
const logDir = path.join(__dirname, "../../logs");

// ตรวจสอบว่ามีโฟลเดอร์ logs หรือไม่ ถ้าไม่มีก็สร้างใหม่
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// ฟังก์ชันสำหรับบันทึก log ลงไฟล์
function logToFile(message) {
  const logFile = path.join(logDir, getLogFileName()); // ใช้ชื่อไฟล์ตามวันที่
  const timestamp = new Date(); // Get the current date and time
  const gmt7Time = timestamp.toLocaleString("en-GB", {
    timeZone: "Asia/Bangkok", // GMT+7
    hour12: false, // Use 24-hour format
  });

  const logMessage = `[${gmt7Time}] ${message}\n`;

  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}

api_data.post("/data", async (req, res) => {
  const body = req.body;
  let result;
  const date = new Date(body.time * 1000);

  const formattedDate = date.toLocaleString("en-GB", {
    timeZone: "Asia/Bangkok",
    hour12: false,
  });
  const datetime = database.formatDate(date);

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  }

  logToFile(
    `Time: ${formattedDate} timestamp: ${body.time} - Device ID: ${body.macaddress} , EC: ${body.ec}, TempW: ${body.tempW}, PH: ${body.ph}, Temp: ${body.tempA}, Humidity: ${body.h}`
  );
  try {
    result = await database.query_sql(
      `INSERT INTO Device_Data(device_id, datetime, EC, Temp_Water, PH, Temp, Humidity)
VALUES ((SELECT device_id FROM Device WHERE mac_address = '${
        body.macaddress
      }'),'${datetime}', '${body.ec == null ? 0 : body.ec}', '${
        body.tempW == null ? 0 : body.tempW
      }', '${body.ph == null ? 0 : body.ph}', '${body.tempA}', '${body.h}')`
    );
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Data Added Successfully.", status: 200 });
    } else {
      res.status(200).json({ message: "Data Added Failed.", status: 500 });
    }
  } catch (err) {
    console.error("Error Creating Data.\n", err.message);
    res.send("Error Creating Data.").status(500);
  }
});

api_data.get("/data/:deviceID", async (req, res) => {
  const deviceID = req.params.deviceID;
  let result;
  try {
    result = await database.query_sql(
      `SELECT * FROM Device_Data WHERE device_id = '${deviceID}' ORDER BY datetime ASC`
    );
    if (result.length > 0) res.status(200).json(result);
    else res.status(200).json({ message: "No Data Found", status: 404 });
  } catch (err) {
    console.error("Error Fetching Data.\n", err.message);
    res.send("Error Fetching Data.").status(500);
  }
});

api_data.get("/data/lastest/:deviceID", async (req, res) => {
  const deviceID = req.params.deviceID;
  let result;
  try {
    result = await database.query_sql(
      `SELECT * FROM Device_Data WHERE device_id = '${deviceID}' ORDER BY datetime DESC LIMIT 1`
    );
    if (result.length > 0) res.status(200).json(result);
    else res.status(200).json({ message: "No Data Found", status: 404 });
  } catch (err) {
    console.error("Error Fetching Data.\n", err.message);
    res.send("Error Fetching Data.").status(500);
  }
});
api_data.get("/data", async (req, res) => {
  let result;
  try {
    result = await database.query_sql(
      "SELECT * FROM `Device_Data` ORDER BY datetime ASC"
    );
    if (result.length > 0) res.status(200).json(result);
    else res.status(200).json({ message: "No Data Found", status: 404 });
  } catch (err) {
    console.error("Error Fetching Data.\n", err.message);
    res.send("Error Fetching Data.").status(500);
  }
});

module.exports = api_data;
