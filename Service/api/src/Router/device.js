const express = require("express");
const api_device = express.Router();
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

const sendNotification = async (req, res, next) => {
  const { macaddress } = req.body;
  let id;
  try {
    const res = await database.query_sql(
      `SELECT device_id FROM Device WHERE mac_address = '${macaddress}'`
    );
    if (res.length > 0) {
      id = res[0].device_id;
    }
  } catch (err) {
    console.log(err);
  }
  console.log("Sending notification to device:", id);
  try {
    const res = await fetch("https://api-line.bd2-cloud.net/api/sendNotify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceId: id,
      }),
    });
  } catch (err) {
    console.log("Error fetching data to send notify");
  }
  next();
};

api_device.post("/device", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  let result;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  }
  try {
    result = await database.query_sql(
      `INSERT INTO Device (device_id ,mac_address ,api_key ,create_ts ,create_by,qrUrl) VALUES (UUID(),'${body.macAddress}', UUID(), '${datetime}', '${body.userid}', '${body.qrUrl}')`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "Device Added Successfully.", status: 200 });
    else res.status(200).json({ message: "Device Added Failed.", status: 500 });
  } catch (error) {
    console.error("Error.\n", error);
    res.send("Error").status(500);
  }
});

api_device.get("/device/getCount/:userid", async (req, res) => {
  const id = req.params.userid;
  let result;
  try {
    result = await database.query_sql(
      `SELECT * FROM Device WHERE owned_id = '${id}'`
    );
  } catch (error) {
    console.error("Error Fetching User.\n", error);
  }
  if (result.length == 0) {
    res.status(200).json(0);
  } else {
    res.status(200).json(result.length);
  }
});

api_device.get("/device/:deviceid", async (req, res) => {
  const id = req.params.deviceid;
  let result;
  try {
    result = await database.query_sql(
      `SELECT Device.*, Category.name AS cat_name 
FROM Device 
LEFT JOIN Category ON Device.cat_id = Category.id 
WHERE Device.device_id = '${id}'`
    );
    if (result.length > 0) res.status(200).json(result);
    else res.status(200).json({ message: "No Device Found.", status: 404 });
  } catch (error) {
    console.error("Error Fetching User.\n", error);
    res.send("Error").status(500);
  }
});

api_device.get("/device/backend/device", async (req, res) => {
  let result;
  try {
    result = await database.query_sql(`SELECT
    COUNT(*) AS total,
    COUNT(CASE WHEN status = 1 THEN 1 END) AS online
FROM Device`);
    if (result.length > 0) res.status(200).json(result);
    else res.status(200).json({ message: "No Device Found.", status: 404 });
  } catch (err) {
    console.log(err);
    res.send("Error").status(500);
  }
});

api_device.get("/device/backend/get-device", async (req, res) => {
  let result;
  try {
    result = await database.query_sql(`SELECT *
FROM Device WHERE owned_id IS NULL`);
    if (result.length > 0) res.status(200).json(result);
    else res.status(200).json({ message: "No Device Found.", status: 404 });
  } catch (err) {
    console.log(err);
    res.send("Error").status(500);
  }
});

api_device.get("/device/get-device/:deviceid", async (req, res) => {
  const id = req.params.deviceid;
  let result;
  try {
    result = await database.query_sql(
      `SELECT Device.*, Category.name AS cat_name 
FROM Device 
LEFT JOIN Category ON Device.cat_id = Category.id 
WHERE Device.owned_id = '${id}'`
    );
    if (result.length > 0) res.status(200).json(result);
    else res.status(200).json({ message: "No Device Found.", status: 404 });
  } catch (error) {
    console.error("Error Fetching User.\n", error);
  }
});

api_device.put("/device/register", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  let result;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (
    !body.mac_address ||
    !body.userid ||
    body.mac_address == "" ||
    body.userid == ""
  ) {
    return res.status(400).send("Body is missing parameter.");
  }
  try {
    result = await database.query_sql(
      `UPDATE Device SET owned_id = '${body.userid}', api_status = 1, register_ts = '${datetime}' WHERE mac_address = '${body.mac_address}'`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "Device Registered Successfully.", status: 200 });
    else res.status(200).json({ message: "Device Not Found.", status: 404 });
  } catch (error) {
    console.error("Error.\n", error);
    res.send("Error").status(500);
  }
});

api_device.put("/device/updateData", async (req, res) => {
  const body = req.body;
  let result;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  }
  try {
    result = await database.query_sql(`
  UPDATE Device 
  SET device_name = '${body.devicename}', 
      cat_id = ${body.catid === null ? "NULL" : `'${body.catid}'`} 
  WHERE device_id = '${body.deviceid}'
`);
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "Device Updated Successfully.", status: 200 });
    else res.status(200).json({ message: "Device Not Found.", status: 404 });
  } catch (error) {
    console.error("Error.\n", error);
    res.send("Error").status(500);
  }
});

api_device.put("/device/updateMAC", async (req, res) => {
  const body = req.body;
  let result;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  }
  try {
    result = await database.query_sql(`
  UPDATE Device 
  SET mac_address = '${body.mac_address}',
      qrUrl = '${body.qrUrl}'
  WHERE device_id = '${body.deviceid}'
`);
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "Device Updated Successfully.", status: 200 });
    else res.status(200).json({ message: "Device Not Found.", status: 404 });
  } catch (error) {
    console.error("Error.\n", error);
    res.send("Error").status(500);
  }
});

api_device.put("/device/updateInterval", async (req, res) => {
  const body = req.body;
  console.log(body);
  let result;

  try {
    // Use parameterized query to prevent SQL injection
    result = await database.query_sql(
      `UPDATE Device SET \`interval\` = '${body.interval}' WHERE device_id = '${body.id}'`
    );

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Device Updated Successfully.", status: 200 });
    } else {
      res.status(200).json({ message: "Device Not Found.", status: 404 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error.", status: 500 });
  }
});

api_device.put(
  "/device/updateStatus",
  async (req, res, next) => {
    const { macaddress, location, status, battery } = req.body;
    let result;
    let sql = `UPDATE Device d
JOIN (SELECT device_id FROM Device WHERE mac_address = '${macaddress}') sub
ON d.device_id = sub.device_id
SET d.location = '${location}', 
    d.status = '${status}', 
    d.battery = '${battery}';
`;
    logToFile(
      `Device ID: ${macaddress} | Location: ${location} | Status: ${status} | Battery: ${battery}`
    );
    const local = JSON.parse(location);
    if (local.lat == 0 && local.lng == 0) {
      sql = `UPDATE Device d
JOIN (SELECT device_id FROM Device WHERE mac_address = '${macaddress}') sub
ON d.device_id = sub.device_id
SET d.status = '${status}', 
    d.battery = '${battery}';
`;
      logToFile(
        `Device ID: ${macaddress} | Location: pos is zero | Status: ${status} | Battery: ${battery}`
      );
    }
    try {
      result = await database.query_sql(sql);
      if (result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Device Updated Successfully.", status: 200 });
        next();
      } else {
        res.status(404).json({ message: "Device Not Found.", status: 404 });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Error");
    }
  },
  sendNotification
);

api_device.delete("/device/delete", async (req, res) => {
  const body = req.body;
  let result;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (!body.deviceid || body.deviceid == "") {
    res.status(400).send("Body is missing deviceid.");
  }
  try {
    result = await database.query_sql(
      `UPDATE Device SET owned_id = NULL, device_name = 'NewDevice', cat_id = NULL, api_status = 0, register_ts = NULL WHERE device_id = '${body.deviceid}'`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "Device Deleted Successfully.", status: 200 });
    else res.status(200).json({ message: "Device Not Found.", status: 404 });
  } catch (error) {
    console.error("Error.\n", error);
    res.send("Error").status(500);
  }
});

api_device.delete("/device/backend/delete", async (req, res) => {
  const body = req.body;
  let result;
  try {
    result = await database.query_sql(
      `DELETE FROM Device WHERE device_id = '${body.deviceid}'`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "Device Deleted Successfully.", status: 200 });
    else res.status(200).json({ message: "Device Not Found.", status: 404 });
  } catch (err) {
    console.log(err);
    res.send("Error").status(500);
  }
});

module.exports = api_device;
