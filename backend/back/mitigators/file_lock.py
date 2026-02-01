import os
import stat

def lock_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            path = os.path.join(root, file)
            try:
                os.chmod(path, stat.S_IREAD)
            except:
                pass
    print("🔒 Honeypot files locked (read-only)")
