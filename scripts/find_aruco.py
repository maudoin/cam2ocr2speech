import cv2
import cv2.aruco as aruco
import numpy as np

# Load dictionary
dictionary = aruco.getPredefinedDictionary(aruco.DICT_5X5_100)
num_markers = dictionary.bytesList.shape[0]

# Precompute Hamming distance matrix
distance_matrix = np.zeros((num_markers, num_markers), dtype=int)
for i in range(num_markers):
    for j in range(i + 1, num_markers):
        dist = cv2.norm(dictionary.bytesList[i], dictionary.bytesList[j], cv2.NORM_HAMMING)
        distance_matrix[i, j] = dist
        distance_matrix[j, i] = dist
    
# Greedy selection of 10 most distinct markers
selected = [0]  # Start with marker 0
while len(selected) < 10:
    best_candidate = None
    best_score = -1
    for candidate in range(num_markers):
        if candidate in selected:
            continue
        min_dist = min(distance_matrix[candidate][s] for s in selected)
        if min_dist > best_score:
            # print(best_candidate,"\n")
            best_score = min_dist
            best_candidate = candidate
    selected.append(best_candidate)

selected.sort()

print(selected);

# Convert marker bytes to hex
def marker_to_hex(marker_id):
    marker_bytes = dictionary.bytesList[marker_id][0]
    # Each marker is stored as a 4-byte array
    return ''.join(f'{byte:02x}' for byte in marker_bytes)

for marker in selected:
    print(f"Marker ID {marker}: 0x{marker_to_hex(marker)}")
    
# [0, 8, 14, 17, 18, 22, 37, 55, 72, 83]
# Marker ID 0: 0xa2d95e00
# Marker ID 8: 0x86b09900
# Marker ID 14: 0xfe7e5400
# Marker ID 17: 0x5f513701
# Marker ID 18: 0x7b26e200
# Marker ID 22: 0xb5865001
# Marker ID 37: 0x41688001
# Marker ID 55: 0xac65c601
# Marker ID 72: 0xd88d2901
# Marker ID 83: 0x05aa3e00