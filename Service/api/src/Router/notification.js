const express = require("express");
const api_notification = express.Router();
const database = require("../Database/db_module");

api_notification.get("/notification/:id", async (req, res) => {
  const id = req.params.id;
  let result;
  try {
    result = await database.query_sql(
      `SELECT * FROM Notification WHERE device_id = '${id}'`
    );

    if (result.length > 0) {
      res.json(result).status(200);
    } else {
      res.json({ message: "Notification not found.", status: 404 }).status(200);
    }
  } catch {
    res.send("Error get notification").status(500);
  }
});
api_notification.put("/notification/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  console.log(body);
  let result;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  }

  try {
    result = await database.query_sql(
      `UPDATE Notification SET notify_ec='${body.notify_ec}',ec_min='${body.ec_min}',ec_max='${body.ec_max}',notify_ph='${body.notify_ph}',ph_min='${body.ph_min}',ph_max='${body.ph_max}',notify_temp='${body.notify_temp}',temp_min='${body.temp_min}',temp_max='${body.temp_max}',notify_tempw='${body.notify_tempw}',tempw_min='${body.tempw_min}',tempw_max='${body.tempw_max}',notify_humi='${body.notify_humi}',humi_min='${body.humi_min}',humi_max='${body.humi_max}' WHERE device_id = '${id}'`
    );
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Update notification successful", status: 200 });
    } else {
      res.status(200).json({ message: "Notification not found.", status: 404 });
    }
  } catch {
    res.send("Error get notification").status(500);
  }
});

module.exports = api_notification;
