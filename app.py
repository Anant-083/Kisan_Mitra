from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from groq import Groq
from langdetect import detect
from gtts import gTTS
import os, io, requests

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
WEATHER_KEY = os.environ.get("OPENWEATHER_KEY", "")

HOSPITALS = {
    "Bihar": {
        "Patna": [
            {"name": "Patna Medical College & Hospital", "address": "Ashok Rajpath, Patna", "phone": "0612-2300440", "type": "Government"},
            {"name": "IGIMS Patna", "address": "Sheikhpura, Patna", "phone": "0612-2297631", "type": "Government"},
        ],
        "Gaya": [{"name": "Anugrah Narayan Magadh Medical College", "address": "Gaya", "phone": "0631-2220323", "type": "Government"}],
        "Muzaffarpur": [{"name": "Sri Krishna Medical College Hospital", "address": "Muzaffarpur", "phone": "0621-2266102", "type": "Government"}],
        "Bhagalpur": [{"name": "Jawaharlal Nehru Medical College Hospital", "address": "Bhagalpur", "phone": "0641-2400370", "type": "Government"}],
    },
    "West Bengal": {
        "Kolkata": [
            {"name": "SSKM Hospital", "address": "244 AJC Bose Road, Kolkata", "phone": "033-22044440", "type": "Government"},
            {"name": "RG Kar Medical College", "address": "1 Khudiram Bose Sarani, Kolkata", "phone": "033-25551234", "type": "Government"},
        ],
        "Howrah": [{"name": "Howrah General Hospital", "address": "Howrah", "phone": "033-26415748", "type": "Government"}],
        "Siliguri": [{"name": "North Bengal Medical College", "address": "Siliguri", "phone": "0353-2581001", "type": "Government"}],
    },
    "Uttar Pradesh": {
        "Lucknow": [{"name": "King George's Medical University", "address": "Shah Mina Road, Lucknow", "phone": "0522-2257450", "type": "Government"}],
        "Varanasi": [{"name": "BHU Sir Sunderlal Hospital", "address": "BHU Campus, Varanasi", "phone": "0542-2309289", "type": "Government"}],
        "Kanpur": [{"name": "GSVM Medical College", "address": "Kanpur", "phone": "0512-2530803", "type": "Government"}],
        "Agra": [{"name": "S.N. Medical College", "address": "Agra", "phone": "0562-2520163", "type": "Government"}],
    },
    "Maharashtra": {
        "Mumbai": [
            {"name": "KEM Hospital", "address": "Parel, Mumbai", "phone": "022-24107000", "type": "Government"},
            {"name": "Nair Hospital", "address": "Mumbai Central", "phone": "022-23027600", "type": "Government"},
        ],
        "Pune": [{"name": "Sassoon General Hospital", "address": "Pune", "phone": "020-26128000", "type": "Government"}],
        "Nagpur": [{"name": "Government Medical College Nagpur", "address": "Nagpur", "phone": "0712-2700488", "type": "Government"}],
    },
    "Delhi": {
        "New Delhi": [
            {"name": "AIIMS New Delhi", "address": "Ansari Nagar, New Delhi", "phone": "011-26588500", "type": "Government"},
            {"name": "Safdarjung Hospital", "address": "Ansari Nagar West, New Delhi", "phone": "011-26165060", "type": "Government"},
        ],
    },
    "Tamil Nadu": {
        "Chennai": [{"name": "Rajiv Gandhi Govt General Hospital", "address": "Park Town, Chennai", "phone": "044-25305000", "type": "Government"}],
        "Madurai": [{"name": "Madurai Medical College Hospital", "address": "Madurai", "phone": "0452-2530855", "type": "Government"}],
        "Coimbatore": [{"name": "Coimbatore Medical College Hospital", "address": "Coimbatore", "phone": "0422-2301393", "type": "Government"}],
    },
    "Karnataka": {
        "Bengaluru": [{"name": "Victoria Hospital", "address": "Fort, Bengaluru", "phone": "080-26701150", "type": "Government"}],
        "Mysuru": [{"name": "K.R. Hospital", "address": "Mysuru", "phone": "0821-2520355", "type": "Government"}],
    },
    "Rajasthan": {
        "Jaipur": [{"name": "Sawai Man Singh Hospital", "address": "Jaipur", "phone": "0141-2518222", "type": "Government"}],
        "Jodhpur": [{"name": "Mahatma Gandhi Hospital", "address": "Jodhpur", "phone": "0291-2434861", "type": "Government"}],
    },
    "Madhya Pradesh": {
        "Bhopal": [{"name": "Hamidia Hospital", "address": "Bhopal", "phone": "0755-2540222", "type": "Government"}],
        "Indore": [{"name": "Maharaja Yeshwantrao Hospital", "address": "Indore", "phone": "0731-2527145", "type": "Government"}],
    },
    "Gujarat": {
        "Ahmedabad": [{"name": "Civil Hospital Ahmedabad", "address": "Asarwa, Ahmedabad", "phone": "079-22683721", "type": "Government"}],
        "Surat": [{"name": "New Civil Hospital Surat", "address": "Surat", "phone": "0261-2244343", "type": "Government"}],
    },
    "Punjab": {
        "Amritsar": [{"name": "Guru Nanak Dev Hospital", "address": "Amritsar", "phone": "0183-2225465", "type": "Government"}],
        "Ludhiana": [{"name": "Civil Hospital Ludhiana", "address": "Ludhiana", "phone": "0161-2444140", "type": "Government"}],
    },
    "Kerala": {
        "Thiruvananthapuram": [{"name": "Thiruvananthapuram Medical College", "address": "Thiruvananthapuram", "phone": "0471-2528300", "type": "Government"}],
        "Kochi": [{"name": "Ernakulam General Hospital", "address": "Kochi", "phone": "0484-2360002", "type": "Government"}],
    },
    "Odisha": {
        "Bhubaneswar": [{"name": "Capital Hospital", "address": "Bhubaneswar", "phone": "0674-2391983", "type": "Government"}],
    },
    "Assam": {
        "Guwahati": [{"name": "Guwahati Medical College Hospital", "address": "Guwahati", "phone": "0361-2528214", "type": "Government"}],
    },
}

def detect_lang(text):
    try:
        return detect(text)
    except Exception:
        return "en"

LANG_NAMES = {
    "en": "English", "hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu",
    "mr": "Marathi", "gu": "Gujarati", "kn": "Kannada", "ml": "Malayalam",
    "pa": "Punjabi", "or": "Odia", "as": "Assamese", "ur": "Urdu",
}

def system_prompt(lang):
    name = LANG_NAMES.get(lang, "English")
    return f"""You are AarogyaBot, a caring AI health assistant for rural India.
Respond ONLY in {name} language (script included), regardless of what language the user wrote in, unless they wrote in English and asked for English.
Give clear, practical health guidance. Mention home remedies where appropriate.
Always recommend seeing a doctor for serious symptoms. Be warm and empathetic.
Keep responses concise, well-structured with short bullet points where useful.
This is NOT a medical diagnosis."""

# ---------- PAGE ROUTES ----------

@app.route("/")
def index():
    return render_template("index.html", state_count=len(HOSPITALS))

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/hospitals")
def hospitals():
    return render_template("hospitals.html", states=list(HOSPITALS.keys()))

@app.route("/medicines")
def medicines():
    return render_template("medicines.html")

@app.route("/emergency")
def emergency():
    return render_template("emergency.html")

# ---------- PWA ROUTES ----------

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

# ---------- API ROUTES ----------

@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json(silent=True) or {}
    user_msg = data.get("message", "").strip()
    history = data.get("history", [])
    force_lang = data.get("lang")

    if not user_msg:
        return jsonify({"error": "empty message"}), 400

    lang = force_lang if force_lang else detect_lang(user_msg)

    sys = system_prompt(lang)
    messages = [{"role": "system", "content": sys}]
    for h in history[-8:]:
        messages.append(h)
    messages.append({"role": "user", "content": user_msg})

    try:
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500,
            temperature=0.7,
        )
        reply = resp.choices[0].message.content
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"reply": reply, "lang": lang})

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
    """Live hospital search via OpenStreetMap Overpass API, no key required."""
    data = request.get_json(silent=True) or {}
    lat = data.get("lat")
    lon = data.get("lon")
    if not lat or not lon:
        return jsonify({"error": "location required"}), 400

    overpass_query = f"""
    [out:json][timeout:15];
    (
      node["amenity"="hospital"](around:8000,{lat},{lon});
      way["amenity"="hospital"](around:8000,{lat},{lon});
      node["amenity"="clinic"](around:5000,{lat},{lon});
    );
    out center 25;
    """
    try:
        r = requests.post(
            "https://overpass-api.de/api/interpreter",
            data={"data": overpass_query},
            timeout=15
        )
        elements = r.json().get("elements", [])
        results = []
        for el in elements:
            tags = el.get("tags", {})
            name = tags.get("name")
            if not name:
                continue
            elat = el.get("lat") or el.get("center", {}).get("lat")
            elon = el.get("lon") or el.get("center", {}).get("lon")
            if not elat or not elon:
                continue
            results.append({
                "name": name,
                "lat": elat,
                "lon": elon,
                "address": tags.get("addr:full") or tags.get("addr:street", "Address not available"),
                "phone": tags.get("phone") or tags.get("contact:phone", ""),
                "emergency": tags.get("emergency") == "yes",
                "type": "Hospital" if "hospital" in str(tags.get("amenity")) else "Clinic",
            })

        def dist(h):
            return (h["lat"] - lat) ** 2 + (h["lon"] - lon) ** 2

        results.sort(key=dist)
        return jsonify({"hospitals": results[:15]})
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
    prompt = (
        f"Provide information about the medicine '{med}' for Indian patients, in {name} language. "
        f"Cover: 1) Uses 2) Dosage 3) Side effects 4) When not to take it 5) Affordable Indian brand alternatives. "
        f"Keep it concise and clearly structured."
    )
    try:
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": f"You are a clinical pharmacist. Always answer in {name} language."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=450,
        )
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
        temp = d["main"]["temp"]
        humidity = d["main"]["humidity"]
        warning = ""
        if temp > 38:
            warning = "Heat alert: stay hydrated, avoid sun 11am-4pm"
        elif humidity > 85:
            warning = "High humidity: risk of fungal/respiratory issues"
        elif temp < 10:
            warning = "Cold alert: cover up, risk of respiratory infection"
        return jsonify({
            "city": d["name"], "temp": round(temp), "humidity": humidity,
            "desc": d["weather"][0]["description"].title(), "warning": warning
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/tts", methods=["POST"])
def api_tts():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    lang = data.get("lang", "en")
    gtts_lang = lang if lang in ["hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "ur", "en"] else "en"
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
