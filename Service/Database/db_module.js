const mysql = require('mysql');

const connection = mysql.createConnection({
  connectionLimit: 10,
  host: '210.246.215.31',
  user: 'BD2',
  password: 'BD22342197',
  database: 'IoT_DB',
  port:"3306"
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


const db_query = async (sql) => {
  try {
    const result = await connection.query(sql);
    return result;
  } catch (err) {
    console.error("Error Query =>", err);
    throw err;
  }
}
// Account TB
const insertUser = async (name,email,tk) => {
  const now = new Date();
  const datetime = now.toISOString()
  const sql = `INSERT INTO Account (Account_ID, Name, Email, Token, Signup_ts) VALUES (UUID(), '${name}', '${email}', '${tk}', '${datetime}')`
  try {
    await db_query(sql);
    return "Inserted User Successfully."
  } catch (error) {
    return `Error Inserting User ${error}`
  }
}

const getUser = async (gID) => {
  const sql = `SELECT * FROM Account WHERE Google_Id = '${gID}'`
  try {
    const result = await db_query(sql);
    return result;
  } catch (error) {
    return `Error Getting User ${error}`
  }

}

const updateUser = async (gID, name, lineTk) => {
  const now = new Date();
  const datetime = now.toISOString()
  const sql = `UPDATE Account SET Name = '${name}', Token = '${lineTk}', Signup_ts = '${datetime}' WHERE Google_Id = '${gID}'`
  try {
    const result = await db_query(sql)
    return 'Updated User Successfully.'
  } catch (error) {
    return `Error Updating User ${error}`
  }
}

// Category TB

const insertCat = async (accId, catName) => {
  const sql = `INSERT INTO Category (Account_ID, Cat_Name) VALUES ('${accId}', '${catName}')`
  try {
    await db_query(sql);
    return "Inserted Category Successfully."
  } catch (error) {
    return `Error Inserting Category ${error}`
  }
}

module.exports = {
  insertUser,
  getUser,
  updateUser
};