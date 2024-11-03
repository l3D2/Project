const express = require("express");
const logger = require("morgan");
const line = require("@line/bot-sdk");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const axios = require("axios");
require("dotenv").config();
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

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const config2 = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN2,
  channelSecret: process.env.CHANNEL_SECRET2,
};

const client = new line.Client(config);
const clientTest = new line.Client(config2);

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(logger("combined"));
app.use(cookieParser());

//Account Final
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

//Account Test
app.post("/webhook2", line.middleware(config2), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function handleEvent(event) {
  if (event.type === "postback") {
    return handlePostbackEvent(event);
  } else if (event.type === "message" && event.message.type === "text") {
    handleMessageEvent(event);
  } else {
    return Promise.resolve(null);
  }
}

async function handlePostbackEvent(event) {
  const postbackData = event.postback.data;
  const queryParams = new URLSearchParams(postbackData);

  const action = queryParams.get("action");
  const deviceId = queryParams.get("deviceid");

  if (action === "view" && deviceId) {
    // Call your API to get device details
    const response = await axios.get(
      `https://api.bd2-cloud.net/api/line/lastest-data/${deviceId}`
    );
    const deviceDetails = response.data[0];
    const location = JSON.parse(deviceDetails.location);
    console.log(location);
    const replyMessage = {
      type: "text",
      text: `\t\t\tLastest Mesure\n\n
    • Device Name: ${deviceDetails.device_name}\n
    • Status: ${deviceDetails.status === 1 ? "🟢 Online" : "🔴 Offline"}\n
    • Battery: ${deviceDetails.battery}%\n
    • Location:\n
    \tLat: ${location.lat} | lng ${location.lng}\n
    • EC (Electrical Conductivity): ${deviceDetails.EC}\n
    • pH Level: ${deviceDetails.PH}\n
    • Water Temp: ${deviceDetails.Temp_Water}°C\n
    • Air Temp: ${deviceDetails.Temp}°C\n
    • Humidity: ${deviceDetails.Humidity}%\n\n
    GOOGLE MAPS: http://www.google.com/maps/place/${location.lat},${
        location.lng
      }`,
    };

    return clientTest.replyMessage(event.replyToken, replyMessage);
  } else if (action === "status" && deviceId) {
    // Call your API to get device details
    const response = await axios.get(
      `https://api.bd2-cloud.net/api/line/lastest-data/${deviceId}`
    );
    const deviceDetails = response.data[0];
    const location = JSON.parse(deviceDetails.location);
    console.log(location);
    const replyMessage = {
      type: "text",
      text: `\t\t\tDevice Status\n\n
    • Device Name: ${deviceDetails.device_name}\n
    • Status: ${deviceDetails.status === 1 ? "🟢 Online" : "🔴 Offline"}\n
    • Battery: ${deviceDetails.battery}%\n
    • Location:\n
    \tLat: ${location.lat} | lng ${location.lng}\n
    GOOGLE MAPS: http://www.google.com/maps/place/${location.lat},${
        location.lng
      }`,
    };

    return clientTest.replyMessage(event.replyToken, replyMessage);
  }

  return Promise.resolve(null);
}

async function handleMessageEvent(event) {
  const uid = event.source.userId;
  var msg;
  var eventText = event.message.text.toLowerCase();

  if (eventText === "devices") {
    const res = await axios.get(
      `https://api.bd2-cloud.net/api/line/devices/${uid}`
    );
    const device = res.data;
    msg = {
      type: "template",
      altText: "รายการอุปกรณ์",
      template: {
        type: "carousel",
        columns: device.map((item) => {
          return {
            thumbnailImageUrl:
              "https://img5.pic.in.th/file/secure-sv1/devicebc568d80fac22cfb.png",
            title: item.device_name,
            text: item.mac_address,
            actions: [
              {
                type: "postback",
                label: "status",
                data: `action=status&deviceid=${item.device_id}`,
              },
            ],
          };
        }),
      },
    };
  } else if (eventText === "lastest-data") {
    try {
      const res = await axios.get(
        `https://api.bd2-cloud.net/api/line/devices/${uid}`
      );
      const device = res.data;
      if (device.status == 404) {
        msg = {
          type: "text",
          text: "No device found",
        };
      } else {
        msg = {
          type: "template",
          altText: "รายการอุปกรณ์",
          template: {
            type: "carousel",
            columns: device.map((item) => {
              return {
                thumbnailImageUrl:
                  "https://img5.pic.in.th/file/secure-sv1/devicebc568d80fac22cfb.png",
                title: item.device_name,
                text: "Please select",
                actions: [
                  {
                    type: "postback",
                    label: "View",
                    data: `action=view&deviceid=${item.device_id}`,
                  },
                ],
              };
            }),
          },
        };
      }
    } catch (err) {
      console.log(err);
    }
  }

  return clientTest.replyMessage(event.replyToken, msg);
}

app.post("/api/sendNotify", async (req, res) => {
  const { deviceId } = req.body;
  let dataNotify;
  let data;
  let uid;
  try {
    const response = await fetch(
      `https://api.bd2-cloud.net/api/notification/${deviceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    if (response.ok && json.status != 404) dataNotify = json[0];
  } catch (err) {
    console.log("Error fetching Notification", err);
    return res.status(500).json({ message: "Error fetching Notification" });
  }

  // Fetch latest data
  try {
    const response = await axios.get(
      `https://api.bd2-cloud.net/api/line/lastest-data/${deviceId}`
    );
    data = response.data[0];
    uid = data.lineId;
  } catch (err) {
    console.log("Error fetching data to send notify", err);
    return res.status(500).json({ message: "Error fetching latest data" });
  }

  let isAlert = false;
  let msg = `\t\tLastest Measure\n\n`;

  // Check alert conditions
  if (dataNotify.notify_ec != 0) {
    if (data.EC > dataNotify.ec_max) {
      isAlert = true;
      msg += `• EC (Electrical Conductivity): ${data.EC} ⚠️ Higher\n`;
    } else if (data.EC < dataNotify.ec_min) {
      isAlert = true;
      msg += `• EC (Electrical Conductivity): ${data.EC} ⚠️ Lower\n`;
    }
  }
  if (dataNotify.notify_ph != 0) {
    if (data.PH > dataNotify.ph_max) {
      isAlert = true;
      msg += `• pH Level: ${data.PH} ⚠️ Higher\n`;
    }
    if (data.PH < dataNotify.ph_min) {
      isAlert = true;
      msg += `• pH Level: ${data.PH} ⚠️ Lower\n`;
    }
  }

  if (dataNotify.notify_tempw != 0) {
    if (data.Temp_Water > dataNotify.tempw_max) {
      isAlert = true;
      msg += `• Water Temp: ${data.Temp_Water}°C ⚠️ Higher\n`;
    }
    if (data.Temp_Water < dataNotify.tempw_min) {
      isAlert = true;
      msg += `• Water Temp: ${data.Temp_Water}°C ⚠️ Lower\n`;
    }
  }

  if (dataNotify.notify_temp != 0) {
    if (data.Temp > dataNotify.temp_max) {
      isAlert = true;
      msg += `• Air Temp: ${data.Temp}°C ⚠️ Higher\n`;
    }
    if (data.Temp < dataNotify.temp_min) {
      isAlert = true;
      msg += `• Air Temp: ${data.Temp}°C ⚠️ Lower\n`;
    }
  }

  if (dataNotify.notify_humi != 0) {
    if (data.Humidity > dataNotify.humi_max) {
      isAlert = true;
      msg += `• Humidity: ${data.Humidity}% ⚠️ Higher\n`;
    }
    if (data.Humidity < dataNotify.humi_min) {
      isAlert = true;
      msg += `• Humidity: ${data.Humidity}% ⚠️ Lower\n`;
    }
  }

  // If no alert, return without sending notification
  if (!isAlert) {
    return res.status(200).json({ message: "No notify", status: 200 });
  }

  // Send notification if there is an alert
  try {
    clientTest.pushMessage(uid, { type: "text", text: msg });
    return res.status(200).json({ message: "Notify sent", status: 200 });
  } catch (err) {
    console.log("Error sending notification", err);
    return res.status(500).json({ message: "Error sending notification" });
  }
});

app.post("/api/alertBattery", async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    const response = await axios.get(
      `https://api.bd2-cloud.net/api/line/uTk/${body.macaddress}`
    );
    const data = response.data[0];
    sendNotify(data.lineId, body.msg);
    res.status(200).json({ message: "Notify sent", status: 200 });
  } catch (err) {
    console.log("Error fetching uTk to send notify");
    res.status(500).json({ message: "Error" });
  }
});

const sendNotify = (uid, message) => {
  logToFile(`Sending notify to ${uid} with message: \n${message}`);
  clientTest.pushMessage(uid, { type: "text", text: message });
};

app.get("/api/unlink-richmenu", (req, res) => {
  client.unlinkRichMenuFromUser("U88bd6cf55a839cc192544d4f8b37d69d");
  clientTest.unlinkRichMenuFromUser("U88bd6cf55a839cc192544d4f8b37d69d");
  res.json({
    data: req.body,
  });
});

app.post("/api/change-richmenu", async (req, res) => {
  // // save data in db
  const { password, email, userId } = req.body;

  // POST data to db
  const response = await fetch(
    "https://api.bd2-cloud.net/api/user/line-register",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email,
        line_id: userId,
      }),
    }
  );
  client.linkRichMenuToUser(
    userId,
    "richmenu-caa564497592930e5b9158ec3008f7e9"
  );
  clientTest.linkRichMenuToUser(
    userId,
    "richmenu-911508526b4e617b1ddc474c38464498"
  );
  res
    .json({
      message: "Success",
    })
    .status(200);
});

app.get("/", (req, res) => {
  console.log(req.header("X-Real-IP"));
  res.status(200).json({
    message: "Line Service is running.",
    status: 200,
  });
});

app.listen(process.env.LINE_PORT, () => {
  console.log("Line service ready on port " + process.env.LINE_PORT);
});
