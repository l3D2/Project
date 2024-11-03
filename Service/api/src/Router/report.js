const express = require("express");
const api_report = express.Router();
const database = require("../Database/db_module");

api_report.post("/report", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  let result;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (
    !body.user_id ||
    !body.device_id ||
    !body.report_topic ||
    !body.report_details
  ) {
    return res.status(400).send("Body is missing parameter.");
  } else if (
    body.user_id == "" ||
    body.device_id == "" ||
    body.report_topic == "" ||
    body.report_details == ""
  ) {
    return res.status(400).send("Body is missing parameter.");
  }

  try {
    result = await database.query_sql(
      `INSERT INTO Report (accID,device_id, datetime, topic, detail) VALUES ('${body.user_id}','${body.device_id}', '${datetime}', '${body.report_topic}', '${body.report_details}')`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "Created report successful", status: 200 });
    else
      res.status(200).json({ message: "Created report Failed.", status: 500 });
  } catch {
    res.send("Error inserted report").status(500);
  }
});

api_report.get("/report", async (req, res) => {
  let result;
  try {
    result = await database.query_sql(
      `SELECT Report.*, Account.name AS name 
FROM Report 
LEFT JOIN Account ON Report.accID = Account.account_id`
    );
    if (result.length > 0) res.send(result).status(200);
    else res.status(200).json({ message: "Report not found.", status: 404 });
  } catch {
    res.send("Error get report").status(500);
  }
});

api_report.put("/report", async (req, res) => {
  const body = req.body;
  let result;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (!body.status || !body.id) {
    return res.status(400).send("Body is missing parameter.");
  } else if (body.status == "" || body.id == "") {
    return res.status(400).send("Body is missing parameter.");
  }

  try {
    result = await database.query_sql(
      `UPDATE Report SET status = '${body.status}' WHERE id = '${body.id}'`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "Report updated successful", status: 200 });
    else res.status(200).json({ message: "Report not found.", status: 404 });
  } catch {
    res.send("Error updated report").status(500);
  }
});
api_report.delete("/report", async (req, res) => {});

module.exports = api_report;
