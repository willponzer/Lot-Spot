import base64
import cv2
import time
from inference import get_model
import supervision as sv

# Function to encode image from frame to base64
def encode_frame_to_base64(frame):
    _, buffer = cv2.imencode('.jpg', frame)
    return base64.b64encode(buffer).decode('utf-8')

# Initialize the client
model = get_model(model_id="parking-detection-mitok/2", api_key="GFEjhf91EQyU1Gs4mPkQ")

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
    success, frame = cap.read()
    if not success:
        break

    if frame_count % frame_interval == 0:
        # Encode the frame to base64
        image_base64 = encode_frame_to_base64(frame)

        # Run inference on the base64-encoded frame
        results = model.infer(image_base64)[0]

        # Load the results into the supervision Detections API
        detections = sv.Detections.from_inference(results)

        # Annotate the frame with our inference results
        box_annotator = sv.BoxAnnotator()
        label_annotator = sv.LabelAnnotator()
        annotated_image = box_annotator.annotate(scene=frame, detections=detections)
        annotated_image = label_annotator.annotate(scene=annotated_image, detections=detections)

        # Display the annotated frame
        cv2.imshow('Annotated Frame', annotated_image)

        # Pause for a specified duration (in seconds)
        time.sleep(2)  # Adjust the duration as needed

        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    frame_count += 1

cap.release()
cv2.destroyAllWindows()