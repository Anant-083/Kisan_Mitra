from flask import Flask, render_template, request, jsonify
from groq import Groq
from gtts import gTTS
from dotenv import load_dotenv
import os
import uuid
import requests
import base64

load_dotenv()

app = Flask(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")
if KINDWISE_API_KEY:
    KINDWISE_API_KEY = KINDWISE_API_KEY.strip().replace('"', '').replace("'", "")

AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

LANGUAGE_CODES = {
    "Hindi": "hi", "Bengali": "bn", "Telugu": "te",
    "Marathi": "mr", "Tamil": "ta", "Gujarati": "gu",
    "Kannada": "kn", "Punjabi": "pa", "Odia": "or",
    "Malayalam": "ml", "Urdu": "ur", "English": "en"
}

http_session = requests.Session()

@app.route("/")
def index():
    lang = request.args.get("lang", "English")
    return render_template("index.html", lang=lang)

@app.route("/chat")
def chat():
    lang = request.args.get("lang", "English")
    crop = request.args.get("crop", "Rice")
    problem = request.args.get("problem", "Fertilizer")
    return render_template("chat.html", lang=lang, crop=crop, problem=problem)

@app.route("/diagnose")
def diagnose():
    return render_template("diagnose.html")

@app.route("/market")
def market():
    return render_template("market.html")

@app.route("/alerts")
def alerts():
    return render_template("alerts.html")

@app.route("/get_weather", methods=["POST"])
def get_weather():
    data = request.json
    lat = data.get("lat")
    lon = data.get("lon")
    api_key = os.getenv("OPENWEATHER_API_KEY")
    try:
        current = http_session.get(
            f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric",
            timeout=10).json()
        forecast = http_session.get(
            f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric",
            timeout=10).json()
        return jsonify({
            "current": {
                "city": current["name"],
                "temp": current["main"]["temp"],
                "feels_like": current["main"]["feels_like"],
                "humidity": current["main"]["humidity"],
                "description": current["weather"][0]["description"],
                "icon": current["weather"][0]["icon"],
                "wind": current["wind"]["speed"],
                "pressure": current["main"]["pressure"]
            },
            "forecast": [
                {
                    "date": item["dt_txt"],
                    "temp": item["main"]["temp"],
                    "description": item["weather"][0]["description"],
                    "icon": item["weather"][0]["icon"]
                }
                for item in forecast["list"][7::8][:7]
            ]
        })
    except Exception as e:
        print(f"Weather error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/get_advice", methods=["POST"])
def get_advice():
    data = request.json
    lang = data.get("lang", "English")
    crop = data.get("crop", "Rice")
    problem = data.get("problem", "Fertilizer")
    question = data.get("question", "")
    user_message = question if question else f"Give me advice about {problem} for {crop}."
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": f"""You are FasalMitra, an expert Indian agricultural advisor.
Farmer asks about {crop} crop regarding {problem}.
Reply ONLY in {lang} language.
Give practical simple advice immediately.
Use simple words. Under 100 words.
Mention specific quantities where relevant."""},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300
        )
        advice = response.choices[0].message.content
        lang_code = LANGUAGE_CODES.get(lang, "en")
        audio_filename = f"{uuid.uuid4().hex}.mp3"
        audio_path = os.path.join(AUDIO_DIR, audio_filename)
        tts = gTTS(text=advice, lang=lang_code)
        tts.save(audio_path)
        return jsonify({"advice": advice, "audio_url": f"/static/audio/{audio_filename}"})
    except Exception as e:
        return jsonify({"advice": f"Error: {str(e)}", "audio_url": None}), 500

@app.route("/get_recommendation", methods=["POST"])
def get_recommendation():
    data = request.json
    lat = data.get("lat")
    lon = data.get("lon")
    weather = data.get("weather", {})
    lang = data.get("lang", "English")
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": f"""You are FasalMitra, expert Indian agricultural advisor.
Weather: Temp {weather.get('temp')}°C, Humidity {weather.get('humidity')}%, {weather.get('description')}
Location: {lat}, {lon}
Reply in {lang} language ONLY.
Give:
1. Top 3 crops to grow now
2. Brief advisory for each
3. Pesticide schedule
Under 150 words. Simple language."""}],
            max_tokens=400
        )
        return jsonify({"recommendation": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"recommendation": f"Error: {str(e)}"}), 500

@app.route("/get_market", methods=["POST"])
def get_market():
    data = request.json
    state = data.get("state", "")
    commodity = data.get("commodity", "")
    api_key = os.getenv("DATAGOV_API_KEY")
    try:
        params = {"api-key": api_key, "format": "json", "limit": 50}
        if state:
            params["filters[state]"] = state
        if commodity:
            params["filters[commodity]"] = commodity
        response = http_session.get(
            "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
            params=params, timeout=15)
        result = response.json()
        if "records" in result and len(result["records"]) > 0:
            return jsonify({"data": result["records"], "source": "live"})
        return jsonify({"data": get_fallback_market_data(state, commodity), "source": "fallback"})
    except Exception as e:
        print(f"Market error: {e}")
        return jsonify({"data": get_fallback_market_data(state, commodity), "source": "fallback"})

def get_fallback_market_data(state="", commodity=""):
    data = [
        {"state": "Bihar", "district": "Patna", "market": "Patna", "commodity": "Wheat", "min_price": "1900", "max_price": "2100", "modal_price": "2000", "arrival_date": "06/06/2026"},
        {"state": "Bihar", "district": "Patna", "market": "Patna", "commodity": "Rice", "min_price": "2000", "max_price": "2400", "modal_price": "2200", "arrival_date": "06/06/2026"},
        {"state": "Maharashtra", "district": "Pune", "market": "Pune", "commodity": "Tomato", "min_price": "800", "max_price": "1200", "modal_price": "1000", "arrival_date": "06/06/2026"},
        {"state": "Punjab", "district": "Ludhiana", "market": "Ludhiana", "commodity": "Wheat", "min_price": "2000", "max_price": "2200", "modal_price": "2100", "arrival_date": "06/06/2026"},
        {"state": "West Bengal", "district": "Kolkata", "market": "Kolkata", "commodity": "Rice", "min_price": "1800", "max_price": "2200", "modal_price": "2000", "arrival_date": "06/06/2026"},
        {"state": "Uttar Pradesh", "district": "Lucknow", "market": "Lucknow", "commodity": "Potato", "min_price": "600", "max_price": "900", "modal_price": "750", "arrival_date": "06/06/2026"},
        {"state": "Gujarat", "district": "Ahmedabad", "market": "Ahmedabad", "commodity": "Cotton", "min_price": "5500", "max_price": "6500", "modal_price": "6000", "arrival_date": "06/06/2026"},
        {"state": "Karnataka", "district": "Bangalore", "market": "Bangalore", "commodity": "Onion", "min_price": "1200", "max_price": "1800", "modal_price": "1500", "arrival_date": "06/06/2026"},
        {"state": "Rajasthan", "district": "Jaipur", "market": "Jaipur", "commodity": "Mustard", "min_price": "4500", "max_price": "5200", "modal_price": "4800", "arrival_date": "06/06/2026"},
        {"state": "Madhya Pradesh", "district": "Indore", "market": "Indore", "commodity": "Soybean", "min_price": "3800", "max_price": "4500", "modal_price": "4200", "arrival_date": "06/06/2026"},
        {"state": "Andhra Pradesh", "district": "Guntur", "market": "Guntur", "commodity": "Chilli", "min_price": "8000", "max_price": "12000", "modal_price": "10000", "arrival_date": "06/06/2026"},
        {"state": "Tamil Nadu", "district": "Chennai", "market": "Chennai", "commodity": "Maize", "min_price": "1600", "max_price": "2000", "modal_price": "1800", "arrival_date": "06/06/2026"},
        {"state": "Haryana", "district": "Karnal", "market": "Karnal", "commodity": "Rice", "min_price": "2000", "max_price": "2400", "modal_price": "2200", "arrival_date": "06/06/2026"},
    ]
    if state:
        filtered = [r for r in data if state.lower() in r["state"].lower() or state.lower() in r["district"].lower()]
        if filtered:
            return filtered
    if commodity:
        filtered = [r for r in data if commodity.lower() in r["commodity"].lower()]
        if filtered:
            return filtered
    return data

@app.route("/get_alerts", methods=["POST"])
def get_alerts():
    data = request.json
    weather = data.get("weather", {})
    lang = data.get("lang", "English")
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": f"""You are FasalMitra, expert Indian agricultural advisor.
Weather: Temp {weather.get('temp')}°C, Humidity {weather.get('humidity')}%, {weather.get('description')}
Reply in {lang} language ONLY.
Give exactly 5 farm alerts numbered 1-5:
1. Weather safety tip
2. Risky crop to avoid
3. Pest warning
4. Pesticide warning
5. Best practice today
Each under 25 words. Simple language."""}],
            max_tokens=400
        )
        return jsonify({"alerts": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"alerts": f"Error: {str(e)}"}), 500

@app.route("/diagnose_crop", methods=["POST"])
def diagnose_crop():
    if not KINDWISE_API_KEY:
        return jsonify({'success': False, 'error': 'API key missing'}), 500
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image uploaded'}), 400
    file = request.files['image']
    description = request.form.get("description", "")
    lang = request.form.get("lang", "English")
    try:
        file_bytes = file.read()
        base64_image = base64.b64encode(file_bytes).decode('ascii')
        url = "https://crop.kindwise.com/api/v1/identification"
        headers = {
            "Api-Key": KINDWISE_API_KEY,
            "Content-Type": "application/json"
        }
        payload = {
            "images": [base64_image],
            "similar_images": True
        }
        response = http_session.post(url, headers=headers, json=payload, timeout=30)
        print(f"Kindwise status: {response.status_code}")
        if response.status_code not in [200, 201]:
            return jsonify({'success': False, 'error': f"API Error (Status: {response.status_code})"}), 500
        data = response.json()
        disease_suggestions = data.get('result', {}).get('disease', {}).get('suggestions', [])
        crop_suggestions = data.get('result', {}).get('crop', {}).get('suggestions', [])
        disease_name = "Unknown condition"
        probability = 0
        raw_treatment = "Monitor crop and consult local agricultural officer."
        if disease_suggestions:
            top = disease_suggestions[0]
            disease_name = top.get('name', 'Unknown')
            probability = round(top.get('probability', 0) * 100, 1)
        crop_name = crop_suggestions[0].get('name', '') if crop_suggestions else ''
        prompt = f"""You are FasalMitra, expert plant pathologist.
Crop: {crop_name}, Disease: {disease_name} ({probability}% confidence)
Farmer observation: {description}
Reply in {lang} language ONLY.
Format:
🎯 Diagnosis: [name] ({probability}% confidence)
🌿 Crop: [name]
🛠️ Eco-friendly Treatment: [steps]
🛡️ Prevention: [1-2 tips]
Under 150 words."""
        groq_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400
        )
        return jsonify({'success': True, 'diagnosis': groq_response.choices[0].message.content})
    except Exception as e:
        print(f"Diagnose error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
