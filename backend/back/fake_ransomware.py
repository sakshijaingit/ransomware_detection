import os
import time

TARGET_DIR = "honeypot"

print("🚨 Fake ransomware started...")
while True:
    for file in os.listdir(TARGET_DIR):
        path = os.path.join(TARGET_DIR, file)
        try:
            with open(path, "a") as f:
                f.write("ENCRYPTED_DATA\n")
            print(f"Encrypting {file}")
        except:
            pass
        time.sleep(0.2)
