import cv2
import cv2.aruco as aruco

# Marker IDs to extract
marker_ids = [0, 18, 72, 17, 22, 37]

# Load dictionary
dictionary = aruco.getPredefinedDictionary(aruco.DICT_5X5_100)

# Convert marker bytes to hex
def marker_to_hex(marker_bytes):
    # Each marker is stored as a 4-byte array
    return ''.join(f'{byte:02x}' for byte in marker_bytes)

# Extract and print hex codes
for marker_id in marker_ids:
    marker_bytes = dictionary.bytesList[marker_id][0]
    hex_code = marker_to_hex(marker_bytes)
    print(f"Marker ID {marker_id}: 0x{hex_code}")
#Marker ID 0: 0xa2d95e00
#Marker ID 18: 0x7b26e200
#Marker ID 72: 0xd88d2901
#Marker ID 17: 0x5f513701
#Marker ID 22: 0xb5865001
#Marker ID 37: 0x41688001