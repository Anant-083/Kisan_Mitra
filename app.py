from flask import Flask, render_template, request, jsonify, send_file
from groq import Groq
from langdetect import detect
from gtts import gTTS
import os
import io
import json

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# ---------- Hardcoded Hospital Data ----------
HOSPITALS = {
    "Bihar": {
        "Patna": [
            {"name": "Patna Medical College & Hospital", "address": "Ashok Rajpath, Patna", "phone": "0612-2300440", "type": "Government"},
            {"name": "NMCH Patna", "address": "Agamkuan, Patna", "phone": "0612-2631467", "type": "Government"},
            {"name": "IGIMS Patna", "address": "Sheikhpura, Patna", "phone": "0612-2297631", "type": "Government"},
        ],
        "Gaya": [
            {"name": "Anugrah Narayan Magadh Medical College", "address": "Gaya", "phone": "0631-2220323", "type": "Government"},
        ],
        "Muzaffarpur": [
            {"name": "Sri Krishna Medical College", "address": "Umanagar, Muzaffarpur", "phone": "0621-2214580", "type": "Government"},
        ],
    },
    "West Bengal": {
        "Kolkata": [
            {"name": "SSKM Hospital", "address": "244 AJC Bose Road, Kolkata", "phone": "033-22044440", "type": "Government"},
            {"name": "RG Kar Medical College", "address": "1 Khudiram Bose Sarani, Kolkata", "phone": "033-25551234", "type": "Government"},
        ],
        "Howrah": [
            {"name": "Howrah District Hospital", "address": "Howrah", "phone": "033-26382000", "type": "Government"},
        ],
    },
    "Uttar Pradesh": {
        "Lucknow": [
            {"name": "King George's Medical University", "address": "Shah Mina Road, Lucknow", "phone": "0522-2257450", "type": "Government"},
            {"name": "Ram Manohar Lohia Hospital", "address": "Vibhuti Khand, Lucknow", "phone": "0522-2235973", "type": "Government"},
        ],
        "Varanasi": [
            {"name": "BHU Sir Sunderlal Hospital", "address": "BHU Campus, Varanasi", "phone": "0542-2309289", "type": "Government"},
        ],
        "Agra": [
            {"name": "SN Medical College", "address": "MG Road, Agra", "phone": "0562-2520077", "type": "Government"},
        ],
    },
    "Rajasthan": {
        "Jaipur": [
            {"name": "SMS Hospital", "address": "JLN Marg, Jaipur", "phone": "0141-2518888", "type": "Government"},
            {"name": "Sawai Man Singh Hospital", "address": "Jaipur", "phone": "0141-2560291", "type": "Government"},
        ],
        "Jodhpur": [
            {"name": "MDM Hospital", "address": "Residency Road, Jodhpur", "phone": "0291-2434374", "type": "Government"},
        ],
    },
    "Maharashtra": {
        "Mumbai": [
            {"name": "KEM Hospital", "address": "Acharya Donde Marg, Parel, Mumbai", "phone": "022-24107000", "type": "Government"},
            {"name": "Nair Hospital", "address": "Dr. A.L. Nair Road, Mumbai", "phone": "022-23027600", "type": "Government"},
        ],
        "Pune": [
            {"name": "Sassoon General Hospital", "address": "Pune Station, Pune", "phone": "020-26128000", "type": "Government"},
        ],
    },
}

# ---------- Language Helper ----------
def detect_language(text):
    try:
        lang = detect(text)
        return lang
    except:
        return "en"

def get_system_prompt(lang):
    if lang == "hi":
        return """आप AarogyaBot हैं, एक सहायक AI स्वास्थ्य सहायक। आप ग्रामीण भारत के लोगों की मदद करते हैं।
        लक्षणों के बारे में सरल हिंदी में जवाब दें। हमेशा डॉक्टर से मिलने की सलाह दें।
        यह चिकित्सा निदान नहीं है, केवल प्रारंभिक मार्गदर्शन है।"""
    elif lang == "bn":
        return """আপনি AarogyaBot, একটি AI স্বাস্থ্য সহায়ক। গ্রামীণ ভারতের মানুষদের সাহায্য করুন।
        সহজ বাংলায় উপসর্গের উত্তর দিন। সর্বদা ডাক্তার দেখানোর পরামর্শ দিন।"""
    else:
        return """You are AarogyaBot, a helpful AI health assistant for rural India.
        Give simple, clear advice about symptoms. Always recommend seeing a doctor.
        This is not medical diagnosis, only preliminary guidance. Be empathetic and supportive."""

# ---------- Routes ----------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/hospitals")
def hospitals():
    states = list(HOSPITALS.keys())
    return render_template("hospitals.html", states=states)

@app.route("/medicines")
def medicines():
    return render_template("medicines.html")

@app.route("/emergency")
def emergency():
    return render_template("emergency.html")

# ---------- API Routes ----------
@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.json
    user_message = data.get("message", "")
    history = data.get("history", [])

    lang = detect_language(user_message)
    system_prompt = get_system_prompt(lang)

    messages = [{"role": "system", "content": system_prompt}]
    for h in history[-6:]:  # last 6 messages for context
        messages.append(h)
    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=500,
    )

    reply = response.choices[0].message.content
    return jsonify({"reply": reply, "lang": lang})

@app.route("/api/hospitals", methods=["POST"])
def api_hospitals():
    data = request.json
    state = data.get("state", "")
    district = data.get("district", "")
    result = HOSPITALS.get(state, {}).get(district, [])
    return jsonify({"hospitals": result})

@app.route("/api/districts", methods=["POST"])
def api_districts():
    data = request.json
    state = data.get("state", "")
    districts = list(HOSPITALS.get(state, {}).keys())
    return jsonify({"districts": districts})

@app.route("/api/medicine", methods=["POST"])
def api_medicine():
    data = request.json
    medicine_name = data.get("medicine", "")
    lang = detect_language(medicine_name)

    if lang == "hi":
        prompt = f"{medicine_name} दवाई के बारे में सरल हिंदी में बताएं: उपयोग, खुराक, सावधानियां और सस्ते विकल्प।"
    elif lang == "bn":
        prompt = f"{medicine_name} ওষুধ সম্পর্কে সহজ বাংলায় বলুন: ব্যবহার, ডোজ, সতর্কতা এবং সস্তা বিকল্প।"
    else:
        prompt = f"Tell me about {medicine_name} medicine in simple English: uses, dosage, precautions, and affordable alternatives available in India."

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a helpful medical information assistant for rural India. Give simple, clear information. Always advise consulting a doctor or pharmacist."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=400,
    )

    reply = response.choices[0].message.content
    return jsonify({"info": reply})

@app.route("/api/tts", methods=["POST"])
def api_tts():
    data = request.json
    text = data.get("text", "")
    lang = data.get("lang", "en")

    tts_lang = "hi" if lang == "hi" else "bn" if lang == "bn" else "en"
    tts = gTTS(text=text[:500], lang=tts_lang)
    buf = io.BytesIO()
    tts.write_to_fp(buf)
    buf.seek(0)
    return send_file(buf, mimetype="audio/mpeg")

if __name__ == "__main__":
    app.run(debug=True)
