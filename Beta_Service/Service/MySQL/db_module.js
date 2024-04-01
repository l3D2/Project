const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'iot_database'
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


const db_query = (sql) => {
    connection.query(sql , (err, result) => {
        if (err) {
            return err
        }
        return result
    })
}

module.exports = { db_query };