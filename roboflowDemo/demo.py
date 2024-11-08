import base64
import cv2
from inference import get_model
import supervision as sv

# Function to encode image to base64
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Define the image file to use for inference
# image_file = "roboflowDemo/parkingLot2.jpg"
image_file = "roboflowDemo/parkingLot2.jpg"

# Encode the image to base64
image_base64 = encode_image_to_base64(image_file)

# Load a pre-trained yolov8n model
model = get_model(model_id="parking-detection-mitok/2", api_key="GFEjhf91EQyU1Gs4mPkQ")

# Run inference on the base64-encoded image
results = model.infer(image_base64)[0]

# Load the results into the supervision Detections API
detections = sv.Detections.from_inference(results)

# Read the image using OpenCV for annotation
image = cv2.imread(image_file)

# Create supervision annotators
box_annotator = sv.BoxAnnotator()
label_annotator = sv.LabelAnnotator()

# Annotate the image with our inference results
annotated_image = box_annotator.annotate(scene=image, detections=detections)
annotated_image = label_annotator.annotate(scene=annotated_image, detections=detections)

# Display the image
sv.plot_image(annotated_image)