from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from groq import Groq
from langdetect import detect
from gtts import gTTS
import os, io, requests, base64

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
WEATHER_KEY = os.environ.get("OPENWEATHER_KEY", "")

HOSPITALS = {
    "Andhra Pradesh": {
        "Visakhapatnam": [{"name": "King George Hospital", "address": "Visakhapatnam", "phone": "0891-2565051", "type": "Government"}],
        "Vijayawada": [{"name": "Government General Hospital Vijayawada", "address": "Vijayawada", "phone": "0866-2571234", "type": "Government"}],
    },
    "Arunachal Pradesh": {"Itanagar": [{"name": "Tomo Riba Institute of Health & Medical Sciences", "address": "Naharlagun, Itanagar", "phone": "0360-2244140", "type": "Government"}]},
    "Assam": {
        "Guwahati": [{"name": "Guwahati Medical College Hospital", "address": "Guwahati", "phone": "0361-2528214", "type": "Government"}],
        "Dibrugarh": [{"name": "Assam Medical College Hospital", "address": "Dibrugarh", "phone": "0373-2300008", "type": "Government"}],
    },
    "Bihar": {
        "Patna": [
            {"name": "Patna Medical College & Hospital", "address": "Ashok Rajpath, Patna", "phone": "0612-2300440", "type": "Government"},
            {"name": "IGIMS Patna", "address": "Sheikhpura, Patna", "phone": "0612-2297631", "type": "Government"},
        ],
        "Gaya": [{"name": "Anugrah Narayan Magadh Medical College", "address": "Gaya", "phone": "0631-2220323", "type": "Government"}],
        "Muzaffarpur": [{"name": "Sri Krishna Medical College Hospital", "address": "Muzaffarpur", "phone": "0621-2266102", "type": "Government"}],
        "Bhagalpur": [{"name": "Jawaharlal Nehru Medical College Hospital", "address": "Bhagalpur", "phone": "0641-2400370", "type": "Government"}],
    },
    "Chhattisgarh": {
        "Raipur": [{"name": "Dr. Bhimrao Ambedkar Memorial Hospital", "address": "Raipur", "phone": "0771-2236415", "type": "Government"}],
        "Bilaspur": [{"name": "CIMS Hospital Bilaspur", "address": "Bilaspur", "phone": "07752-227526", "type": "Government"}],
    },
    "Delhi": {
        "New Delhi": [
            {"name": "AIIMS New Delhi", "address": "Ansari Nagar, New Delhi", "phone": "011-26588500", "type": "Government"},
            {"name": "Safdarjung Hospital", "address": "Ansari Nagar West, New Delhi", "phone": "011-26165060", "type": "Government"},
            {"name": "Ram Manohar Lohia Hospital", "address": "Baba Kharak Singh Marg, New Delhi", "phone": "011-23404370", "type": "Government"},
        ],
    },
    "Goa": {"Panaji": [{"name": "Goa Medical College Hospital", "address": "Bambolim, Panaji", "phone": "0832-2458700", "type": "Government"}]},
    "Gujarat": {
        "Ahmedabad": [{"name": "Civil Hospital Ahmedabad", "address": "Asarwa, Ahmedabad", "phone": "079-22683721", "type": "Government"}],
        "Surat": [{"name": "New Civil Hospital Surat", "address": "Surat", "phone": "0261-2244343", "type": "Government"}],
        "Vadodara": [{"name": "SSG Hospital Vadodara", "address": "Vadodara", "phone": "0265-2226161", "type": "Government"}],
    },
    "Haryana": {
        "Rohtak": [{"name": "Pt. B.D. Sharma PGIMS", "address": "Rohtak", "phone": "01262-211309", "type": "Government"}],
        "Faridabad": [{"name": "B.K. Hospital Faridabad", "address": "Faridabad", "phone": "0129-2414970", "type": "Government"}],
    },
    "Himachal Pradesh": {
        "Shimla": [{"name": "Indira Gandhi Medical College Hospital", "address": "Shimla", "phone": "0177-2880085", "type": "Government"}],
        "Dharamshala": [{"name": "Zonal Hospital Dharamshala", "address": "Dharamshala", "phone": "01892-222012", "type": "Government"}],
    },
    "Jharkhand": {
        "Ranchi": [{"name": "Rajendra Institute of Medical Sciences", "address": "Ranchi", "phone": "0651-2540700", "type": "Government"}],
        "Jamshedpur": [{"name": "MGM Medical College Hospital", "address": "Jamshedpur", "phone": "0657-2430226", "type": "Government"}],
    },
    "Karnataka": {
        "Bengaluru": [
            {"name": "Victoria Hospital", "address": "Fort, Bengaluru", "phone": "080-26701150", "type": "Government"},
            {"name": "Bowring & Lady Curzon Hospital", "address": "Shivaji Nagar, Bengaluru", "phone": "080-25561822", "type": "Government"},
        ],
        "Mysuru": [{"name": "K.R. Hospital", "address": "Mysuru", "phone": "0821-2520355", "type": "Government"}],
        "Hubballi": [{"name": "KIMS Hospital Hubballi", "address": "Hubballi", "phone": "0836-2370130", "type": "Government"}],
    },
    "Kerala": {
        "Thiruvananthapuram": [{"name": "Thiruvananthapuram Medical College", "address": "Thiruvananthapuram", "phone": "0471-2528300", "type": "Government"}],
        "Kochi": [{"name": "Ernakulam General Hospital", "address": "Kochi", "phone": "0484-2360002", "type": "Government"}],
        "Kozhikode": [{"name": "Government Medical College Kozhikode", "address": "Kozhikode", "phone": "0495-2350216", "type": "Government"}],
    },
    "Madhya Pradesh": {
        "Bhopal": [{"name": "Hamidia Hospital", "address": "Bhopal", "phone": "0755-2540222", "type": "Government"}],
        "Indore": [{"name": "Maharaja Yeshwantrao Hospital", "address": "Indore", "phone": "0731-2527145", "type": "Government"}],
        "Jabalpur": [{"name": "Netaji Subhash Chandra Bose Medical College", "address": "Jabalpur", "phone": "0761-2620270", "type": "Government"}],
    },
    "Maharashtra": {
        "Mumbai": [
            {"name": "KEM Hospital", "address": "Parel, Mumbai", "phone": "022-24107000", "type": "Government"},
            {"name": "Nair Hospital", "address": "Mumbai Central", "phone": "022-23027600", "type": "Government"},
        ],
        "Pune": [{"name": "Sassoon General Hospital", "address": "Pune", "phone": "020-26128000", "type": "Government"}],
        "Nagpur": [{"name": "Government Medical College Nagpur", "address": "Nagpur", "phone": "0712-2700488", "type": "Government"}],
        "Aurangabad": [{"name": "Government Medical College Aurangabad", "address": "Aurangabad", "phone": "0240-2402412", "type": "Government"}],
    },
    "Manipur": {"Imphal": [{"name": "Regional Institute of Medical Sciences", "address": "Imphal", "phone": "0385-2414939", "type": "Government"}]},
    "Meghalaya": {"Shillong": [{"name": "North Eastern Indira Gandhi Regional Institute", "address": "Shillong", "phone": "0364-2538014", "type": "Government"}]},
    "Mizoram": {"Aizawl": [{"name": "Zoram Medical College Hospital", "address": "Aizawl", "phone": "0389-2391054", "type": "Government"}]},
    "Nagaland": {"Kohima": [{"name": "Naga Hospital Authority Kohima", "address": "Kohima", "phone": "0370-2270366", "type": "Government"}]},
    "Odisha": {
        "Bhubaneswar": [{"name": "Capital Hospital", "address": "Bhubaneswar", "phone": "0674-2391983", "type": "Government"}],
        "Cuttack": [{"name": "SCB Medical College Hospital", "address": "Cuttack", "phone": "0671-2414004", "type": "Government"}],
    },
    "Punjab": {
        "Amritsar": [{"name": "Guru Nanak Dev Hospital", "address": "Amritsar", "phone": "0183-2225465", "type": "Government"}],
        "Ludhiana": [{"name": "Civil Hospital Ludhiana", "address": "Ludhiana", "phone": "0161-2444140", "type": "Government"}],
        "Patiala": [{"name": "Rajindra Hospital Patiala", "address": "Patiala", "phone": "0175-2214101", "type": "Government"}],
    },
    "Rajasthan": {
        "Jaipur": [{"name": "Sawai Man Singh Hospital", "address": "Jaipur", "phone": "0141-2518222", "type": "Government"}],
        "Jodhpur": [{"name": "Mahatma Gandhi Hospital", "address": "Jodhpur", "phone": "0291-2434861", "type": "Government"}],
        "Udaipur": [{"name": "RNT Medical College Hospital", "address": "Udaipur", "phone": "0294-2528811", "type": "Government"}],
    },
    "Sikkim": {"Gangtok": [{"name": "STNM Hospital", "address": "Gangtok", "phone": "03592-202944", "type": "Government"}]},
    "Tamil Nadu": {
        "Chennai": [{"name": "Rajiv Gandhi Govt General Hospital", "address": "Park Town, Chennai", "phone": "044-25305000", "type": "Government"}],
        "Madurai": [{"name": "Madurai Medical College Hospital", "address": "Madurai", "phone": "0452-2530855", "type": "Government"}],
        "Coimbatore": [{"name": "Coimbatore Medical College Hospital", "address": "Coimbatore", "phone": "0422-2301393", "type": "Government"}],
        "Salem": [{"name": "Salem Government Medical College", "address": "Salem", "phone": "0427-2261401", "type": "Government"}],
    },
    "Telangana": {
        "Hyderabad": [
            {"name": "Osmania General Hospital", "address": "Hyderabad", "phone": "040-24600523", "type": "Government"},
            {"name": "Gandhi Hospital", "address": "Secunderabad", "phone": "040-27505566", "type": "Government"},
        ],
    },
    "Tripura": {"Agartala": [{"name": "Agartala Government Medical College", "address": "Agartala", "phone": "0381-2412020", "type": "Government"}]},
    "Uttar Pradesh": {
        "Lucknow": [{"name": "King George's Medical University", "address": "Shah Mina Road, Lucknow", "phone": "0522-2257450", "type": "Government"}],
        "Varanasi": [{"name": "BHU Sir Sunderlal Hospital", "address": "BHU Campus, Varanasi", "phone": "0542-2309289", "type": "Government"}],
        "Kanpur": [{"name": "GSVM Medical College", "address": "Kanpur", "phone": "0512-2530803", "type": "Government"}],
        "Agra": [{"name": "S.N. Medical College", "address": "Agra", "phone": "0562-2520163", "type": "Government"}],
        "Allahabad": [{"name": "Swaroop Rani Nehru Hospital", "address": "Prayagraj", "phone": "0532-2256386", "type": "Government"}],
    },
    "Uttarakhand": {
        "Dehradun": [{"name": "Doon Medical College Hospital", "address": "Dehradun", "phone": "0135-2726067", "type": "Government"}],
        "Haldwani": [{"name": "Government Medical College Haldwani", "address": "Haldwani", "phone": "05946-220012", "type": "Government"}],
    },
    "West Bengal": {
        "Kolkata": [
            {"name": "SSKM Hospital", "address": "244 AJC Bose Road, Kolkata", "phone": "033-22044440", "type": "Government"},
            {"name": "RG Kar Medical College", "address": "1 Khudiram Bose Sarani, Kolkata", "phone": "033-25551234", "type": "Government"},
        ],
        "Howrah": [{"name": "Howrah General Hospital", "address": "Howrah", "phone": "033-26415748", "type": "Government"}],
        "Siliguri": [{"name": "North Bengal Medical College", "address": "Siliguri", "phone": "0353-2581001", "type": "Government"}],
    },
}

def detect_lang(text):
    try: return detect(text)
    except: return "en"

LANG_NAMES = {
    "en":"English","hi":"Hindi","bn":"Bengali","ta":"Tamil","te":"Telugu",
    "mr":"Marathi","gu":"Gujarati","kn":"Kannada","ml":"Malayalam",
    "pa":"Punjabi","or":"Odia","as":"Assamese","ur":"Urdu",
    "sa":"Sanskrit","ks":"Kashmiri","sd":"Sindhi","ne":"Nepali",
    "kok":"Konkani","doi":"Dogri","mni":"Manipuri","sat":"Santali",
    "mai":"Maithili","bho":"Bhojpuri",
}

def system_prompt(lang):
    name = LANG_NAMES.get(lang, "English")
    return f"""You are AarogyaBot, a caring AI health assistant for rural India.
Respond ONLY in {name} language (script included).
Give clear, practical health guidance. Mention home remedies where appropriate.
Always recommend seeing a doctor for serious symptoms. Be warm and empathetic.
Keep responses concise, well-structured with short bullet points where useful.
This is NOT a medical diagnosis."""

@app.route("/")
def index():
    return render_template("index.html", state_count=len(HOSPITALS))

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/hospitals")
def hospitals():
    return render_template("hospitals.html", states=sorted(HOSPITALS.keys()))

@app.route("/medicines")
def medicines():
    return render_template("medicines.html")

@app.route("/emergency")
def emergency():
    return render_template("emergency.html")

@app.route("/prescription")
def prescription():
    return render_template("prescription.html")

@app.route("/manifest.json")
def manifest():
    return send_from_directory("static", "manifest.json", mimetype="application/manifest+json")

@app.route("/sw.js")
def service_worker():
    response = send_from_directory("static", "sw.js", mimetype="application/javascript")
    response.headers["Service-Worker-Allowed"] = "/"
    return response

@app.route("/offline.html")
def offline():
    return render_template("offline.html")

@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json(silent=True) or {}
    user_msg = data.get("message", "").strip()
    history = data.get("history", [])
    force_lang = data.get("lang")
    if not user_msg:
        return jsonify({"error": "empty message"}), 400
    lang = force_lang if force_lang else detect_lang(user_msg)
    messages = [{"role": "system", "content": system_prompt(lang)}]
    for h in history[-8:]:
        messages.append(h)
    messages.append({"role": "user", "content": user_msg})
    try:
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile", messages=messages, max_tokens=500, temperature=0.7)
        return jsonify({"reply": resp.choices[0].message.content, "lang": lang})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/prescription", methods=["POST"])
def api_prescription():
    data = request.get_json(silent=True) or {}
    image_b64 = data.get("image")
    lang = data.get("lang", "en")
    if not image_b64:
        return jsonify({"error": "no image provided"}), 400
    lang_name = LANG_NAMES.get(lang, "English")
    prompt = f"""You are a medical assistant helping rural Indian patients understand their prescriptions.
Look at this prescription image and explain it in simple {lang_name} language that a person with no medical background can understand.

Please provide:
1. List of medicines prescribed (name + simple explanation of what it treats)
2. Dosage instructions in simple words (e.g. "1 tablet after breakfast")
3. Important warnings or things to avoid
4. How many days to take each medicine
5. Any follow-up instructions mentioned

Use very simple, clear language. Avoid medical jargon. Be warm and helpful.
If you cannot read parts of the prescription clearly, mention that.
End with a reminder to follow the doctor's instructions and ask questions if unsure."""

    try:
        resp = client.chat.completions.create(
           model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}},
                    {"type": "text", "text": prompt}
                ]
            }],
            max_tokens=800,
        )
        return jsonify({"summary": resp.choices[0].message.content, "lang": lang})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/districts", methods=["POST"])
def api_districts():
    data = request.get_json(silent=True) or {}
    state = data.get("state", "")
    return jsonify({"districts": list(HOSPITALS.get(state, {}).keys())})

@app.route("/api/hospitals", methods=["POST"])
def api_hospitals():
    data = request.get_json(silent=True) or {}
    state = data.get("state", "")
    district = data.get("district", "")
    return jsonify({"hospitals": HOSPITALS.get(state, {}).get(district, [])})

@app.route("/api/hospitals/nearby", methods=["POST"])
def api_hospitals_nearby():
    data = request.get_json(silent=True) or {}
    lat = data.get("lat")
    lon = data.get("lon")
    hosp_type = data.get("type", "all")
    if not lat or not lon:
        return jsonify({"error": "location required"}), 400

    # Comprehensive query including Indian PHC/CHC/dispensary tags
    overpass_query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:20000,{lat},{lon});
      way["amenity"="hospital"](around:20000,{lat},{lon});
      node["amenity"="clinic"](around:15000,{lat},{lon});
      way["amenity"="clinic"](around:15000,{lat},{lon});
      node["amenity"="doctors"](around:10000,{lat},{lon});
      node["healthcare"="hospital"](around:20000,{lat},{lon});
      way["healthcare"="hospital"](around:20000,{lat},{lon});
      node["healthcare"="clinic"](around:15000,{lat},{lon});
      node["healthcare"="centre"](around:15000,{lat},{lon});
      node["health_facility:type"="PHC"](around:20000,{lat},{lon});
      node["health_facility:type"="CHC"](around:20000,{lat},{lon});
      node["health_facility:type"="DH"](around:20000,{lat},{lon});
      node["health_facility:type"="Sub Centre"](around:15000,{lat},{lon});
      node["dispensary"="yes"](around:10000,{lat},{lon});
    );
    out center 30;
    """
    try:
        r = requests.post(
            "https://overpass-api.de/api/interpreter",
            data={"data": overpass_query}, timeout=25)
        elements = r.json().get("elements", [])
        results = []
        for el in elements:
            tags = el.get("tags", {})
            name = (tags.get("name") or tags.get("name:en") or
                    tags.get("name:hi") or tags.get("name:te") or
                    tags.get("name:ta") or tags.get("name:bn"))
            if not name:
                continue
            elat = el.get("lat") or el.get("center", {}).get("lat")
            elon = el.get("lon") or el.get("center", {}).get("lon")
            if not elat or not elon:
                continue

            # Determine type
            op = tags.get("operator:type", "")
            ftype = tags.get("health_facility:type", "")
            name_lower = name.lower()
            is_govt = (
                op in ("public", "government") or
                ftype in ("PHC", "CHC", "DH", "Sub Centre") or
                any(w in name_lower for w in [
                    "government","govt","civil","district","community",
                    "primary health","general hospital","medical college",
                    "public","railway","esic","army","military","central",
                    "phc","chc","dispensary","sub centre","sub-centre"
                ])
            )
            ptype = "Government" if is_govt else "Private"
            if hosp_type == "government" and ptype != "Government":
                continue
            if hosp_type == "private" and ptype != "Private":
                continue

            results.append({
                "name": name,
                "lat": elat, "lon": elon,
                "address": (tags.get("addr:full") or
                            tags.get("addr:street") or
                            tags.get("addr:city") or ""),
                "phone": (tags.get("phone") or
                          tags.get("contact:phone") or
                          tags.get("contact:mobile") or ""),
                "emergency": tags.get("emergency") == "yes",
                "type": ptype,
                "facility_type": ftype or tags.get("amenity") or tags.get("healthcare") or "",
            })

        def dist(h):
            return (h["lat"] - lat)**2 + (h["lon"] - lon)**2
        results.sort(key=dist)
        return jsonify({"hospitals": results[:20], "source": "osm"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/medicine", methods=["POST"])
def api_medicine():
    data = request.get_json(silent=True) or {}
    med = data.get("medicine", "").strip()
    lang = data.get("lang", "en")
    if not med:
        return jsonify({"error": "no medicine provided"}), 400
    name = LANG_NAMES.get(lang, "English")
    prompt = (f"Provide information about the medicine '{med}' for Indian patients, in {name} language. "
              f"Cover: 1) Uses 2) Dosage 3) Side effects 4) When not to take it 5) Affordable Indian brand alternatives. "
              f"Keep it concise and clearly structured.")
    try:
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": f"You are a clinical pharmacist. Always answer in {name} language."},
                {"role": "user", "content": prompt}
            ], max_tokens=450)
        return jsonify({"info": resp.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/weather", methods=["POST"])
def api_weather():
    if not WEATHER_KEY:
        return jsonify({"error": "not configured"}), 503
    data = request.get_json(silent=True) or {}
    lat, lon = data.get("lat"), data.get("lon")
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_KEY}&units=metric"
        d = requests.get(url, timeout=5).json()
        temp = d["main"]["temp"]; humidity = d["main"]["humidity"]
        warning = ""
        if temp > 38: warning = "Heat alert: stay hydrated, avoid sun 11am-4pm"
        elif humidity > 85: warning = "High humidity: risk of fungal/respiratory issues"
        elif temp < 10: warning = "Cold alert: cover up, risk of respiratory infection"
        return jsonify({"city": d["name"], "temp": round(temp), "humidity": humidity,
                        "desc": d["weather"][0]["description"].title(), "warning": warning})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/tts", methods=["POST"])
def api_tts():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    lang = data.get("lang", "en")
    gtts_supported = ["hi","bn","ta","te","mr","gu","kn","ml","pa","ur","en","ne","sa"]
    gtts_lang = lang if lang in gtts_supported else "en"
    try:
        tts = gTTS(text=text[:500], lang=gtts_lang)
        buf = io.BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)
        return send_file(buf, mimetype="audio/mpeg")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
