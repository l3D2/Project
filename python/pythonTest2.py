import random
from datetime import datetime, timedelta
import mysql.connector
from mysql.connector import Error


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

    return random_time, EC, Temp_Water, PH, Temp, Humidity


def insert_data(mycursor, device_id, random_time, EC, Temp_Water, PH, Temp, Humidity):
    sql = "INSERT INTO Device_Data (device_id, datetime, EC, Temp_Water, PH, Temp, Humidity) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    val = (device_id, random_time, EC, Temp_Water, PH, Temp, Humidity)
    mycursor.execute(sql, val)


def main():
    try:
        # ข้อมูลเชื่อมต่อฐานข้อมูล
        mydb = mysql.connector.connect(
            host="210.246.215.31",
            user="maiok01",
            password="maiok01",
            database="IoT_DB",
        )

        if mydb.is_connected():
            mycursor = mydb.cursor()

            # กำหนดค่าคงที่
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
            start_date = datetime(2024, 8, 14)  # ปรับช่วงวันที่ตามต้องการ
            end_date = datetime.today()

            # สร้างข้อมูลสุ่ม 1200 รายการ (ปรับจำนวนตามต้องการ)
            for _ in range(1200):
                device_id = random.choice(device_ids)
                random_time, EC, Temp_Water, PH, Temp, Humidity = generate_random_data(
                    start_date, end_date
                )
                insert_data(
                    mycursor, device_id, random_time, EC, Temp_Water, PH, Temp, Humidity
                )

            mydb.commit()
            print(mycursor.rowcount, "record(s) inserted.")

    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if mydb.is_connected():
            mycursor.close()
            mydb.close()
            print("MySQL connection is closed")


if __name__ == "__main__":
    main()
