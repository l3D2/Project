const express = require("express");
const api_device = express.Router();
const database = require("../Database/db_module");

api_device.post("/device", async (req, res) => {});
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
    console.log(0);
    res.status(200).json(0);
  } else {
    console.log(result.length);
    res.status(200).json(result.length);
  }
});
api_device.get("/device/:deviceid", async (req, res) => {
  const id = req.params.deviceid;
  let result;
  try {
    result = await database.query_sql(
      `SELECT * FROM Device WHERE owned_id = '${id}'`
    );
  } catch (error) {
    console.error("Error Fetching User.\n", error);
  }
  if (result.length > 0) res.status(200).json(result);
  else res.status(404).json("No Device Found.");
});
api_device.put("/device", async (req, res) => {});
api_device.delete("/device", async (req, res) => {});

module.exports = api_device;
