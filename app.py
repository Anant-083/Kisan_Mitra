from flask import Flask, render_template, request, jsonify, send_file
from groq import Groq
from langdetect import detect
from gtts import gTTS
import os, io, requests

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
WEATHER_KEY = os.environ.get("OPENWEATHER_KEY", "")  # Add this to Render env vars

# ── HOSPITAL DATA ─────────────────────────────────────────────
HOSPITALS = {
    "Bihar": {
        "Patna": [
            {"name": "Patna Medical College & Hospital (PMCH)", "address": "Ashok Rajpath, Patna - 800004", "phone": "0612-2300440", "type": "Government", "beds": "1750", "emergency": True},
            {"name": "Nalanda Medical College & Hospital (NMCH)", "address": "Agamkuan, Patna - 800007", "phone": "0612-2631467", "type": "Government", "beds": "1000", "emergency": True},
            {"name": "IGIMS Patna", "address": "Sheikhpura, Patna - 800014", "phone": "0612-2297631", "type": "Government", "beds": "720", "emergency": True},
            {"name": "ESIC Model Hospital", "address": "Beltron Bhawan, Patna", "phone": "0612-2521629", "type": "Government", "beds": "300", "emergency": False},
        ],
        "Gaya": [
            {"name": "Anugrah Narayan Magadh Medical College", "address": "Gaya - 823001", "phone": "0631-2220323", "type": "Government", "beds": "900", "emergency": True},
            {"name": "Gaya Sadar Hospital", "address": "Station Road, Gaya", "phone": "0631-2220001", "type": "Government", "beds": "200", "emergency": True},
        ],
        "Muzaffarpur": [
            {"name": "Sri Krishna Medical College (SKMCH)", "address": "Umanagar, Muzaffarpur - 842004", "phone": "0621-2214580", "type": "Government", "beds": "1050", "emergency": True},
        ],
        "Bhagalpur": [
            {"name": "Jawaharlal Nehru Medical College", "address": "Bhagalpur - 812001", "phone": "0641-2401560", "type": "Government", "beds": "800", "emergency": True},
        ],
    },
    "West Bengal": {
        "Kolkata": [
            {"name": "SSKM Hospital (PG Hospital)", "address": "244 AJC Bose Road, Kolkata - 700020", "phone": "033-22044440", "type": "Government", "beds": "1800", "emergency": True},
            {"name": "RG Kar Medical College & Hospital", "address": "1 Khudiram Bose Sarani, Kolkata", "phone": "033-25551234", "type": "Government", "beds": "1500", "emergency": True},
            {"name": "NRS Medical College", "address": "138 AJC Bose Road, Kolkata", "phone": "033-22443210", "type": "Government", "beds": "900", "emergency": True},
            {"name": "Medical College Hospital Kolkata", "address": "88 College Street, Kolkata", "phone": "033-22123053", "type": "Government", "beds": "1200", "emergency": True},
        ],
        "Howrah": [
            {"name": "Howrah District Hospital", "address": "Howrah - 711101", "phone": "033-26382000", "type": "Government", "beds": "500", "emergency": True},
        ],
        "Darjeeling": [
            {"name": "North Bengal Medical College", "address": "Sushrutanagar, Darjeeling", "phone": "0353-2581930", "type": "Government", "beds": "700", "emergency": True},
        ],
    },
    "Uttar Pradesh": {
        "Lucknow": [
            {"name": "King George's Medical University (KGMU)", "address": "Shah Mina Road, Lucknow - 226003", "phone": "0522-2257450", "type": "Government", "beds": "3200", "emergency": True},
            {"name": "Ram Manohar Lohia Hospital", "address": "Vibhuti Khand, Gomti Nagar, Lucknow", "phone": "0522-2235973", "type": "Government", "beds": "600", "emergency": True},
            {"name": "Balrampur Hospital", "address": "Golaganj, Lucknow", "phone": "0522-2620016", "type": "Government", "beds": "550", "emergency": True},
        ],
        "Varanasi": [
            {"name": "BHU Sir Sunderlal Hospital", "address": "BHU Campus, Varanasi - 221005", "phone": "0542-2309289", "type": "Government", "beds": "1350", "emergency": True},
        ],
        "Agra": [
            {"name": "SN Medical College", "address": "MG Road, Agra - 282002", "phone": "0562-2520077", "type": "Government", "beds": "1100", "emergency": True},
        ],
        "Allahabad": [
            {"name": "Motilal Nehru Medical College", "address": "Lowther Road, Prayagraj - 211001", "phone": "0532-2256226", "type": "Government", "beds": "900", "emergency": True},
        ],
    },
    "Rajasthan": {
        "Jaipur": [
            {"name": "SMS Hospital Jaipur", "address": "JLN Marg, Jaipur - 302004", "phone": "0141-2518888", "type": "Government", "beds": "2500", "emergency": True},
            {"name": "JK Lon Hospital (Children)", "address": "Jaipur", "phone": "0141-2710770", "type": "Government", "beds": "750", "emergency": True},
        ],
        "Jodhpur": [
            {"name": "AIIMS Jodhpur", "address": "Basni Phase-2, Jodhpur - 342005", "phone": "0291-2740741", "type": "Government/AIIMS", "beds": "500", "emergency": True},
            {"name": "MDM Hospital", "address": "Residency Road, Jodhpur", "phone": "0291-2434374", "type": "Government", "beds": "1000", "emergency": True},
        ],
    },
    "Maharashtra": {
        "Mumbai": [
            {"name": "KEM Hospital", "address": "Acharya Donde Marg, Parel, Mumbai - 400012", "phone": "022-24107000", "type": "Government", "beds": "1800", "emergency": True},
            {"name": "Nair Hospital", "address": "Dr. A.L. Nair Road, Mumbai Central", "phone": "022-23027600", "type": "Government", "beds": "1500", "emergency": True},
            {"name": "JJ Hospital", "address": "Byculla, Mumbai - 400008", "phone": "022-23735555", "type": "Government", "beds": "1400", "emergency": True},
        ],
        "Pune": [
            {"name": "Sassoon General Hospital", "address": "Pune Station, Pune - 411001", "phone": "020-26128000", "type": "Government", "beds": "1400", "emergency": True},
        ],
        "Nagpur": [
            {"name": "Government Medical College Nagpur", "address": "Hanuman Nagar, Nagpur", "phone": "0712-2744405", "type": "Government", "beds": "1100", "emergency": True},
        ],
    },
    "Delhi": {
        "New Delhi": [
            {"name": "AIIMS New Delhi", "address": "Ansari Nagar, New Delhi - 110029", "phone": "011-26588500", "type": "Government/AIIMS", "beds": "2500", "emergency": True},
            {"name": "Safdarjung Hospital", "address": "Ansari Nagar West, New Delhi", "phone": "011-26165060", "type": "Government", "beds": "1500", "emergency": True},
            {"name": "GTB Hospital", "address": "Dilshad Garden, Delhi - 110095", "phone": "011-22582626", "type": "Government", "beds": "1500", "emergency": True},
            {"name": "Lok Nayak Hospital", "address": "Jawahar Lal Nehru Marg, Delhi", "phone": "011-23234242", "type": "Government", "beds": "2000", "emergency": True},
        ],
    },
    "Gujarat": {
        "Ahmedabad": [
            {"name": "Civil Hospital Ahmedabad", "address": "Asarwa, Ahmedabad - 380016", "phone": "079-22680000", "type": "Government", "beds": "2800", "emergency": True},
            {"name": "VS General Hospital", "address": "Ellis Bridge, Ahmedabad", "phone": "079-26578900", "type": "Government", "beds": "600", "emergency": True},
        ],
        "Surat": [
            {"name": "New Civil Hospital Surat", "address": "Majura Gate, Surat - 395001", "phone": "0261-2244927", "type": "Government", "beds": "1600", "emergency": True},
        ],
    },
}

# ── LANGUAGE ───────────────────────────────────────────────────
def detect_lang(text):
    try: return detect(text)
    except: return "en"

def system_prompt(lang):
    if lang == "hi":
        return """आप AarogyaBot हैं — भारत के ग्रामीण क्षेत्रों के लिए एक AI स्वास्थ्य सहायक।
सरल, स्पष्ट हिंदी में जवाब दें। लक्षणों के बारे में व्यावहारिक जानकारी दें।
हमेशा डॉक्टर से मिलने की सलाह दें। घरेलू उपचार भी बताएं जहां उचित हो।
यह चिकित्सा निदान नहीं है।"""
    elif lang == "bn":
        return """আপনি AarogyaBot — ভারতের গ্রামীণ মানুষদের জন্য AI স্বাস্থ্য সহায়ক।
সহজ বাংলায় উত্তর দিন। ব্যবহারিক স্বাস্থ্য পরামর্শ দিন।
সর্বদা ডাক্তার দেখানোর পরামর্শ দিন।"""
    return """You are AarogyaBot — a caring AI health assistant for rural India.
Give clear, practical health guidance. Mention home remedies where appropriate.
Always recommend seeing a doctor for serious symptoms. Be warm and empathetic.
Format responses clearly with bullet points when listing symptoms or remedies.
This is NOT a medical diagnosis."""

# ── ROUTES ─────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")

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

# ── API ROUTES ─────────────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.json
    user_msg = data.get("message", "")
    history  = data.get("history", [])
    force_lang = data.get("lang")

    lang = force_lang if force_lang else detect_lang(user_msg)
    sys  = system_prompt(lang)

    messages = [{"role": "system", "content": sys}]
    for h in history[-8:]:
        messages.append(h)
    messages.append({"role": "user", "content": user_msg})

    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=600,
        temperature=0.7,
    )
    reply = resp.choices[0].message.content
    return jsonify({"reply": reply, "lang": lang})

@app.route("/api/districts", methods=["POST"])
def api_districts():
    state = request.json.get("state", "")
    districts = list(HOSPITALS.get(state, {}).keys())
    return jsonify({"districts": districts})

@app.route("/api/hospitals", methods=["POST"])
def api_hospitals():
    data     = request.json
    state    = data.get("state", "")
    district = data.get("district", "")
    result   = HOSPITALS.get(state, {}).get(district, [])
    return jsonify({"hospitals": result})

@app.route("/api/medicine", methods=["POST"])
def api_medicine():
    med  = request.json.get("medicine", "")
    lang = detect_lang(med)

    prompts = {
        "hi": f"{med} दवाई के बारे में विस्तार से बताएं:\n1. उपयोग क्या है\n2. खुराक (वयस्क और बच्चे)\n3. साइड इफेक्ट्स\n4. कब न लें\n5. भारत में सस्ते विकल्प\n6. खाने के साथ लें या खाली पेट",
        "bn": f"{med} ওষুধ সম্পর্কে বিস্তারিত বলুন:\n1. ব্যবহার\n2. ডোজ\n3. পার্শ্ব প্রতিক্রিয়া\n4. সস্তা বিকল্প",
    }
    prompt = prompts.get(lang,
        f"Provide detailed information about {med} medicine for Indian patients:\n"
        f"1. Uses and indications\n2. Dosage (adults & children)\n"
        f"3. Side effects\n4. Contraindications\n"
        f"5. Affordable Indian brand alternatives\n6. Take with food or empty stomach\n"
        f"Format clearly with numbered sections."
    )

    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a clinical pharmacist helping Indian patients understand their medicines. Be accurate, clear and practical."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
    )
    return jsonify({"info": resp.choices[0].message.content})

@app.route("/api/weather", methods=["POST"])
def api_weather():
    if not WEATHER_KEY:
        return jsonify({"error": "Weather API not configured"}), 503
    data = request.json
    lat  = data.get("lat")
    lon  = data.get("lon")
    city = data.get("city", "")

    try:
        if lat and lon:
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_KEY}&units=metric"
        else:
            url = f"https://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={WEATHER_KEY}&units=metric"

        r = requests.get(url, timeout=5)
        d = r.json()

        temp     = d["main"]["temp"]
        feels    = d["main"]["feels_like"]
        humidity = d["main"]["humidity"]
        desc     = d["weather"][0]["description"].title()
        city_name= d["name"]
        aqi_warn = ""

        if temp > 38:
            aqi_warn = "⚠️ Heat alert: Stay hydrated, avoid outdoor activity 11am–4pm"
        elif humidity > 85:
            aqi_warn = "⚠️ High humidity: Risk of fungal infections and breathing issues"
        elif temp < 10:
            aqi_warn = "⚠️ Cold alert: Cover up well, risk of respiratory infections"

        return jsonify({
            "city": city_name,
            "temp": round(temp),
            "feels": round(feels),
            "humidity": humidity,
            "desc": desc,
            "warning": aqi_warn,
            "icon": d["weather"][0]["icon"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/tts", methods=["POST"])
def api_tts():
    data = request.json
    text = data.get("text", "")
    lang = data.get("lang", "en")
    tts_lang = {"hi": "hi", "bn": "bn"}.get(lang, "en")
    tts = gTTS(text=text[:500], lang=tts_lang)
    buf = io.BytesIO()
    tts.write_to_fp(buf)
    buf.seek(0)
    return send_file(buf, mimetype="audio/mpeg")

if __name__ == "__main__":
    app.run(debug=True)
