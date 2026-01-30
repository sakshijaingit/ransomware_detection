
import os
import time
import psutil
from threading import Thread
from flask import Flask, jsonify
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from flask_cors import CORS

# ---------------- CONFIG ----------------
HONEYPOT_DIR = "honeypot"
REALFILES_DIR = "real_files"
CHECK_INTERVAL = 1
FILE_THRESHOLD = 2
# ----------------------------------------

app = Flask(__name__)
CORS(app)

# -------- GLOBAL STATE --------
modified_files = set()
baseline_sizes = {}   # original file sizes
honeypot_files = set()
real_files = set()

mod_count = 0
mitigation_active = False

status = {
    "system": "SAFE",
    "mitigation": False,
    "metrics": {}
}

logs = []
damage_history = []   # 👈 FOR GRAPH (time vs damage)

# -------- INITIAL SCAN --------
def scan_files():
    for folder, target_set in [
        (HONEYPOT_DIR, honeypot_files),
        (REALFILES_DIR, real_files)
    ]:
        for root, _, files in os.walk(folder):
            for f in files:
                path = os.path.join(root, f)
                target_set.add(path)
                baseline_sizes[path] = os.path.getsize(path)

# -------- LOGGING --------
def log_event(event, file="N/A"):
    logs.append({
        "event": event,
        "file": file,
        "time": time.strftime("%Y-%m-%d %H:%M:%S")
    })


def kill_fake_ransomware():
    global mitigation_active

    for p in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            cmd = " ".join(p.info.get('cmdline', []))

            if "fake_ransomware" in cmd:
                pid = p.info['pid']
                name = p.info.get('name', 'unknown')

                psutil.Process(pid).terminate()
                mitigation_active = True

                log_event(
                    "🛑 Fake ransomware terminated",
                    f"PID: {pid},"
                )

        except psutil.NoSuchProcess:
            pass
        except psutil.AccessDenied:
            # Optional: keep or remove this
            log_event("⚠️ Access denied while terminating", f"PID: {p.info.get('pid')}")
        except Exception:
            # ❌ Do nothing → removes termination error from dashboard
            pass


# -------- FILE WATCHER --------
class HoneypotHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global mod_count
        if not event.is_directory:
            mod_count += 1
            modified_files.add(event.src_path)
            log_event("Detected modification", event.src_path)

# -------- DAMAGE CALCULATION --------
def calculate_damage(file_set):
    damaged = 0
    total = 0

    for f in file_set:
        if not os.path.exists(f):
            continue
        base = baseline_sizes.get(f, 0)
        curr = os.path.getsize(f)
        total += base
        if curr > base:
            damaged += (curr - base)

    if total == 0:
        return 0

    return min(int((damaged / total) * 100*5), 100)

# -------- METRICS --------
def calculate_metrics():
    return {
        "honeypot_damage": calculate_damage(honeypot_files),
        "real_file_damage": calculate_damage(real_files),
        "cpu_stress": int(psutil.cpu_percent()),
        "lockdown": 100 if mitigation_active else 0
    }

# -------- MONITOR LOOP --------
def monitor():
    global mod_count, mitigation_active

    scan_files()

    observer = Observer()
    observer.schedule(HoneypotHandler(), HONEYPOT_DIR, recursive=True)
    observer.start()

    start_time = time.time()

    while True:
        time.sleep(CHECK_INTERVAL)

        # if mod_count >= FILE_THRESHOLD:
        #     status["system"] = "ATTACK"
        #     kill_fake_ransomware()
        # else:
        #     status["system"] = "SAFE"
        #     mitigation_active = False

        if mod_count >= FILE_THRESHOLD:
            status["system"] = "ATTACK"
            mitigation_active = True
            status["ransom_alert"] = True   
            kill_fake_ransomware()
        else:
            status["system"] = "SAFE"
            mitigation_active = False
            status["ransom_alert"] = False 


        status["mitigation"] = mitigation_active
        status["metrics"] = calculate_metrics()

        # 📈 STORE HISTORY FOR GRAPH
        damage_history.append({
            "time": int(time.time() - start_time),
            "honeypot": status["metrics"]["honeypot_damage"],
            "real": status["metrics"]["real_file_damage"]
        })

        if len(damage_history) > 60:
            damage_history.pop(0)

        mod_count = 0
        

# -------- API --------
@app.route("/status")
def get_status():
    return jsonify(status)

@app.route("/logs")
def get_logs():
    return jsonify(logs[-40:])

@app.route("/history")
def get_history():
    return jsonify(damage_history)

# -------- MAIN --------
if __name__ == "__main__":
    os.makedirs(HONEYPOT_DIR, exist_ok=True)
    os.makedirs(REALFILES_DIR, exist_ok=True)

    Thread(target=monitor, daemon=True).start()
    app.run(port=5000)
















