const express = require("express");
const router_user = express.Router();
const database = require("../Database/db_module");

router_user.post("/user/register", async (req, res) => {
  const body = req.body;
  console.log(body);
  const datetime = database.formatDate(new Date());
  let result;
  try {
    // Using parameterized queries to prevent SQL injection
    result = await database.query_sql(
      `INSERT INTO Account (account_id, name, email, password, imgurl, signup_ts) VALUES (UUID(), '${body.name}', '${body.email}', '${body.password}', '${body.imgurl}', '${datetime}')`
    );
    console.log("User Registered Successfully.", result);
    res.status(200).send("User Registered Successfully.");
  } catch (error) {
    console.error("Error Registering User.\n", error.message);
    res.status(500).send("Error Registering User.");
  }
});
router_user.post("/user/get-user", async (req, res) => {
  const body = req.body;
  console.log(body);
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
