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

# Extract only the class values from the predictions
class_values = [detection['class'] for detection in result['predictions']]

# Pretty-print the class values
print(json.dumps(class_values, indent=4))

# Check if `result` is a dictionary (which is the typical structure for parsed JSON)

#print(json.dumps(result, indent=4))  # Pretty-print the JSON

# Initialize counters for empty and occupied
total_empty = 0
total_occupied = 0


# Iterate through the results and count the classes
for detection in result['predictions']:
    if detection['class'] == 'empty':
        total_empty += 1
    elif detection['class'] == 'occupied':
        total_occupied += 1

total_spots = total_empty + total_occupied
# Print the totals
print(f"Total empty: {total_empty}")
print(f"Total occupied: {total_occupied}")
print(f"Total spots: {total_spots}")


