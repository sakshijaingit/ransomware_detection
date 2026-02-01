import time
from collections import defaultdict

modifications = defaultdict(list)

def detect_fast_modification(filepath):
    now = time.time()
    modifications[filepath].append(now)

    # keep only last 5 seconds
    modifications[filepath] = [
        t for t in modifications[filepath] if now - t < 5
    ]

    if len(modifications[filepath]) >= 3:
        return True
    return False
