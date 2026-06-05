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

# ─── SECURE API CONFIGURATION ─────────────────────────
KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")

if KINDWISE_API_KEY:
    KINDWISE_API_KEY = KINDWISE_API_KEY.strip().replace('"', '').replace("'", "")
else:
    print("⚠️ CRITICAL PROMPT: KINDWISE_API_KEY environment variable is currently missing or unreadable.")

AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

LANGUAGE_CODES = {
    "Hindi": "hi", "Bengali": "bn", "Telugu": "te",
    "Marathi": "mr", "Tamil": "ta", "Gujarati": "gu",
    "Kannada": "kn", "Punjabi": "pa", "Odia": "or",
    "Malayalam": "ml", "Urdu": "ur", "English": "en"
}

# Establish a global persistent connection pool to stop 'Connection Reset' error drops
http_session = requests.Session()

# ─── APPLICATION ROUTES ────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")

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

# ─── REALTIME WEATHER ENGINE ──────────────────────────

@app.route("/get_weather", methods=["POST"])
def get_weather():
    data = request.json
    lat = data.get("lat")
    lon = data.get("lon")
    api_key = os.getenv("OPENWEATHER_API_KEY")

    try:
        current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        current = http_session.get(current_url, timeout=10).json()

        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        forecast = http_session.get(forecast_url, timeout=10).json()

        return jsonify({
            "current": {
                "city": current["name"],
                "temp": current["main"]["temp"],
                "humidity": current["main"]["humidity"],
                "description": current["weather"][0]["description"],
                "icon": current["weather"][0]["icon"],
                "wind": current["wind"]["speed"]
            },
            "forecast": [
                {
                    "date": item["dt_txt"],
                    "temp": item["main"]["temp"],
                    "description": item["weather"][0]["description"],
                    "icon": item["weather"][0]["icon"]
                }
                for item in forecast["list"][::8]
            ]
        })
    except Exception as e:
        print(f"Weather API error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# ─── CROP ADVISORY INTERACTION ────────────────────────

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
                {
                    "role": "system",
                    "content": f"""You are FasalMitra, an expert Indian agricultural advisor.
A farmer is asking about their {crop} crop regarding {problem}.
Reply ONLY in {lang} language.
Give practical simple advice a rural farmer can follow immediately.
Use simple words. Keep response under 100 words.
Mention specific quantities (kg, liters) where relevant."""
                },
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

        return jsonify({
            "advice": advice,
            "audio_url": f"/static/audio/{audio_filename}"
        })

    except Exception as e:
        print(f"Advice error: {str(e)}")
        return jsonify({"advice": f"Error: {str(e)}", "audio_url": None}), 500

# ─── SEASONAL CROP RECOMMENDATION ────────────────────

@app.route("/get_recommendation", methods=["POST"])
def get_recommendation():
    data = request.json
    lat = data.get("lat")
    lon = data.get("lon")
    weather = data.get("weather", {})
    lang = data.get("lang", "English")

    try:
        prompt = f"""You are FasalMitra, an expert Indian agricultural advisor.
Based on this weather data:
- Temperature: {weather.get('temp')}°C
- Humidity: {weather.get('humidity')}%
- Condition: {weather.get('description')}
- Location coordinates: {lat}, {lon}

Reply in {lang} language.
Recommend:
1. Top 3 crops to grow now
2. Brief advisory for each crop
3. Pesticide schedule for each crop
Keep it simple and practical for a rural farmer.
Keep response under 150 words."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400
        )
        return jsonify({"recommendation": response.choices[0].message.content})

    except Exception as e:
        print(f"Recommendation error: {str(e)}")
        return jsonify({"recommendation": f"Error: {str(e)}"}), 500

# ─── AGRICULTURAL MARKET MONITOR ──────────────────────

@app.route("/get_market", methods=["POST"])
def get_market():
    data = request.json
    state = data.get("state", "")
    commodity = data.get("commodity", "")
    api_key = os.getenv("DATAGOV_API_KEY")

    try:
        url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
        params = {
            "api-key": api_key,
            "format": "json",
            "limit": 50,
            "offset": 0
        }
        if state:
            params["filters[state]"] = state
        if commodity:
            params["filters[commodity]"] = commodity

        response = http_session.get(url, params=params, timeout=15)
        result = response.json()

        if "records" in result and len(result["records"]) > 0:
            return jsonify({"data": result["records"], "source": "live"})
        else:
            return jsonify({"data": get_fallback_market_data(), "source": "fallback"})

    except Exception as e:
        print(f"Market API error: {str(e)}")
        return jsonify({"data": get_fallback_market_data(), "source": "fallback"})

def get_fallback_market_data():
    return [
        {"state": "Maharashtra", "district": "Pune", "market": "Pune", "commodity": "Tomato", "min_price": "800", "max_price": "1200", "modal_price": "1000", "arrival_date": "04/06/2026"},
        {"state": "Punjab", "district": "Ludhiana", "market": "Ludhiana", "commodity": "Wheat", "min_price": "2000", "max_price": "2200", "modal_price": "2100", "arrival_date": "04/06/2026"},
        {"state": "West Bengal", "district": "Kolkata", "market": "Kolkata", "commodity": "Rice", "min_price": "1800", "max_price": "2200", "modal_price": "2000", "arrival_date": "04/06/2026"},
        {"state": "Uttar Pradesh", "district": "Lucknow", "market": "Lucknow", "commodity": "Potato", "min_price": "600", "max_price": "900", "modal_price": "750", "arrival_date": "04/06/2026"},
    ]

# ─── WEATHER WARNING ALERTS ───────────────────────────

@app.route("/get_alerts", methods=["POST"])
def get_alerts():
    data = request.json
    weather = data.get("weather", {})
    lang = data.get("lang", "English")

    try:
        prompt = f"""You are FasalMitra, an expert Indian agricultural advisor.
Based on this weather:
- Temperature: {weather.get('temp')}°C
- Humidity: {weather.get('humidity')}%
- Condition: {weather.get('description')}

Reply in {lang} language.
Give exactly 5 alerts as numbered list:
1. Weather safety tip for farmers
2. Which crop is risky to grow now
3. Pest warning based on current weather
4. Pesticide usage warning
5. Best practice for today's weather
Keep each point under 30 words. Simple language."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400
        )
        return jsonify({"alerts": response.choices[0].message.content})

    except Exception as e:
        print(f"Alerts error: {str(e)}")
        return jsonify({"alerts": f"Error: {str(e)}"}), 500

# ─── TRANSLATION ENGINE ───────────────────────────────

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text", "")
    lang = data.get("lang", "Hindi")

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{
                "role": "user",
                "content": f"Translate this text to {lang}. Return ONLY the translated text, nothing else:\n\n{text}"
            }],
            max_tokens=500
        )
        return jsonify({"translated": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"translated": text}), 500

# ─── CORRECT KINDWISE V3 DIAGNOSTICS ROUTE ─────────────

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
        print(f"Kindwise response: {response.text[:500]}")

        if response.status_code not in [200, 201]:
            return jsonify({'success': False, 'error': f"API Error (Status: {response.status_code})"}), 500

        data = response.json()

        # Parse disease suggestions
        disease_suggestions = data.get('result', {}).get('disease', {}).get('suggestions', [])
        crop_suggestions = data.get('result', {}).get('crop', {}).get('suggestions', [])

        disease_name = "Unknown condition"
        probability = 0
        raw_treatment = "Monitor crop closely and consult local agricultural officer."

        if disease_suggestions:
            top = disease_suggestions[0]
            disease_name = top.get('name', 'Unknown')
            probability = round(top.get('probability', 0) * 100, 1)
            details = top.get('details', {}) or {}
            treatment = details.get('treatment', {}) or {}
            steps = []
            for k, v in treatment.items():
                if v:
                    steps.append(f"{k.capitalize()}: {', '.join(v) if isinstance(v, list) else v}")
            if steps:
                raw_treatment = " | ".join(steps)

        crop_name = ""
        if crop_suggestions:
            crop_name = crop_suggestions[0].get('name', '')

        prompt = f"""You are FasalMitra, an expert plant pathologist.
Crop identified: {crop_name}
Disease detected: {disease_name} ({probability}% confidence)
Treatment data: {raw_treatment}
Farmer observation: {description}

Reply in {lang} language.
Format response with these sections:
🎯 Diagnosis: [disease name] ({probability}% confidence)
🌿 Crop: [crop name]
🛠️ Eco-friendly Treatment: [simple practical steps]
🛡️ Prevention Tips: [1-2 points]
Keep under 150 words. Simple language for rural farmer."""

        groq_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400
        )

        return jsonify({
            'success': True,
            'diagnosis': groq_response.choices[0].message.content
        })

    except Exception as e:
        print(f"Diagnose error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ─── COMPILER SYSTEM RUNTIME ──────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

