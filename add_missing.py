import json, os

path = os.path.join(os.path.dirname(__file__), 'hospitals.json')

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

missing = [
    {
        "name": "All India Institute of Medical Sciences (AIIMS), New Delhi",
        "state": "Delhi",
        "district": "South West Delhi",
        "address": "Sri Aurobindo Marg, Ansari Nagar",
        "phone": "011 26588500",
        "type": "Government",
        "care_type": "Medical College / Institute/Hospital",
        "lat": 28.5665, "lon": 77.2100
    },
    {
        "name": "Safdarjung Hospital",
        "state": "Delhi",
        "district": "South West Delhi",
        "address": "Ansari Nagar West",
        "phone": "011 26707444",
        "type": "Government",
        "care_type": "Hospital",
        "lat": 28.5700, "lon": 77.2060
    },
    {
        "name": "Lok Nayak Hospital",
        "state": "Delhi",
        "district": "Central Delhi",
        "address": "Jawahar Lal Nehru Marg",
        "phone": "011 23232400",
        "type": "Government",
        "care_type": "Hospital",
        "lat": 28.6386, "lon": 77.2380
    },
    {
        "name": "GTB Hospital",
        "state": "Delhi",
        "district": "East Delhi",
        "address": "Dilshad Garden",
        "phone": "011 22582013",
        "type": "Government",
        "care_type": "Hospital",
        "lat": 28.6859, "lon": 77.3169
    },
    {
        "name": "RML Hospital",
        "state": "Delhi",
        "district": "Central Delhi",
        "address": "Baba Kharak Singh Marg",
        "phone": "011 23365525",
        "type": "Government",
        "care_type": "Hospital",
        "lat": 28.6257, "lon": 77.2014
    },
    {
        "name": "SNM Hospital, Leh",
        "state": "Ladakh",
        "district": "Leh",
        "address": "Fort Road, Leh",
        "phone": "01982 252014",
        "type": "Government",
        "care_type": "Hospital",
        "lat": 34.1642, "lon": 77.5848
    },
    {
        "name": "District Hospital, Kargil",
        "state": "Ladakh",
        "district": "Kargil",
        "address": "Main Bazaar, Kargil",
        "phone": "01985 232043",
        "type": "Government",
        "care_type": "Hospital",
        "lat": 34.5539, "lon": 76.1349
    },
]

# Check which states already exist to avoid re-adding
existing_states = {h.get('state') for h in data}
to_add = [h for h in missing if h['state'] not in existing_states or True]

# Only add entries whose (name+state) combo doesn't already exist
existing_keys = {(h.get('name'), h.get('state')) for h in data}
added = 0
for h in missing:
    if (h['name'], h['state']) not in existing_keys:
        data.append(h)
        added += 1

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added {added} hospitals. Total: {len(data)}")
