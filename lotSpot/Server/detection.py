import base64
import cv2
import json
import requests
import sys
from inference_sdk import InferenceHTTPClient

def process_video(video_path):
    # Initialize client
    CLIENT = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key="GFEjhf91EQyU1Gs4mPkQ"
    )
    
    # Capture video from path provided by Node.js
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    success, frame = cap.read()
    if not success:
        return

    # Encode frame to base64
    _, buffer = cv2.imencode('.jpg', frame)
    image_base64 = base64.b64encode(buffer).decode('utf-8')
    
    # Perform inference
    result = CLIENT.infer(image_base64, model_id="parking-detection-mitok/2")
    
    # Count spots
    total_empty = sum(1 for d in result['predictions'] if d['class'].lower() == 'empty')
    total_occupied = sum(1 for d in result['predictions'] if d['class'].lower() == 'filled')
    total_spots = total_empty + total_occupied
    
    # Send data to server
    data = {
        "availableSpots": total_empty,
        "occupiedSpots": total_occupied,
        "totalSpots": total_spots
    }
    
    response = requests.post('http://localhost:3000/api/update-parking', json=data)
    if response.status_code != 200:
        print("Failed to send data to server")

    cap.release()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        process_video(sys.argv[1])
    else:
        print("No video path provided")