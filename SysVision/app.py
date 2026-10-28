from flask import Flask, jsonify, render_template
from datetime import datetime, timezone
import platform
import shutil
import psutil

app = Flask(__name__)

def get_system_stats():
    memory = psutil.virtual_memory()
    disk = shutil.disk_usage("/")
    boot_time = datetime.fromtimestamp(psutil.boot_time(), timezone.utc).astimezone()
    return {
        "timestamp": datetime.now().astimezone().isoformat(),
        "hostname": platform.node() or "Local computer",
        "platform": platform.platform(),
        "processor": platform.processor() or platform.machine() or "Not reported",
        "cpu_percent": psutil.cpu_percent(interval=0.15),
        "memory_percent": memory.percent,
        "memory_used_gb": round(memory.used / (1024 ** 3), 2),
        "memory_total_gb": round(memory.total / (1024 ** 3), 2),
        "disk_percent": round((disk.used / disk.total) * 100, 1) if disk.total else 0,
        "disk_used_gb": round(disk.used / (1024 ** 3), 2),
        "disk_total_gb": round(disk.total / (1024 ** 3), 2),
        "uptime_hours": round((datetime.now().astimezone() - boot_time).total_seconds() / 3600, 1),
        "data_source": "live"
    }

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/stats")
def stats():
    try:
        return jsonify(get_system_stats())
    except Exception as exc:
        return jsonify({"error": "Could not read system statistics", "details": str(exc)}), 500

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "service": "SysVision local monitor"})

if __name__ == "__main__":
    # Bind to localhost only; this service is intended for the same computer.
    app.run(host="127.0.0.1", port=5000, debug=False)
