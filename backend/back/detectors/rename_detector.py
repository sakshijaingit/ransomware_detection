renamed_files = set()

def detect_rename(src, dest):
    if src != dest:
        renamed_files.add(dest)
        if len(renamed_files) > 3:
            return True
    return False
