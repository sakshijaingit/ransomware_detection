import os
import signal

def kill_process(pid):
    try:
        os.kill(pid, signal.SIGTERM)
        print(f"🛑 Process {pid} terminated")
    except Exception as e:
        print(f"❌ Failed to kill process: {e}")
