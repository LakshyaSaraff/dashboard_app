from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

DB_PATH = "/home/divyesh/Desktop/db-test/temperature.db"  # Path to your database

@app.route('/api/latest')
def get_latest_readings():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT timestamp, temperature, temperature2,temperature3 FROM readings ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    return jsonify({"timestamp": row[0], "temperature1": row[1],"temperature2": row[2],"temperature3":row[3]})
    
@app.route('/api/history')
def get_temp_history():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT timestamp, temperature FROM readings ORDER BY id DESC LIMIT 20")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([{"time": r[0], "value": r[1]} for r in rows[::-1]])  # reverse to get ascending order

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
