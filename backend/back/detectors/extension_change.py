import os

previous_extensions = {}

def detect_extension_change(filepath):
    name, ext = os.path.splitext(filepath)

    if filepath in previous_extensions:
        if previous_extensions[filepath] != ext:
            return True

    previous_extensions[filepath] = ext
    return False
