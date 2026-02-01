import os
from config import RANSOM_NOTES

def detect_ransom_note(filepath):
    filename = os.path.basename(filepath)
    return filename in RANSOM_NOTES
