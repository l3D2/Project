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

# รายการ device_id ที่จะสุ่ม
device_ids = [
    "0c6d9046-4b22-11ef-968b-42fe22515858",
    "7303650f-4b24-11ef-968b-42fe22515858",
    "73076da4-4b24-11ef-968b-42fe22515858",
    "73058b2b-4b24-11ef-968b-42fe22515858",
    "730931a7-4b24-11ef-968b-42fe22515858",
    "730b5938-4b24-11ef-968b-42fe22515858",
    "730cdb82-4b24-11ef-968b-42fe22515858",
    "730eb16d-4b24-11ef-968b-42fe22515858",
    "73103874-4b24-11ef-968b-42fe22515858",
    "7311c01b-4b24-11ef-968b-42fe22515858",
    "73134662-4b24-11ef-968b-42fe22515858",
    "f254aa61-4b21-11ef-968b-42fe22515858",
]


def generate_data_for_all_days(start_date, end_date):
    data_to_insert = []
    current_date = start_date
    while current_date <= end_date:
        random_time = datetime.combine(current_date, datetime.min.time())
        random_time += timedelta(seconds=random.randint(0, 86399))

        # สุ่มค่าอื่นๆ (ปรับช่วงตามต้องการ)
        device_id = random.choice(device_ids)
        EC = random.randint(1, 10)
        Temp_Water = random.randint(0, 100)
        PH = random.randint(0, 14)
        Temp = random.randint(0, 50)
        Humidity = random.randint(0, 100)

        data_to_insert.append(
            (device_id, random_time, EC, Temp_Water, PH, Temp, Humidity)
        )
        current_date += timedelta(days=1)

    sql = "INSERT INTO Device_Data (device_id, datetime, EC, Temp_Water, PH, Temp, Humidity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    mycursor.executemany(sql, data_to_insert)
    mydb.commit()
    print(mycursor.rowcount, "records inserted.")


# กำหนดค่าคงที่
for i in range(5):
    start_date = datetime(2021, 9, 13)  # ปรับช่วงวันที่ตามต้องการ
    end_date = datetime.today()

# สร้างข้อมูลสุ่มสำหรับทุกวันในปี 2023
generate_data_for_all_days(start_date, end_date)
