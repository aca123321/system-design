import json
import math

k = 100 # no. of keys, also the hash values for now
n = 4 # no. of nodes

original_mapping = [(i%n) for i in range(k)]

# new node added
new_mapping = [(i%(n+1)) for i in range(k)]

need_relocation = 0
relocations = {}
for i in range(k):
  if original_mapping[i] != new_mapping[i]:
    need_relocation += 1
    relocations[i] = [original_mapping[i], new_mapping[i]]
    
with open("./relocations.json", "w") as f:
  f.write(json.dumps(relocations, indent=2))

print(f"{need_relocation} keys need relocation")

estimated_effectiveness = (n/math.lcm(n, n+1))*100.0
actual_effectiveness = ((k-need_relocation)/k)*100.0
print(f"estimated_effectiveness = {estimated_effectiveness:.2f}")
print(f"actual_effectiveness = {actual_effectiveness:.2f}")

"""
pattern is:
0 to n -> same nodes
then till the LCM of n and (n+1), they'd need to be remapped
then from LCM(n, n+1) to LCM(n, n+1) + n, no remapping is required
Similarly, for a.LCM(n, n+1) to a.LCM(n, n+1)+n, no remapping is required

effectiveness = %age of keys not remapped (on average) = (n/LCM(n, n+1))*100
"""