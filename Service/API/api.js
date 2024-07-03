const hyperExpress = require("hyper-express");
const app = new hyperExpress.Server();
const logger = require("morgan");
const api_user = require("./route/user");

app.use(logger("combined"));
app.use("/api", api_user);

app
  .listen(3000)
  .then((socket) => console.log(`Server is running on port 3000`))
  .catch((err) => console.error("Failed to start API\n", err));
