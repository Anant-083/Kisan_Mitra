from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from groq import Groq
from langdetect import detect
from gtts import gTTS
import os, io, json, math, time

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
WEATHER_KEY = os.environ.get("OPENWEATHER_KEY", "")

# ── Load hospital data at startup ──
def load_hospitals():
    try:
        with open(os.path.join(os.path.dirname(__file__), 'hospitals.json'), 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: could not load hospitals.json: {e}")
        return []

HOSPITALS_DATA = load_hospitals()

# Build state→district→list index for fast lookup
HOSPITALS_INDEX = {}
for h in HOSPITALS_DATA:
    state = h.get('state', '')
    district = h.get('district', '')
    if state not in HOSPITALS_INDEX:
        HOSPITALS_INDEX[state] = {}
    if district not in HOSPITALS_INDEX[state]:
        HOSPITALS_INDEX[state][district] = []
    HOSPITALS_INDEX[state][district].append(h)

print(f"Loaded {len(HOSPITALS_DATA)} government hospitals across {len(HOSPITALS_INDEX)} states")

@app.context_processor
def inject_version():
    return {'ver': int(time.time())}

@app.after_request
def add_headers(response):
    if request.path == '/sw.js':
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    elif request.path.endswith('.html') or request.path in ['/', '/chat', '/hospitals', '/medicines', '/emergency', '/prescription']:
        response.headers['Cache-Control'] = 'no-cache, must-revalidate'
    return response

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

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

@app.route("/")
def index():
    return render_template("index.html", state_count=len(HOSPITALS_INDEX))

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/hospitals")
def hospitals():
    return render_template("hospitals.html", states=sorted(HOSPITALS_INDEX.keys()))

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
    prompt = f"""You are an expert medical assistant helping rural Indian patients understand their doctor's prescriptions.
The image may contain a handwritten or printed Indian prescription (doctor's note / hospital slip).

STEP 1 — READ CAREFULLY:
- Look for medicine names (Tab., Cap., Syp., Inj., Oint., Drops)
- Dosage shortcuts used in India: OD=once daily, BD=twice daily, TDS=three times daily, QID=four times daily, SOS=when needed, AC=before food, PC=after food, HS=at bedtime, A.D.=as directed
- Strength (mg, ml, mcg), duration (days, weeks), and quantity
- If handwriting is unclear, make your best attempt and note uncertainty

STEP 2 — EXPLAIN IN {lang_name.upper()}:
Respond ENTIRELY in {lang_name} language (use correct script).

Structure your response as:

**1. Medicines Prescribed**
For each medicine: name → what it treats (simple explanation) → strength if visible

**2. How to Take**
Convert medical shorthand to plain words:
- OD = once a day, BD = twice a day, TDS = three times a day
- AC = before food, PC = after food, HS = at bedtime

**3. Duration**
How many days each medicine should be taken

**4. Warnings**
Important things to avoid or watch out for

**5. Ask Your Doctor**
Any unclear items or follow-up instructions

Use very simple language a village patient can understand. Be warm and reassuring.
If something is completely unreadable, say so honestly.
End with: Always follow your doctor's exact instructions. Show this to your pharmacist if unsure.
"""
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
            max_tokens=1000,
        )
        return jsonify({"summary": resp.choices[0].message.content, "lang": lang})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/districts", methods=["POST"])
def api_districts():
    data = request.get_json(silent=True) or {}
    state = data.get("state", "")
    districts = sorted(HOSPITALS_INDEX.get(state, {}).keys())
    return jsonify({"districts": districts})

@app.route("/api/hospitals", methods=["POST"])
def api_hospitals():
    data = request.get_json(silent=True) or {}
    state = data.get("state", "")
    district = data.get("district", "")
    results = HOSPITALS_INDEX.get(state, {}).get(district, [])
    return jsonify({"hospitals": results})

@app.route("/api/hospitals/nearby", methods=["POST"])
def api_hospitals_nearby():
    data = request.get_json(silent=True) or {}
    lat = data.get("lat")
    lon = data.get("lon")
    radius_km = data.get("radius", 20)
    if not lat or not lon:
        return jsonify({"error": "location required"}), 400
    results = []
    for h in HOSPITALS_DATA:
        hlat = h.get("lat")
        hlon = h.get("lon")
        if not hlat or not hlon:
            continue
        dist = haversine_km(lat, lon, hlat, hlon)
        if dist <= radius_km:
            results.append({**h, "distance_km": round(dist, 1)})
    results.sort(key=lambda x: x["distance_km"])
    return jsonify({"hospitals": results[:25], "source": "directory"})

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
                {"role": "system", "content": f"You are a clinical pharmacist. Always answer in {name} language only. Use the correct script for {name}."},
                {"role": "user", "content": prompt}
            ], max_tokens=500)
        return jsonify({"info": resp.choices[0].message.content})
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

@app.route("/api/weather", methods=["POST"])
def api_weather():
    if not WEATHER_KEY:
        return jsonify({"error": "not configured"}), 503
    data = request.get_json(silent=True) or {}
    lat, lon = data.get("lat"), data.get("lon")
    try:
        import requests
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

if __name__ == "__main__":
    app.run(debug=True)
