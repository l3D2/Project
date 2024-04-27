const hyperExpress = require("hyper-express")
const logger = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = new hyperExpress.Server();
const router = new hyperExpress.Router();
const database = require('./Database/db_module')

app.use((req, res, next) => {
  const start = Date.now();
  const writeLog = (restime) => {
    const timestamp = new Date().toISOString();
    const logForm = '[' + timestamp + '] '+ `IP >> ${req.ip} | ` + req.method + ' - ' + req.url + ' ' + res.statusCode + ' - ' + restime + ' ms\n';
    const fileName = `${timestamp.slice(0,10)}.log`;
    const logPath = path.join('logs', fileName);

    fs.appendFile(logPath, logForm, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    })
  };
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`${req.ip} | ${req.method} ${req.url} ${res.statusCode} - ${elapsed} ms`);
    writeLog(elapsed);
  });
  next();
});
app.use(logger("combined"));
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
  res.status(200).send('API Service is running');
});

//User
app.post("/api/user", verifyAPIKey, async (req, res) => {
  let json = await req.json()
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
  let json = await req.json()
  try {
    let response = await database.updateUser(json.Google_Id, json.Name, json.Password, json.Line_token, json.Permission)
    res.status(200).send(`Database => ${response}`)
  }catch(err){
    res.status(500).send(err)
  }
})

app.delete("/api/user", verifyAPIKey, async (req, res) => {
  res.status(405).send("Method Not Allowed");
})

//Category TB
app.post("/api/category", verifyAPIKey, async (req, res) => {
  let json = await req.json()
  console.log(json)
  try {
    let response = await database.insertCat(json.Account_ID, json.Cat_Name)
    res.status(200).send(`Database => ${response}`)
  }catch(err){
    res.status(500).send(err)
  }
})

app.get("/api/category", verifyAPIKey, async (req, res) => {
  let json = await req.json()
  try{
    let response = await database.getCat(json.Account_ID)
    if(response.length > 0)
      res.status(200).json(response)
    else
      res.status(400).send("Category not found")
  }catch(err){
    res.status(500).send(err)
  }
})

app.put("/api/category", verifyAPIKey, async (req, res) => {
  let json = await req.json()
  try {
    let response = await database.updateCat(json.catID, json.name)
    res.status(200).send(`Database => ${response}`)
  }catch(err){
    res.status(500).send(err)
  }
})

app.delete("/api/category", verifyAPIKey, async (req, res) => {
  let json = await req.json()
  try {
    let response = await database.deleteCat(json.catID)
    res.status(200).send(`Database => ${response}`)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.listen(3030, () => {
  console.log('API Service listening on port 3030')
  database.connectDatabase()
});