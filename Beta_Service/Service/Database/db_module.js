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
    return result; // Return the actual query result
  } catch (err) {
    console.error("Error Query =>", err);
    throw err; // Re-throw the error for proper handling
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

const getUser = async () => {
  const sql = `SELECT * FROM Account`
  try {
    const result = await db_query(sql);
    return result;
  } catch (error) {
    return `Error Getting User ${error}`
  }

}

const updateUser = async () => {
  const now = new Date();
  const datetime = now.toISOString()
  const sql = ``
}

module.exports = { db_query };