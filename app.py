
from flask import Flask, render_template, request, jsonify, send_file
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
    },
    "West Bengal": {
        "Kolkata": [
            {"name": "SSKM Hospital", "address": "244 AJC Bose Road, Kolkata", "phone": "033-22044440", "type": "Government"},
            {"name": "RG Kar Medical College", "address": "1 Khudiram Bose Sarani, Kolkata", "phone": "033-25551234", "type": "Government"},
        ],
    },
    "Uttar Pradesh": {
        "Lucknow": [{"name": "King George's Medical University", "address": "Shah Mina Road, Lucknow", "phone": "0522-2257450", "type": "Government"}],
        "Varanasi": [{"name": "BHU Sir Sunderlal Hospital", "address": "BHU Campus, Varanasi", "phone": "0542-2309289", "type": "Government"}],
    },
    "Maharashtra": {
        "Mumbai": [
            {"name": "KEM Hospital", "address": "Parel, Mumbai", "phone": "022-24107000", "type": "Government"},
            {"name": "Nair Hospital", "address": "Mumbai Central", "phone": "022-23027600", "type": "Government"},
        ],
    },
    "Delhi": {
        "New Delhi": [
            {"name": "AIIMS New Delhi", "address": "Ansari Nagar, New Delhi", "phone": "011-26588500", "type": "Government"},
            {"name": "Safdarjung Hospital", "address": "Ansari Nagar West, New Delhi", "phone": "011-26165060", "type": "Government"},
        ],
    },
    "Tamil Nadu": {
        "Chennai": [{"name": "Rajiv Gandhi Govt General Hospital", "address": "Park Town, Chennai", "phone": "044-25305000", "type": "Government"}],
    },
    "Karnataka": {
        "Bengaluru": [{"name": "Victoria Hospital", "address": "Fort, Bengaluru", "phone": "080-26701150", "type": "Government"}],
    },
}

def detect_lang(text):
    try: return detect(text)
    except: return "en"

LANG_NAMES = {
    "en":"English","hi":"Hindi","bn":"Bengali","ta":"Tamil","te":"Telugu",
    "mr":"Marathi","gu":"Gujarati","kn":"Kannada","ml":"Malayalam",
    "pa":"Punjabi","or":"Odia","as":"Assamese","ur":"Urdu",
}

def system_prompt(lang):
    name = LANG_NAMES.get(lang, "English")
    return f"""You are AarogyaBot, a caring AI health assistant for rural India.
Respond ONLY in {name} language (script included), regardless of what language the user wrote in, unless they wrote in English and asked for English.
Give clear, practical health guidance. Mention home remedies where appropriate.
Always recommend seeing a doctor for serious symptoms. Be warm and empathetic.
Keep responses concise, well-structured with short bullet points where useful.
This is NOT a medical diagnosis."""

@app.route("/")
def index(): return render_template("index.html")

@app.route("/chat")
def chat(): return render_template("chat.html")

@app.route("/hospitals")
def hospitals(): return render_template("hospitals.html", states=list(HOSPITALS.keys()))

@app.route("/medicines")
def medicines(): return render_template("medicines.html")

@app.route("/emergency")
def emergency(): return render_template("emergency.html")

@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.json
    user_msg = data.get("message", "")
    history = data.get("history", [])
    force_lang = data.get("lang", "en")

    sys = system_prompt(force_lang)
    messages = [{"role": "system", "content": sys}]
    for h in history[-8:]:
        messages.append(h)
    messages.append({"role": "user", "content": user_msg})

    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=500,
        temperature=0.7,
    )
    reply = resp.choices[0].message.content
    return jsonify({"reply": reply, "lang": force_lang})

@app.route("/api/districts", methods=["POST"])
def api_districts():
    state = request.json.get("state", "")
    return jsonify({"districts": list(HOSPITALS.get(state, {}).keys())})

@app.route("/api/hospitals", methods=["POST"])
def api_hospitals():
    data = request.json
    state = data.get("state", "")
    district = data.get("district", "")
    return jsonify({"hospitals": HOSPITALS.get(state, {}).get(district, [])})

@app.route("/api/medicine", methods=["POST"])
def api_medicine():
    med = request.json.get("medicine", "")
    lang = request.json.get("lang", "en")
    name = LANG_NAMES.get(lang, "English")
    prompt = (
        f"Provide information about the medicine '{med}' for Indian patients, in {name} language. "
        f"Cover: 1) Uses 2) Dosage 3) Side effects 4) When not to take it 5) Affordable Indian brand alternatives. "
        f"Keep it concise and clearly structured."
    )
    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": f"You are a clinical pharmacist. Always answer in {name} language."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=450,
    )
    return jsonify({"info": resp.choices[0].message.content})

@app.route("/api/weather", methods=["POST"])
def api_weather():
    if not WEATHER_KEY:
        return jsonify({"error": "not configured"}), 503
    data = request.json
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
    data = request.json
    text = data.get("text", "")
    lang = data.get("lang", "en")
    gtts_lang = lang if lang in ["hi","bn","ta","te","mr","gu","kn","ml","pa","ur","en"] else "en"
    tts = gTTS(text=text[:500], lang=gtts_lang)
    buf = io.BytesIO()
    tts.write_to_fp(buf)
    buf.seek(0)
    return send_file(buf, mimetype="audio/mpeg")

if __name__ == "__main__":
    app.run(debug=True)
