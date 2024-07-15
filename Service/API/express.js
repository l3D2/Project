const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("morgan");

//Import Module Router
const api_user = require("./Router/user");
const port = process.env.API_PORT || 3000;

app.use(logger("combined"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
//Router Call
app.use("/api", api_user);

app.post("/", (req, res) => {
  let json = req.body;
  res.send("Running").status(200);
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
