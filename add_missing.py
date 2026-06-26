import json

with open('hospitals.json', 'r', encoding='utf-8') as f:
    hospitals = json.load(f)

# Delhi government hospitals
delhi_hospitals = [
    {"name": "AIIMS New Delhi", "state": "Delhi", "district": "New Delhi", "address": "Ansari Nagar, New Delhi", "phone": "011-26588500", "type": "Government", "care_type": "Medical College / Institute", "lat": 28.5672, "lon": 77.2100},
    {"name": "Safdarjung Hospital", "state": "Delhi", "district": "New Delhi", "address": "Ansari Nagar West, New Delhi", "phone": "011-26165060", "type": "Government", "care_type": "Hospital", "lat": 28.5679, "lon": 77.2090},
    {"name": "Ram Manohar Lohia Hospital", "state": "Delhi", "district": "New Delhi", "address": "Baba Kharak Singh Marg, New Delhi", "phone": "011-23404370", "type": "Government", "care_type": "Hospital", "lat": 28.6274, "lon": 77.2091},
    {"name": "Lok Nayak Hospital", "state": "Delhi", "district": "Central Delhi", "address": "Jawaharlal Nehru Marg, New Delhi", "phone": "011-23232400", "type": "Government", "care_type": "Hospital", "lat": 28.6378, "lon": 77.2358},
    {"name": "GTB Hospital", "state": "Delhi", "district": "East Delhi", "address": "Dilshad Garden, Delhi", "phone": "011-22582141", "type": "Government", "care_type": "Hospital", "lat": 28.6814, "lon": 77.3150},
    {"name": "Deen Dayal Upadhyay Hospital", "state": "Delhi", "district": "West Delhi", "address": "Hari Nagar, New Delhi", "phone": "011-25467007", "type": "Government", "care_type": "Hospital", "lat": 28.6289, "lon": 77.1025},
    {"name": "Sanjay Gandhi Memorial Hospital", "state": "Delhi", "district": "North West Delhi", "address": "Mangolpuri, Delhi", "phone": "011-27910072", "type": "Government", "care_type": "Hospital", "lat": 28.6972, "lon": 77.0731},
    {"name": "Rajiv Gandhi Super Speciality Hospital", "state": "Delhi", "district": "East Delhi", "address": "Tahirpur, Delhi", "phone": "011-22877200", "type": "Government", "care_type": "Hospital", "lat": 28.6950, "lon": 77.3200},
    {"name": "Baba Saheb Ambedkar Hospital", "state": "Delhi", "district": "North West Delhi", "address": "Rohini, Delhi", "phone": "011-27051000", "type": "Government", "care_type": "Hospital", "lat": 28.7195, "lon": 77.1180},
    {"name": "Lady Hardinge Medical College Hospital", "state": "Delhi", "district": "Central Delhi", "address": "Connaught Place, New Delhi", "phone": "011-23408000", "type": "Government", "care_type": "Medical College / Institute", "lat": 28.6358, "lon": 77.2048},
]

# Ladakh government hospitals
ladakh_hospitals = [
    {"name": "SNM Hospital Leh", "state": "Ladakh", "district": "Leh", "address": "Leh, Ladakh", "phone": "01982-252014", "type": "Government", "care_type": "Hospital", "lat": 34.1642, "lon": 77.5848},
    {"name": "District Hospital Kargil", "state": "Ladakh", "district": "Kargil", "address": "Kargil, Ladakh", "phone": "01985-232014", "type": "Government", "care_type": "Hospital", "lat": 34.5539, "lon": 76.1349},
    {"name": "Community Health Centre Nubra", "state": "Ladakh", "district": "Leh", "address": "Nubra Valley, Leh", "phone": "", "type": "Government", "care_type": "Community Health Centre", "lat": 34.5887, "lon": 77.5516},
    {"name": "Primary Health Centre Zanskar", "state": "Ladakh", "district": "Kargil", "address": "Padum, Zanskar", "phone": "", "type": "Government", "care_type": "Primary Health Centre", "lat": 33.4667, "lon": 76.9333},
]

hospitals.extend(delhi_hospitals)
hospitals.extend(ladakh_hospitals)

with open('hospitals.json', 'w', encoding='utf-8') as f:
    json.dump(hospitals, f, ensure_ascii=False, indent=2)

print(f"Done. Total hospitals: {len(hospitals)}")
print(f"Added {len(delhi_hospitals)} Delhi + {len(ladakh_hospitals)} Ladakh hospitals")
