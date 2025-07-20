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
selected = [1]  # Start with marker 1
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

# [0, 18, 72, 17, 22, 37]

# [1, 9, 10, 12, 15, 18, 33, 38, 69, 79]
# Marker ID 1: 0x0e037300
# Marker ID 9: 0x989fd201
# Marker ID 10: 0x9e770101
# Marker ID 12: 0xf3158801
# Marker ID 15: 0x28f1bf01
# Marker ID 18: 0x7b26e200
# Marker ID 33: 0x25556400
# Marker ID 38: 0x4d568e01
# Marker ID 69: 0xf4ea1900
# Marker ID 79: 0xcb689600