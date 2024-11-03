const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

//Import Module Router
const api_user = require("./Router/user");
const api_data = require("./Router/data");
const api_device = require("./Router/device");
const api_report = require("./Router/report");
const api_category = require("./Router/category");
const api_notification = require("./Router/notification");
const api_line = require("./Router/line");

//Default port
const port2 = process.env.API_PORT2 || 3001;

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(logger("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Router Call
app.use("/api", api_user);
app.use("/api", api_data);
app.use("/api", api_device);
app.use("/api", api_report);
app.use("/api", api_category);
app.use("/api", api_notification);
app.use("/api", api_line);

app.get("/", (req, res) => {
  console.log(req.header("X-Real-IP"));
  res.status(200).json({
    message: "API Service is running.",
    status: 200,
  });
});

const service2 = app.listen(port2, () => {
  console.log(`API service 2 is running on port ${port2}`);
});
