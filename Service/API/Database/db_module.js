const mysql = require("mysql");
require("dotenv").config();

const config = {
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  dbTB: process.env.DB_NAME,
};

const connection = mysql.createConnection({
  connectionLimit: 20,
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbTB,
  port: "3306",
});

const connectDatabase = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return 0;
    }
    console.log("Connected to MySQL database");
    return 1;
  });
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero for single-digit days

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
};

const query_sql = async (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
// Account TB
const insertUser = (name, email, gID) => {
  const now = new Date();
  const datetime = formatDate(now);
  const sql = `INSERT INTO Account (account_id, name, email, google_id, signup_ts) VALUES (UUID(), '${name}', '${email}', '${gID}', '${datetime}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Inserted User.\n", err);
      }
      return resolve("Inserted User Successfully.");
    });
  });
};

const getUser = (email) => {
  const sql = `SELECT * FROM Account WHERE email = '${email}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Selected User.\n", err);
      }
      return resolve(result);
    });
  });
};

const updateUser = async (gID, name, passwd, lineTk, group) => {
  const now = new Date();
  const datetime = formatDate(now);
  const sql = `UPDATE Account SET name = '${name}', password = '${passwd}',group = '${group}', line_tk = '${lineTk}', update_ts = '${datetime}' WHERE google_id = '${gID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Updated User.\n", err);
      }
      return resolve(`Updated User GoogleID '${gID}' Successfully.`);
    });
  });
};

// Category TB
const insertCat = async (accId, catName) => {
  const sql = `INSERT INTO Category (acc_id, cat_name) VALUES ('${accId}', '${catName}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Inserted Category.\n", err);
      }
      return resolve(`Inserted Category '${catName}' Successfully.`);
    });
  });
};

const getCat = async (accID) => {
  const sql = `SELECT * FROM Category WHERE acc_id = '${accID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Selected Category.\n", err);
      }
      return resolve(result);
    });
  });
};

const updateCat = async (catID, catName) => {
  const sql = `UPDATE Category SET cat_name = '${catName}' WHERE cat_id = '${catID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Updated Category.\n", err);
      }
      return resolve(`Updated Category '${catName}' Successfully.`);
    });
  });
};

const deleteCat = async (catID) => {
  const sql = `DELETE FROM Category WHERE cat_id = '${catID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Deleted Category.\n", err);
      }
      return resolve(`Deleted Category ID '${catID}' Successfully.`);
    });
  });
};

//Device TB
const createDevice = async (deviceName, apiKey, accId) => {
  const now = new Date();
  const datetime = formatDate(now);
  console.log(deviceName, apiKey, accId);
  const sql = `INSERT INTO Device (device_id, device_name, api_key, create_ts, create_by) VALUES (UUID(), '${deviceName}', '${apiKey}', '${datetime}', '${accId}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return reject("Error Inserted Device.\n", err);
      }
      return resolve(`Inserted Device '${deviceName}' Successfully.`);
    });
  });
};

const getDevice = async (deviceID, accID = null) => {
  const sql =
    `SELECT * FROM Device WHERE ` +
    (accID != null ? `owned_id = '${accID}'` : `device_id = '${deviceID}'`);
  console.log(sql);
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Selected Device.\n", err);
      }
      return resolve(result);
    });
  });
};

const updateDevice = async (
  ownedId,
  deviceID,
  deviceName,
  catID,
  macaddr,
  located,
  apiStatus,
  RegTs
) => {
  const now = new Date();
  const datetime = formatDate(now);
  const sql =
    `UPDATE Device SET owned_id = '${ownedId}', device_name = '${deviceName}', cat_id = ${catID}, mac_address = '${macaddr}', location = ${located}, api_status = '${apiStatus}'` +
    (RegTs != null ? `, register_ts = '${RegTs}'` : "") +
    `WHERE device_id = '${deviceID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Updated Device.\n", err);
      }
      return resolve(`Updated Device '${deviceName}' Successfully.`);
    });
  });
};

const deleteDevice = async (deviceID) => {
  const sql = `DELETE FROM Device WHERE device_id = '${deviceID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Deleted Device.\n", err);
      }
      return resolve(`Deleted Device ID '${deviceID}' Successfully.`);
    });
  });
};

// Device_Data TB
const insertData = async (deviceID, data) => {
  const now = new Date();
  const datetime = formatDate(now);
  const sql = `INSERT INTO Device_Data (device_id, datetime, EC, Temp_Water, PH, Temp, Humidity) VALUES ('${deviceID}', '${datetime}', '${data[0]}', '${data[1]}', '${data[2]}', '${data[3]}', '${data[4]}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Inserted Data.\n", err);
      }
      return resolve(`Inserted Data Successfully.`);
    });
  });
};

const getData = async (deviceID) => {
  const sql = `SELECT * FROM Device_Data WHERE device_id = '${deviceID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Selected Data.\n", err);
      }
      return resolve(result);
    });
  });
};

//Notification TB
const insertNoti = async (accID, deviceID) => {
  const sql = `INSERT INTO Notification (device_id) VALUES ('${accID}', '${deviceID}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Inserted Notification.\n", err);
      }
      return resolve(`Inserted Notification Successfully.`);
    });
  });
};

const getNoti = async (deviceID) => {
  const sql = `SELECT * FROM Notification WHERE device_id = '${deviceID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Selected Notification.\n", err);
      }
      return resolve(result);
    });
  });
};

const updateNoti = async (deviceID, dstatus, datamin, datamax) => {
  const sql = `UPDATE Notification SET notify_ec = '${dstatus[0]}', notify_ph = '${dstatus[1]}', notify_temp = '${dstatus[2]}', notify_humi = '${dstatus[3]}', ec_min = '${datamin[0]}', ec_max = '${datamax[0]}', ph_min = '${datamin[1]}', ph_max = '${datamax[1]}', temp_min = '${datamin[2]}', temp_max = '${datamax[2]}', humi_min = '${datamin[3]}', humi_max = '${datamax[3]}' WHERE device_id = '${deviceID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return reject("Error Updated Notification.\n", err);
      }
      return resolve(`Updated Notification Successfully.`);
    });
  });
};

//Report TB
const insertRp = async (accID, topic, detail) => {
  const now = new Date();
  const datetime = formatDate(now);
  const sql = `INSERT INTO Report (accID, topic, detail, timestamp) VALUES ('${accID}', '${topic}', '${detail}', '${datetime}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Inserted Report.\n", err);
      }
      return resolve(`Inserted Report Successfully.`);
    });
  });
};

const getRp = async (accID = null) => {
  const sql =
    `SELECT * FROM Report` + (accID != null ? ` WHERE accID = '${accID}'` : "");
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Selected Report.\n", err);
      }
      return resolve(result);
    });
  });
};

const updateRp = async (rpID, status) => {
  const sql = `UPDATE Report SET status = '${status}' WHERE id = '${rpID}'`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Updated Report.\n", err);
      }
      return resolve(`Updated Report Successfully.`);
    });
  });
};

//Log TB
const insertLog = async (accId, action, detail) => {
  const now = new Date();
  const datetime = formatDate(now);
  const sql = `INSERT INTO Log (acc_id, action, detail, datetime) VALUES ('${accId}', '${action}', '${detail}', '${datetime}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject("Error Inserted Log.\n", err);
      }
      return resolve(`Inserted Log Successfully.`);
    });
  });
};

module.exports = {
  connectDatabase,
  insertUser,
  getUser,
  updateUser,
  insertCat,
  getCat,
  updateCat,
  deleteCat,
  createDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  insertData,
  getData,
  insertNoti,
  getNoti,
  updateNoti,
  insertRp,
  getRp,
  updateRp,
  insertLog,
};
