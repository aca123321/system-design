import json
import random

k = 500000 # no. of keys
n = 4 # no. of nodes

hash_space = 100000000000000

key_hashes = [[random.randint(0, hash_space), i] for i in range(k)]
node_hashes = [[random.randint(0, hash_space), i] for i in range(n)]

key_hashes.sort()
node_hashes.sort()

original_mapping = {}
node_index = 0
key_index = 0
while key_index < k:
  [key_hash, key_id] = key_hashes[key_index]
  [node_hash, node_id] = node_hashes[node_index]
  if key_hash <= node_hash:
    original_mapping[key_id] = node_id
    key_index += 1
  elif (node_index == n-1):
    original_mapping[key_id] = node_hashes[0][1]
    key_index += 1
  else:
    node_index = node_index + 1

# New node added
node_hashes.append([random.randint(0, hash_space), n])
node_hashes.sort()

new_mapping = {}
node_index = 0
key_index = 0
while key_index < k:
  [key_hash, key_id] = key_hashes[key_index]
  [node_hash, node_id] = node_hashes[node_index]
  if key_hash <= node_hash:
    new_mapping[key_id] = node_id
    key_index += 1
  elif (node_index == n):
    new_mapping[key_id] = node_hashes[0][1]
    key_index += 1
  else:
    node_index = node_index + 1
    

need_relocation = 0
for key_index in range(k):
  [key_hash, key_id] = key_hashes[key_index]
  if original_mapping[key_id] != new_mapping[key_id]:
    need_relocation += 1
    
effectiveness = ((k-need_relocation)/k)*100
print(f"Effectiveness: {effectiveness:.2f}")