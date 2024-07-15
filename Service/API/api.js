const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

//Import Module Router
const api_user = require("./Router/user");
const port = process.env.API_PORT || 3000;

app.use(
  cors({
    origin: "*", // Wildcard is NOT for Production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(logger("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Router Call
app.use("/api", api_user);

app.post("/", (req, res) => {
  let json = req.body;
  res.send("Running").status(200);
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
