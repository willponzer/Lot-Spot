# SCRIPT RAN ON RASPBERRY PI - SEE README FOR INSTALLATION INSTRUCTIONS
import os
import time
from datetime import datetime
import subprocess

# Configuration
PHOTO_DIR = "/home/lotspot/Videos"  # Directory to save captured photos
PHOTO_PREFIX = "photo_"
CAPTURE_INTERVAL = 10  # Time in seconds between captures

def ensure_directory_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created directory: {directory}")

def capture_photo():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    photo_name = f"{PHOTO_PREFIX}{timestamp}.jpg"
    photo_path = os.path.join(PHOTO_DIR, photo_name)

    try:
        # Use libcamera-still to capture a photo
        subprocess.run(
            ["libcamera-still", "-o", photo_path, "--width", "1920", "--height", "1080", "-q", "95"],
            check=True
        )
        print(f"Captured photo: {photo_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error capturing photo: {e}")

def main():
    ensure_directory_exists(PHOTO_DIR)

    print(f"Starting photo capture. Saving photos to {PHOTO_DIR}")
    print(f"Capturing photos every {CAPTURE_INTERVAL} seconds...")

    try:
        while True:
            capture_photo()
            time.sleep(CAPTURE_INTERVAL)
    except KeyboardInterrupt:
        print("\nPhoto capture stopped.")

if __name__ == "__main__":
    main()
