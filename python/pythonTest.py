import random
from datetime import datetime, timedelta
import mysql.connector

# ข้อมูลเชื่อมต่อฐานข้อมูล
mydb = mysql.connector.connect(
    host="210.246.215.31",
    user="maiok01",
    password="maiok01",
    database="IoT_DB",
)

mycursor = mydb.cursor()


def generate_random_data(start_date, end_date):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + timedelta(days=random_number_of_days)

    random_time = datetime.combine(random_date, datetime.min.time())
    random_time += timedelta(seconds=random.randint(0, 86399))  # 86400 วินาทีใน 1 วัน

    # สุ่มค่าอื่นๆ (ปรับช่วงตามต้องการ)
    EC = random.randint(1, 10)
    Temp_Water = random.randint(0, 100)
    PH = random.randint(0, 14)
    Temp = random.randint(0, 50)
    Humidity = random.randint(0, 100)

    sql = "INSERT INTO Device_Data (device_id, datetime, EC, Temp_Water, PH, Temp, Humidity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    val = (device_id, random_time, EC, Temp_Water, PH, Temp, Humidity)
    mycursor.execute(sql, val)
    return random_time, EC, Temp_Water, PH, Temp, Humidity


# กำหนดค่าคงที่
device_id = "07408530-4b22-11ef-968b-42fe22515858"
start_date = datetime(2023, 1, 1)  # ปรับช่วงวันที่ตามต้องการ
end_date = datetime(2023, 12, 31)

# สร้างข้อมูลสุ่ม 10 รายการ (ปรับจำนวนตามต้องการ)
for _ in range(10):
    random_time, EC, Temp_Water, PH, Temp, Humidity = generate_random_data(
        start_date, end_date
    )

    # สร้างคำสั่ง INSERT (ปรับตามโครงสร้างตารางของคุณ)
    insert_query = f"INSERT INTO Device_Data (device_id, datetime, EC, Temp_Water, PH, Temp, Humidity) VALUES ('{device_id}', '{random_time}', {EC}, {Temp_Water}, {PH}, {Temp}, {Humidity})"
    print(insert_query)
    mydb.commit()
    print(mycursor.rowcount, "record(s) inserted.")
