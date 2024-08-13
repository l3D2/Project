const express = require("express");
const api_data = express.Router();
const database = require("../Database/db_module");

api_data.post("/data", async (req, res) => {
  let body = req.body;
  const datetime = database.formatDate(new Date());
  try {
    database.query_sql(
      "INSERT INTO Device_Data (device_id, datetime, EC, Temp_Water, PH, Temp, Humidity) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        body.device_id,
        datetime,
        body.EC,
        body.Temp_Water,
        body.PH,
        body.Temp,
        body.Humidity,
      ]
    );
  } catch (err) {
    console.error("Error Creating Data.\n", err.message);
    res.send("Error Creating Data.").status(500);
  }
});
api_data.post("/data", async (req, res) => {
  let body = req.body;
  let result;
  try {
    result = database.query_sql(
      "SELECT * FROM Device_Data WHERE device_id = ?",
      [body.device_id]
    );
    res.send(result).status(200);
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
    console.log(result);
    res.send(result).status(200);
  } catch (err) {
    console.error("Error Fetching Data.\n", err.message);
    res.send("Error Fetching Data.").status(500);
  }
});
api_data.put("/data", async (req, res) => {});
api_data.delete("/data", async (req, res) => {});

module.exports = api_data;
