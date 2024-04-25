const hyperExpress = require("hyper-express")
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = new hyperExpress.Server();
const router = new hyperExpress.Router();
const database = require('./Database/db_module')
const mysql = require('mysql');

const connection = mysql.createConnection({
  connectionLimit: 10,
  host: '210.246.215.31',
  user: 'BD2',
  password: 'BD22342197',
  database: 'IoT_DB',
  port:"3306"
});

logger.token("client-ip", (req) => {
  return req.ip; // Fetches the client's IP address
});

app.use(logger(':client-ip | :method :url :status'));

const responseTime = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${elapsed} ms`);
  });
  next();
};

app.use(responseTime)
app.use((req, res, next) => {
  const writeLog = () => {
    const timestamp = new Date().toISOString();
    const logForm = '[' + timestamp + '] '+ `IP >> ${req.ip} | ` + req.method + ' - ' + req.url + ' - ' + res.statusCode + '\n';
    const fileName = `${timestamp.slice(0,10)}.log`;
    const logPath = path.join('logs', fileName);

    fs.appendFile(logPath, logForm, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    })
  };
  res.on('finish', writeLog);
  next();
});
//app.use(cors());

const verifyAPIKey = (req, res, next) => {
  const key = req.headers["apikey"];
  if (key !== "bd2") {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

app.get('/api/status', verifyAPIKey, async (req, res) => {
  console.log('API Service is running');
  //const db = await database.connectDatabase()
  res.status(200).send('API Service is running');
});

//User
app.post("/api/user", verifyAPIKey, async (req, res) => {
  let json = await req.json()
  //let query = "INSERT INTO Account (Account_ID, Name, Email, Permission, Token, Signup_ts) VALUES (UUID(), '" + json.username + "', 'testapi@gmail.com', 'A', 'test', '2021-01-01 00:00:00')"
  try {
    let response = await database.insertUser(json.name, json.email, json.googleId)
    res.status(200).send(`Database => ${response}`)
  }catch(err){
    res.status(500).send(err)
  }
})

app.get("/api/user", verifyAPIKey, async (req, res) => {
  let json = await req.json()
  try{
    let response = await database.getUser(json.googleId)
    if(response.length > 0)
      res.status(200).json(response)
    else
      res.status(400).send("User not found")
  }catch(err){
    res.status(500).send(err)
  }
})

app.put("/api/user", verifyAPIKey, async (req, res) => {
  res.status(200).send("OK");
})

app.delete("/api/user", verifyAPIKey, async (req, res) => {
  res.status(200).send("OK");
})

app.listen(3030, () => {
  console.log('API Service listening on port 3030')
  database.connectDatabase()
});