const hyperExpress = require("hyper-express")
const logger = require("morgan");
const cors = require("cors");
const app = new hyperExpress.Server();
//const { db_query } = require('../MySQL/db_module')

logger.token("client-ip", (req) => {
  return req.ip; // Fetches the client's IP address
});

// Use Morgan for request logging with IP address
app.use(logger(":client-ip - :method :url :status :response-time ms"));
//app.use(cors());

const verifyAPIKey = (req, res, next) => {
  const key = req.headers["apikey"];
  if (key !== "bd2") {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

app.get('/api/', verifyAPIKey, (req, res) => {
  console.log('API Service is running');
  res.status(200).send('API Service is running');
});

// Create DB
app.post("/api/db_newuser/", verifyAPIKey, async (req, res) => {
  let json = req.body
  let query = "INSERT INTO Account (Account_ID, Name, Email, Permission, Token, Signup_ts) VALUES ('" + json.id + "', '" + json.username + "', 'testapi@gmail.com', 'A', 'test', '2021-01-01 00:00:00')"
  let response = await db_query(query)
  res.status(200).send(`Response => ${response}`)
})

app.post("/db", (req, res) => {
  const data = req.body;
  console.log(data);
  res.status(200).send("OK");
});

app.get("/api/db_getuser", verifyAPIKey, async (req, res) => {
  res.status(200).send("OK");
})

app.put("/api/db_updateuser", verifyAPIKey, async (req, res) => {
  res.status(200).send("OK");
})

app.delete("/api/db_deleteuser", verifyAPIKey, async (req, res) => {
  res.status(200).send("OK");
})

app.listen(3030, () => {
  console.log('API Service listening on port 3030');
});