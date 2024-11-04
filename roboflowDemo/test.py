import base64
from inference_sdk import InferenceHTTPClient
import json

# Read the image file and encode it in base64
def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Initialize the client
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="GFEjhf91EQyU1Gs4mPkQ"
)

# Encode the image
image_base64 = encode_image_to_base64("roboflowDemo/parkingLot2.jpg")

# Perform inference
result = CLIENT.infer(image_base64, model_id="parking-detection-mitok/2")


# Check if `result` is a dictionary (which is the typical structure for parsed JSON)

print(json.dumps(result, indent=4))  # Pretty-print the JSON




