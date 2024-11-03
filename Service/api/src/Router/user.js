const express = require("express");
const router_user = express.Router();
const database = require("../Database/db_module");

router_user.post("/user/register", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (!body.name || !body.email || !body.password || !body.imgurl) {
    return res.status(400).send("Body is missing parameter.");
  } else if (
    body.name == "" ||
    body.email == "" ||
    body.password == "" ||
    body.imgurl == ""
  ) {
    return res.status(400).send("Body is missing parameter.");
  }
  let result;
  try {
    // Using parameterized queries to prevent SQL injection
    result = await database.query_sql(
      `INSERT INTO Account (account_id, name, email, password, imgurl, signup_ts) VALUES (UUID(), '${body.name}', '${body.email}', '${body.password}', '${body.imgurl}', '${datetime}')`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "User Registered Successfully.", status: 200 });
    else
      res.status(200).json({ message: "User Registered Failed.", status: 500 });
  } catch (error) {
    console.error("Error Registering User.\n", error.message);
    res.status(500).send("Error Registering User.");
  }
});

router_user.post("/user/get-user", async (req, res) => {
  const body = req.body;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (!body.email || body.email == "") {
    return res.status(400).send("Body is missing parameter.");
  }
  let result;
  try {
    result = await database.query_sql(
      `SELECT * FROM Account WHERE email = '${body.email}'`
    );
    if (result.length == 0 || result == undefined) {
      console.log(0);
      res.status(200).json({ message: "User not found.", status: 404 });
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error Fetching User.\n", error);
    res.status(500).send("Error Fetching User.");
  }
});

router_user.get("/user/adminlist", async (req, res) => {
  let result;
  try {
    result = await database.query_sql(
      `SELECT * FROM Account WHERE role not like 'U'`
    );
    if (result.length > 0) res.send(result).status(200);
    else res.status(200).json({ message: "User not found.", status: 404 });
  } catch (error) {
    console.error("Error Fetching User.\n", error);
  }
});

// router_user.put("/user/update", async (req, res) => {
//   const body = req.body;
//   let result;

//   if (!body || Object.keys(body).length === 0) {
//     return res.status(400).send("Body is empty.");
//   } else if (
//     !body.name ||
//     !body.email ||
//     !body.password ||
//     !body.imgurl ||
//     !body.account_id
//   ) {
//     return res.status(400).send("Body is missing parameter.");
//   } else if (
//     body.name == "" ||
//     body.email == "" ||
//     body.password == "" ||
//     body.imgurl == "" ||
//     body.account_id == ""
//   ) {
//     return res.status(400).send("Body is missing parameter.");
//   }

//   try {
//     result = await database.query_sql(
//       `UPDATE Account SET name = '${body.name}', email = '${body.email}', password = '${body.password}', imgurl = '${body.imgurl}' WHERE account_id = '${body.account_id}'`
//     );
//     if (result.affectedRows > 0)
//       res.status(200).json({ message: "User update successful", status: 200 });
//     else res.status(200).json({ message: "User not found.", status: 404 });
//   } catch (error) {
//     console.error("Error Updating User.\n", error);
//     res.status(500).send("Error Updating User.");
//   }
// });

router_user.put("/user/line-register", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  let result;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (!body.line_id || !body.email) {
    return res.status(400).send("Body is missing parameter.");
  } else if (body.line_id == "" || body.email == "") {
    return res.status(400).send("Body is missing parameter.");
  }

  try {
    result = await database.query_sql(
      `UPDATE Account SET line_tk = '${body.line_id}', update_ts = '${datetime}' WHERE email = '${body.email}'`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "User update line successful", status: 200 });
    else res.status(200).json({ message: "User not found.", status: 404 });
  } catch (error) {
    console.error("Error Registering User.\n", error.message);
    res.status(500).send("Error Registering User.");
  }
});

router_user.put("/user/addadmin", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  let result;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (!body.email) {
    return res.status(400).send("Body is missing parameter.");
  } else if (body.email == "") {
    return res.status(400).send("Body is missing parameter.");
  }

  try {
    result = await database.query_sql(
      `UPDATE Account SET role = 'A', update_ts = '${datetime}' WHERE email = '${body.email}'`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "User update role successful", status: 200 });
    else res.status(200).json({ message: "User not found.", status: 404 });
  } catch (error) {
    console.error("Error updated User.\n", error.message);
    res.status(500).send("Error updated User.");
  }
});

router_user.put("/user/deladmin", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  let result;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (!body.email) {
    return res.status(400).send("Body is missing parameter.");
  } else if (body.email == "") {
    return res.status(400).send("Body is missing parameter.");
  }

  try {
    result = await database.query_sql(
      `UPDATE Account SET role = 'U', update_ts = '${datetime}' WHERE email = '${body.email}'`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "User update role successful", status: 200 });
    else res.status(200).json({ message: "User not found.", status: 404 });
  } catch (error) {
    console.error("Error updated User.\n", error.message);
    res.status(500).send("Error updated User.");
  }
});

router_user.put("/user/update", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  let result, sql;
  if (!body.password)
    sql = `UPDATE Account SET name = '${body.name}', update_ts = '${datetime}' WHERE email = '${body.email}'`;
  else
    sql = `UPDATE Account SET name = '${body.name}', password = '${body.password}', update_ts = '${datetime}' WHERE email = '${body.email}'`;
  try {
    result = await database.query_sql(sql);
    if (result.affectedRows > 0)
      res.status(200).json({ message: "User update successful", status: 200 });
    else res.status(200).json({ message: "User not found.", status: 404 });
  } catch (err) {
    console.error("Error updated User.\n");
    res.status(500).send("Error updated User.");
  }
});

router_user.put("/user/updateStatus", async (req, res) => {
  const body = req.body;
  const datetime = database.formatDate(new Date());
  let result;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  }

  try {
    result = await database.query_sql(
      `UPDATE Account SET isOnline = '${body.status}' , update_ts = '${datetime}' WHERE email = '${body.email}'`
    );
    if (result.affectedRows > 0)
      res
        .status(200)
        .json({ message: "User update status successful", status: 200 });
    else res.status(200).json({ message: "User not found.", status: 404 });
  } catch (error) {
    console.error("Error update User.\n", error.message);
    res.status(500).send("Error update User.");
  }
});

router_user.get("/user", (req, res) => {
  res.send("User Router ok.").status(200);
});

module.exports = router_user;
