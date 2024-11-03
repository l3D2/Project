const mysql = require('mysql');
require("dotenv").config();

const config = {
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  dbTB: process.env.DB_NAME,
};

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbTB,
});

let offline = [];
// ฟังก์ชันในการรันคำสั่ง SQL
function updateDeviceStatus() {
    const timestamp = new Date(); // Get the current date and time
  const gmt7Time = timestamp.toLocaleString("en-GB", {
    timeZone: "Asia/Bangkok", // GMT+7
    hour12: false, // Use 24-hour format
  });
  const query = `
    UPDATE Device d
    JOIN (
      SELECT device_id, MAX(datetime) AS last_datetime
      FROM Device_Data
      GROUP BY device_id
    ) dd ON d.device_id = dd.device_id
    SET d.status = CASE
      WHEN TIMESTAMPDIFF(MINUTE, dd.last_datetime, NOW()) > d.interval THEN 0
      ELSE 1
    END;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
    } else {
      console.log(`Time>> ${gmt7Time} | Rows affected: ${results.affectedRows}`);
      checkDeviceStatus()
    }
  });
}

// ฟังก์ชันในการเช็คสถานะอุปกรณ์
function checkDeviceStatus() {
    const query = `
      SELECT device_id, device_name, mac_address, status
      FROM Device;
    `;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
      } else {
        results.forEach((row) => {
          if (row.status === 0) {
            // Check if the device_id is already in the offline array
            if (!offline.includes(row.device_id)) {
              offline.push(row.device_id); // Add to offline if not present
            }
          } else {
            // Remove device_id from offline if it exists and status is not 0
            const index = offline.indexOf(row.device_id);
            if (index > -1) {
              offline.splice(index, 1); // Remove from offline if present
            }
          }
        });
      }
    });
  }

// เรียกใช้ฟังก์ชันทุกๆ 5 วินาที (5000 มิลลิวินาที)
// setInterval(checkDeviceStatus, 5000);
setInterval(updateDeviceStatus, 5000);
