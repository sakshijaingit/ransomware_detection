import os

previous_sizes = {}

def detect_size_change(filepath):
    try:
        size = os.path.getsize(filepath)
    except FileNotFoundError:
        return False

    if filepath in previous_sizes:
        diff = abs(previous_sizes[filepath] - size)
        if diff > 100:   # bytes threshold
            return True

    previous_sizes[filepath] = size
    return False
