const mysql = require("mysql");
require("dotenv").config();

const config = {
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  dbTB: process.env.DB_NAME,
};

let connection; // Create a global connection variable to avoid redundant creation

const connectDatabase = async () => {
  if (!connection) {
    // Check if connection is already established
    try {
      connection = mysql.createConnection({
        connectionLimit: 20,
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: config.dbTB,
        port: "3306",
      });

      await connection.connect(); // Use await for asynchronous connection
      console.log("Connected to MySQL database");
    } catch (err) {
      console.error("Error connecting to database:", err);
      throw err; // Re-throw the error for proper handling
    }
  }
};

const disconnectDatabase = async () => {
  if (connection) {
    try {
      await connection.end();
      console.log("Disconnected from MySQL database");
      connection = null; // Reset connection variable
    } catch (err) {
      console.error("Error disconnecting from database:", err);
      throw err; // Re-throw the error for proper handling
    }
  }
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
  try {
    await connectDatabase(); // Ensure connection is established
    const result = await new Promise((resolve, reject) => {
      connection.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    await disconnectDatabase(); // Disconnect after query execution
    return result;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err; // Re-throw the error for proper handling
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  query_sql,
};
