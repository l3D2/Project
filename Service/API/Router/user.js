const express = require("express");
const router_user = express.Router();
const database = require("../Database/db_module");

router_user.post("/user/register", async (req, res) => {
  let body = req.body;
  try {
    database.query_sql(
      `INSERT INTO Account (name, email, password, img_url) VALUES ('${body.name}', '${body.email}', '${body.password}', '${body.img_url})`
    );
  } catch (error) {
    console.error("Error Registering User.\n", error);
    res.status(500).send("Error Registering User.");
  }
  console.log("User Registered Successfully.");
  res.status(200).send("User Registered Successfully.");
});
router_user.post("/user/get-user", async (req, res) => {
  let body = req.body;
  let result;
  try {
    result = await database.query_sql(
      `SELECT * FROM Account WHERE email = '${body.email}'`
    );
  } catch (error) {
    console.error("Error Fetching User.\n", error);
  }
  if (result.length == 0) {
    console.log(0);
    res.status(404).send(JSON.stringify("User Not Found."));
  } else {
    console.log(result);
    res.status(200).send(result);
  }
});
router_user.get("/user/get-all", async (req, res) => {});
router_user.put("/user/update", async (req, res) => {});
router_user.get("/user", (req, res) => {
  res.send("User Router").status(200);
});

module.exports = router_user;
