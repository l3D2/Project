const hyperExpress = require("hyper-express");
const api_user = new hyperExpress.Router();
const database = require("./Database/db_module");

api_user.post("/user/register", async (req, res) => {
  let body = await req.json();
  try {
    database.query_sql(
      `INSERT INTO users (name, email, password, img_url) VALUES ('${body.name}', '${body.email}', '${body.password}', '${body.img_url})`
    );
  } catch (error) {
    console.error("Error Registering User.\n", error);
    res.status(500).send("Error Registering User.");
  }
  console.log("User Registered Successfully.");
  res.status(200).send("User Registered Successfully.");
});
api_user.post("/user/get-user", async (req, res) => {
  res.status(200).send("Done");
});
api_user.get("/user/get-all", async (req, res) => {});
api_user.put("/user/update", async (req, res) => {});

module.exports = api_user;
