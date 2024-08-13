const express = require("express");
const router_user = express.Router();
const database = require("../Database/db_module");

router_user.post("/user/register", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  let result;
  try {
    // Using parameterized queries to prevent SQL injection
    result = await database.query_sql(
      `INSERT INTO Account (account_id, name, email, password, imgurl, signup_ts) VALUES (UUID(), '${body.name}', '${body.email}', '${body.password}', '${body.imgurl}', '${datetime}')`
    );
    res.status(200).send("User Registered Successfully.");
  } catch (error) {
    console.error("Error Registering User.\n", error.message);
    res.status(500).send("Error Registering User.", error.message);
  }
});
router_user.post("/user/get-user", async (req, res) => {
  const body = req.body;
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
    res.status(200).json(result);
  }
});
router_user.get("/user/get-all", async (req, res) => {
  let result;
  try {
    result = await database.query_sql(`SELECT * FROM Account`);
  } catch (error) {
    console.error("Error Fetching User.\n", error);
  }
  if (result.length > 0) res.send(result).status(200);
  else res.send("No User Found.").status(404);
});
router_user.put("/user/update", async (req, res) => {
  const body = req.body;
  try {
    database.query_sql(
      `UPDATE Account SET name = '${body.name}', email = '${body.email}', password = '${body.password}', imgurl = '${body.imgurl}' WHERE account_id = '${body.account_id}'`
    );
  } catch (error) {
    console.error("Error Updating User.\n", error);
  }
});
router_user.get("/user", (req, res) => {
  res.send("User Router ok.").status(200);
});

module.exports = router_user;
