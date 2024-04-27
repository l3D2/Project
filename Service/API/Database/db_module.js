const mysql = require('mysql');

const connection = mysql.createConnection({
  connectionLimit: 10,
  host: '210.246.215.31',
  user: 'BD2',
  password: 'BD22342197',
  database: 'IoT_DB',
  port:"3306"
});

const connectDatabase = () => {
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return 0;
    }
    console.log('Connected to MySQL database')
    return 1;
  })
}

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

const db_query = async (sql) => {
  try {
    const result = await connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error Query =>', err);
        throw err;
      }
      return result;
    });
  } catch (err) {
    console.error("Error Query =>", err);
    throw err;
  }
}
// Account TB
const insertUser = (name,email,gID) => {
  const now = new Date();
  const datetime = formatDate(now)
  const sql = `INSERT INTO Account (Account_ID, Name, Email, Google_Id, Signup_ts) VALUES (UUID(), '${name}', '${email}', '${gID}', '${datetime}')`
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject('Error Inserted User.\n',err);
      }
      return resolve("Inserted User Successfully.");
    })
  })
}

const getUser = (gID) => {
  const sql = `SELECT * FROM Account WHERE Google_Id = '${gID}'`
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, result) => {
        if (err) {
          return reject('Error Selected User.\n',err);
        }
        return resolve(result);
      })
    })
}

const updateUser = async (gID, name, passwd, lineTk, group) => {
  const now = new Date();
  const datetime = formatDate(now)
  const sql = `UPDATE Account SET Name = '${name}', Password = '${passwd}',Permission = '${group}', Line_token = '${lineTk}', Update_ts = '${datetime}' WHERE Google_Id = '${gID}'`
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject('Error Updated User.\n',err);
      }
      return resolve(`Updated User GoogleID '${gID}' Successfully.`);
    })
  })
}

// Category TB
const insertCat = async (accId, catName) => {
  const sql = `INSERT INTO Category (Account_ID, Cat_Name) VALUES ('${accId}', '${catName}')`
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject('Error Inserted Category.\n',err);
      }
      return resolve(`Inserted Category '${catName}' Successfully.`);
    })
  })
}

const getCat = async (accID) => {
  const sql = `SELECT * FROM Category WHERE Account_ID = '${accID}'`
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject('Error Selected Category.\n',err);
      }
      return resolve(result);
    })
  })
}

const updateCat = async (catID, catName) => {
  const sql = `UPDATE Category SET Cat_Name = '${catName}' WHERE Cat_ID = '${catID}'`
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject('Error Updated Category.\n',err);
      }
      return resolve(`Updated Category '${catName}' Successfully.`);
    })
  })
}

const deleteCat = async (catID) => {
  const sql = `DELETE FROM Category WHERE Cat_ID = '${catID}'`
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        return reject('Error Deleted Category.\n',err);
      }
      return resolve(`Deleted Category '${catID}' Successfully.`);
    })
  })
}

//Device TB
const createDevice = async (deviceName,apiKey,accId) => {
  const now = new Date();
  const datetime = formatDate(now)
  const sql = `INSERT INTO Device (Device_ID, Device_Name, API_key, Create_ts, Create_by) VALUES (UUID(), '${deviceName}', '${apiKey}', '${datetime}', '${accId})`
  try {
    await db_query(sql);
    return "Inserted Device Successfully."
  } catch (error) {
    return `Error Inserting Device ${error}`
  }
}

const getDevice = async (deviceID) => {
  const sql = `SELECT * FROM Device WHERE Device_ID = '${deviceID}'`
  try {
    const result = await db_query(sql);
    return result;
  } catch (error) {
    return `Error Getting Device ${error}`
  }
}

const updateDevice = async (deviceID, deviceName, catID, macaddr, located, apiStatus, RegTs) => {
  const sql = `UPDATE Device SET Device_Name = '${deviceName}', Cat_ID = ${catID}, MAC_Address = '${macaddr}', Location = ${located}, api_status = '${apiStatus}', Register_ts = '${RegTs}' WHERE Device_ID = '${deviceID}'`
  try {
    const result = await db_query(sql)
    return 'Updated Device Successfully.'
  } catch (error) {
    return `Error Updating Device ${error}`
  }
}

const deleteDevice = async (deviceID) => {
  const sql = `DELETE FROM Device WHERE Device_ID = '${deviceID}'`
  try {
    const result = await db_query(sql)
    return 'Deleted Device Successfully.'
  } catch (error) {
    return `Error Deleting Device ${error}`
  }
}

// Device_Data TB
const insertData = async (deviceID, data) => {
  const now = new Date();
  const datetime = formatDate(now)
  const sql = `INSERT INTO Device_Data (Device_ID, Timestamp, EC, Temp_Water, PH, Temp, Humidity) VALUES ('${deviceID}', ${datetime}, ${data[0]}, ${data[1]}, ${data[2]}, ${data[3]}, ${data[4]})`
  try {
    await db_query(sql);
    return "Inserted Data Successfully."
  } catch (error) {
    return `Error Inserting Data ${error}`
  }
}

const getData = async (deviceID) => {
  const sql = `SELECT * FROM Device_Data WHERE Device_ID = '${deviceID}'`
  try {
    const result = await db_query(sql);
    return result;
  } catch (error) {
    return `Error Getting Data ${error}`
  }
}

//Notification TB
const insertNoti = async (accID, deviceID) => {
  const sql = `INSERT INTO Notification (Acc_ID, Device_ID) VALUES ('${accID}', '${deviceID}')`
  try {
    await db_query(sql);
    return "Inserted Notification Successfully."
  } catch (error) {
    return `Error Inserting Notification ${error}`
  }
}

const getNoti = async (deviceID) => {
  const sql = `SELECT * FROM Notification WHERE Device_ID = '${deviceID}'`
  try {
    const result = await db_query(sql);
    return result;
  } catch (error) {
    return `Error Getting Notification ${error}`
  }
}

const updateNoti = async (deviceID, datamin, datamax) => {
  const sql = `UPDATE Notification SET EC_min = ${datamin[0]}, EC_max = ${datamax[0]}, PH_min = ${datamin[1]}, PH_max = ${datamax[1]}, Temp_min = ${datamin[2]}, Temp_max = ${datamax[2]}, Humi_min = ${datamin[3]}, Humi_max = ${datamax[3]} WHERE Device_ID = '${deviceID}'`
  try {
    const result = await db_query(sql)
    return 'Updated Notification Successfully.'
  } catch (error) {
    return `Error Updating Notification ${error}`
  }
}

//Report TB
const insertRp = async (accID, topic, detail) => {
  const now = new Date();
  const datetime = formatDate(now)
  const sql = `INSERT INTO Report (accID, topic, detail, timestamp) VALUES ('${accID}', '${topic}', '${detail}', '${datetime}')`
  try {
    await db_query(sql);
    return "Inserted Report Successfully."
  } catch (error) {
    return `Error Inserting Report ${error}`
  }
}

const updateRp = async (rpID, status) => {
  const sql = `UPDATE Report SET status = '${status}' WHERE id = '${rpID}'`
  try {
    const result = await db_query(sql)
    return 'Updated Report Successfully.'
  } catch (error) {
    return `Error Updating Report ${error}`
  }
}

//Log TB
const insertLog = async (accId, action, detail) => {
  const now = new Date();
  const datetime = formatDate(now)
  const sql = `INSERT INTO Log (Account_ID, Action, Detail, Timestamp) VALUES ('${accId}', '${action}', '${detail}', '${datetime}')`
  try {
    await db_query(sql);
    return "Inserted Log Successfully."
  } catch (error) {
    return `Error Inserting Log ${error}`
  }
}

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
};