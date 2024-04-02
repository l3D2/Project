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


const db_query = (sql) => {
    connection.query(sql , (err, result) => {
        if (err) {
            console.log(err)
            return err
        }
        console.log(result)
        return result
    })
}

module.exports = { db_query };