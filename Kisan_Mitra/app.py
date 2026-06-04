from flask import Flask, render_template, request, jsonify
from groq import Groq
from gtts import gTTS
from dotenv import load_dotenv
import os
import uuid
import requests

load_dotenv()

app = Flask(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

AUDIO_DIR = "static/audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

LANGUAGE_CODES = {
    "Hindi": "hi", "Bengali": "bn", "Telugu": "te",
    "Marathi": "mr", "Tamil": "ta", "Gujarati": "gu",
    "Kannada": "kn", "Punjabi": "pa", "Odia": "or",
    "Malayalam": "ml", "Urdu": "ur", "English": "en"
}

# ─── ROUTES ───────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat")
def chat():
    lang = request.args.get("lang", "Hindi")
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

# ─── WEATHER API ──────────────────────────────────────

@app.route("/get_weather", methods=["POST"])
def get_weather():
    data = request.json
    lat = data.get("lat")
    lon = data.get("lon")
    api_key = os.getenv("OPENWEATHER_API_KEY")

    try:
        # Current weather
        current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        current = requests.get(current_url).json()

        # 7 day forecast
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        forecast = requests.get(forecast_url).json()

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
                for item in forecast["list"][::8][:7]
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── CROP ADVISORY ────────────────────────────────────

@app.route("/get_advice", methods=["POST"])
def get_advice():
    data = request.json
    lang = data.get("lang", "Hindi")
    crop = data.get("crop", "Rice")
    problem = data.get("problem", "Fertilizer")
    question = data.get("question", "")

    user_message = question if question else f"Give me advice about {problem} for {crop}."

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": f"""You are KisanMitra, an expert Indian agricultural advisor.
A farmer is asking about their {crop} crop regarding {problem}.
Reply ONLY in {language} language.
Give practical simple advice a rural farmer can follow immediately.
Use simple words. Keep response under 100 words.
Mention specific quantities (kg, liters) where relevant.""".replace("{language}", lang)},
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
        return jsonify({"advice": f"Error: {str(e)}", "audio_url": None}), 500

# ─── CROP RECOMMENDATION ──────────────────────────────

@app.route("/get_recommendation", methods=["POST"])
def get_recommendation():
    data = request.json
    lat = data.get("lat")
    lon = data.get("lon")
    weather = data.get("weather", {})
    lang = data.get("lang", "English")

    try:
        prompt = f"""You are an expert Indian agricultural advisor.
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
Keep it simple and practical for a rural farmer."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return jsonify({"recommendation": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"recommendation": f"Error: {str(e)}"}), 500

# ─── MARKET PRICES ────────────────────────────────────

@app.route("/get_market", methods=["POST"])
def get_market():
    data = request.json
    state = data.get("state", "")
    commodity = data.get("commodity", "")
    api_key = os.getenv("DATAGOV_API_KEY")

    try:
        url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
        params = {
            "api-key": api_key,
            "format": "json",
            "limit": 50
        }
        if state:
            params["filters[state]"] = state
        if commodity:
            params["filters[commodity]"] = commodity

        response = requests.get(url, params=params, timeout=10)
        result = response.json()

        if "records" in result:
            return jsonify({"data": result["records"]})
        else:
            return jsonify({"data": get_fallback_market_data()})

    except Exception as e:
        return jsonify({"data": get_fallback_market_data()})

def get_fallback_market_data():
    return [
        {"state": "Maharashtra", "district": "Pune", "market": "Pune", "commodity": "Tomato", "min_price": "800", "max_price": "1200", "modal_price": "1000", "arrival_date": "03/06/2026"},
        {"state": "Punjab", "district": "Ludhiana", "market": "Ludhiana", "commodity": "Wheat", "min_price": "2000", "max_price": "2200", "modal_price": "2100", "arrival_date": "03/06/2026"},
        {"state": "West Bengal", "district": "Kolkata", "market": "Kolkata", "commodity": "Rice", "min_price": "1800", "max_price": "2200", "modal_price": "2000", "arrival_date": "03/06/2026"},
        {"state": "Uttar Pradesh", "district": "Lucknow", "market": "Lucknow", "commodity": "Potato", "min_price": "600", "max_price": "900", "modal_price": "750", "arrival_date": "03/06/2026"},
        {"state": "Gujarat", "district": "Ahmedabad", "market": "Ahmedabad", "commodity": "Cotton", "min_price": "5500", "max_price": "6500", "modal_price": "6000", "arrival_date": "03/06/2026"},
        {"state": "Karnataka", "district": "Bangalore", "market": "Bangalore", "commodity": "Onion", "min_price": "1200", "max_price": "1800", "modal_price": "1500", "arrival_date": "03/06/2026"},
        {"state": "Rajasthan", "district": "Jaipur", "market": "Jaipur", "commodity": "Mustard", "min_price": "4500", "max_price": "5200", "modal_price": "4800", "arrival_date": "03/06/2026"},
        {"state": "Madhya Pradesh", "district": "Indore", "market": "Indore", "commodity": "Soybean", "min_price": "3800", "max_price": "4500", "modal_price": "4200", "arrival_date": "03/06/2026"},
        {"state": "Andhra Pradesh", "district": "Guntur", "market": "Guntur", "commodity": "Chilli", "min_price": "8000", "max_price": "12000", "modal_price": "10000", "arrival_date": "03/06/2026"},
        {"state": "Tamil Nadu", "district": "Chennai", "market": "Chennai", "commodity": "Maize", "min_price": "1600", "max_price": "2000", "modal_price": "1800", "arrival_date": "03/06/2026"},
    ]

# ─── ALERTS ───────────────────────────────────────────

@app.route("/get_alerts", methods=["POST"])
def get_alerts():
    data = request.json
    weather = data.get("weather", {})
    lang = data.get("lang", "English")

    try:
        prompt = f"""You are an expert Indian agricultural advisor.
Based on this weather:
- Temperature: {weather.get('temp')}°C
- Humidity: {weather.get('humidity')}%
- Condition: {weather.get('description')}

Reply in {lang} language.
Give alerts about:
1. Which crops are risky to grow now
2. Pest warnings based on current weather
3. Pesticide usage warnings
4. Weather safety tips for farmers
Keep it concise and practical."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400
        )
        return jsonify({"alerts": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"alerts": f"Error: {str(e)}"}), 500

# ─── TRANSLATE ────────────────────────────────────────

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

# ─── DIAGNOSE ─────────────────────────────────────────

@app.route("/diagnose_crop", methods=["POST"])
def diagnose_crop():
    # ML person will integrate their model here
    # For now Groq gives eco-friendly remedy
    data = request.json
    description = data.get("description", "")
    lang = data.get("lang", "English")

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{
                "role": "user",
                "content": f"""You are an expert plant pathologist.
A farmer described this crop problem: {description}
Reply in {lang} language.
Give:
1. Most likely disease/pest name
2. Eco-friendly remedy solution
3. Organic treatment steps
4. Prevention tips
Keep it simple for a rural farmer."""
            }],
            max_tokens=400
        )
        return jsonify({"diagnosis": response.choices[0].message.content})

    except Exception as e:
        return jsonify({"diagnosis": f"Error: {str(e)}"}), 500

# ─── RUN ──────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
