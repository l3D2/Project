const express = require("express");
const api_line = express.Router();
const database = require("../Database/db_module");

api_line.get("/line/devices/:uid", async (req, res) => {
  const uid = req.params.uid;
  let result;
  try {
    result = await database.query_sql(
      `SELECT Device.device_id, Device.device_name, Device.mac_address FROM Device LEFT JOIN Account ON Device.owned_id = Account.account_id WHERE Account.line_tk = '${uid}'`
    );
    console.log(result);
    if (result.length > 0) res.status(200).json(result);
    else res.status(200).json({ message: "No Data Found", status: 404 });
  } catch (err) {
    console.error("Error Fetching Data.\n", err.message);
    res.send("Error Fetching Data.").status(500);
  }
});

api_line.get("/line/lastest-data/:deviceid", async (req, res) => {
  const deviceid = req.params.deviceid;
  let result;
  try {
    result = await database.query_sql(
      `SELECT 
    Device.device_id,
    Device.device_name,
    Device.battery,
    Device.status,
    Device.mac_address,
    Device.location,
    Device_Data.datetime,
    Device_Data.EC,
    Device_Data.PH,
    Device_Data.Temp_Water,
    Device_Data.Temp,
    Device_Data.Humidity,
    Account.line_tk as 'lineId'
FROM Device_Data 
LEFT JOIN Device ON Device.device_id = Device_Data.device_id
LEFT JOIN Account ON Account.account_id = Device.owned_id
WHERE Device_Data.device_id = '${deviceid}'
ORDER BY Device_Data.datetime DESC 
LIMIT 1;`
    );
    if (result.length > 0) res.status(200).json(result);
    else res.status(200).json({ message: "No Data Found", status: 404 });
  } catch {
    console.error("Error Fetching Data.\n", err.message);
    res.send("Error Fetching Data.").status(500);
  }
});

api_line.get("/line/uTk/:macAddress", async (req, res) => {
  const macAddress = req.params.macAddress; // Correctly extract macAddress
  console.log(macAddress);
  let result;
  try {
    result = await database.query_sql(`
      SELECT Device.device_id, Device.device_name, Account.line_tk as 'lineId'
      FROM Device 
      LEFT JOIN Account ON Account.account_id = Device.owned_id
      WHERE Device.mac_address = '${macAddress}'`); // Use parameterized query

    console.log(result);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(200).json({ message: "No Data Found", status: 404 });
    }
  } catch (err) {
    console.error("Error Fetching Data.\n", err);
    res.status(500).send("Error Fetching Data."); // Ensure the status is set before sending
  }
});

api_line.post("/line/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let result;
  const body = req.body;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (!body.email) {
    return res.status(400).send("Body is missing parameter.");
  } else if (body.email == "") {
    return res.status(400).send("Body is missing parameter.");
  }

  try {
    result = await database.query_sql(
      `SELECT * FROM Account WHERE email = '${email}'`
    );
    if (result.length > 0) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        result[0].password
      );
      if (isPasswordCorrect) {
        res.status(200).json({ message: "Login Success", status: 200 });
      } else {
        res.status(401).json({ message: "Login Failed", status: 401 });
      }
    } else {
      res.status(404).json({ message: "User not found", status: 404 });
    }
  } catch (Error) {
    console.error("Error Fetching Data.\n");
    res.send("Error Fetching Data.").status(500);
  }
});

module.exports = api_line;
