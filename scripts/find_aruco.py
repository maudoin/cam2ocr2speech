!pip install opencv-python
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

# Greedy selection of 6 most distinct markers
selected = [0]  # Start with marker 0
while len(selected) < 6:
    best_candidate = None
    best_score = -1
    for candidate in range(num_markers):
        if candidate in selected:
            continue
        min_dist = min(distance_matrix[candidate][s] for s in selected)
        if min_dist > best_score:
            print(best_candidate,"\n")
            best_score = min_dist
            best_candidate = candidate
    selected.append(best_candidate)

print("Greedy-selected marker IDs:", selected) #[0, 18, 72, 17, 22, 37]