import base64
import cv2
import json
from inference_sdk import InferenceHTTPClient

# Function to encode image to base64
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Function to encode image from frame to base64
def encode_frame_to_base64(frame):
    _, buffer = cv2.imencode('.jpg', frame)
    return base64.b64encode(buffer).decode('utf-8')

# Initialize the client
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="GFEjhf91EQyU1Gs4mPkQ"
)

# Capture video from file
video_path = "roboflowDemo/CarPark.mp4"
cap = cv2.VideoCapture(video_path)

# Check if video opened successfully
if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

# Set the interval (in seconds) to capture frames
interval = 5
fps = cap.get(cv2.CAP_PROP_FPS)
frame_interval = int(fps * interval)

frame_count = 0

while cap.isOpened():
    sucess, frame = cap.read()
    if not sucess:
        break

    if frame_count % frame_interval == 0:
        # Encode the frame to base64
        image_base64 = encode_frame_to_base64(frame)

        # Perform inference
        result = CLIENT.infer(image_base64, model_id="parking-detection-mitok/2")

        # Extract only the class values from the predictions
        class_values = [detection['class'] for detection in result['predictions']]

        # Pretty-print the class values
        print(json.dumps(class_values, indent=4))

        # Initialize counters for empty and occupied
        total_empty = 0
        total_occupied = 0

        # Iterate through the class values and count the classes
        for class_value in class_values:
            if class_value.lower() == 'empty':
                total_empty += 1
            elif class_value.lower() == 'filled':
                total_occupied += 1

        total_spots = total_empty + total_occupied

        # Print the totals
        print(f"Total empty: {total_empty}")
        print(f"Total occupied: {total_occupied}")
        print(f"Total spots: {total_spots}")

    frame_count += 1

cap.release()
cv2.destroyAllWindows()