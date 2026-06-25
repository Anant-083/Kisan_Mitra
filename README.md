# AarogyaBot 🏥

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-black?style=for-the-badge&logo=flask&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-orange?style=for-the-badge)
![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-23_Indian-FF6B35?style=for-the-badge)
![Hospitals](https://img.shields.io/badge/Govt_Hospitals-2670-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Free](https://img.shields.io/badge/100%25-Free-brightgreen?style=for-the-badge)
![No Login](https://img.shields.io/badge/No_Login-Required-red?style=for-the-badge)

> **Free multilingual AI health assistant for rural India.**
> Symptom checking · Hospital finder · Medicine info · Prescription reader · Emergency contacts
> in **23 Indian languages** — No login. No data stored. Always free.

🌐 **Live Demo:** [aarogyabot.onrender.com](https://aarogyabot.onrender.com)
📦 **GitHub:** [github.com/Anant-083/AarogyaBot](https://github.com/Anant-083/AarogyaBot)

---

## 🎯 Problem Statement

Rural India faces a massive healthcare accessibility gap:

- **65% of India's population** lives in rural areas with limited access to doctors
- **Language barrier** — most health apps work only in English or Hindi
- **Health literacy** — patients cannot understand medical prescriptions or medicine names
- **Hospital discovery** — people don't know which government hospitals are near them
- **Emergency awareness** — most rural users don't know national health helpline numbers

**AarogyaBot solves all five problems in one free, installable web app.**

---

## 🏆 SIH Relevance

This project directly addresses multiple Smart India Hackathon problem statement themes:

| SIH Theme | How AarogyaBot Addresses It |
|---|---|
| **Healthcare accessibility for rural India** | AI health guidance in 23 languages, free, no login |
| **Multilingual digital services** | Full support for all 22 scheduled languages + Bhojpuri |
| **Government hospital discovery** | 2,670 verified govt hospitals with GPS-based search |
| **Digital health literacy** | Prescription reader explains doctor's notes in simple language |
| **Emergency response** | All national helplines in one place, one-tap calling |
| **PWA / offline-first apps** | Installable, works offline, mobile-first design |
| **AI for social good** | Groq LLaMA AI making healthcare guidance accessible to all |

---

## ✨ Features

### 🗣️ Symptom Checker
- Voice or text input in any Indian language
- AI-powered health guidance using Groq LLaMA 3.3 70B
- Severity selection — Mild, Moderate, Severe
- Auto language detection — reply in same language user types
- Follow-up suggestion chips after every response
- Body area shortcuts — Head, Chest, Stomach, Eyes, Ears, Skin, Legs, Throat
- Chat history, copy, download, share

### 🏥 Hospital Finder
- 2,670 verified government hospitals from data.gov.in National Hospital Directory
- Search by State and District
- GPS-based Near Me — finds hospitals within 20km using Haversine formula
- Automatic OpenStreetMap Overpass API fallback when dataset has no nearby results
- Google Maps direction button on every hospital card
- One-tap calling
- Distance shown in km

### 💊 Medicine Information
- Search any medicine by name
- AI returns uses, dosage, side effects, when not to take, affordable Indian alternatives
- Response in selected language with correct script
- Text-to-speech playback
- Quick chip shortcuts for common medicines

### 📋 Prescription Reader
- Upload prescription as photo, PDF, or screenshot
- AI reads handwritten and printed Indian prescriptions
- Understands Indian medical shorthand — OD, BD, TDS, AC, PC, HS, A.D., SOS
- Explains in simple village-level language in selected language
- PDF rendered via PDF.js, converted to image for analysis

### 🚨 Emergency Contacts
- All national health helplines — 108 Ambulance, 112 Emergency, 104 Health
- Mental health, women's helpline, senior citizen, poison control, child helpline
- One-tap calling from mobile

### 🌐 23 Indian Languages
- All 22 constitutionally scheduled languages plus Bhojpuri
- Full UI translation — every button, label, heading in selected language
- AI responses in correct script for selected language
- Language persisted across sessions

### 🎤 Voice Input
- Web Speech API integration
- Auto-send after voice recognition completes
- Language-aware speech recognition
- Visual voice animation indicator

### 🔊 Text to Speech
- Web Speech API primary — instant, no server call
- gTTS fallback — server-side for unsupported browsers
- Stop button on every message

### 📱 Progressive Web App
- Installable on Android and iOS home screen
- Offline fallback page via Service Worker
- Works on 2G and 3G connections
- Install prompt with native browser install flow

### 🌙 Dark and Light Mode
- System preference aware
- Toggle in nav bar and drawer
- Persisted in localStorage

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JS, PWA Service Worker, PDF.js, Web Speech API, Geolocation API |
| **Backend** | Python 3.11, Flask 3.0, Gunicorn |
| **AI — Chat & Medicine** | Groq API · meta-llama/llama-3.3-70b-versatile |
| **AI — Prescription Vision** | Groq API · meta-llama/llama-4-scout-17b-16e-instruct |
| **Language Detection** | langdetect |
| **Text to Speech** | gTTS (Google Text-to-Speech) |
| **Hospital Data** | data.gov.in National Hospital Directory · hospitals.json (2,670 hospitals, 662KB) |
| **Map Fallback** | OpenStreetMap Overpass API (free, no key required) |
| **Maps Directions** | Google Maps deep links |
| **Deployment** | Render free tier + GitHub |

---

## 📁 Project Structure

```
AarogyaBot/
│
├── app.py                      # Flask backend — all API routes and logic
├── hospitals.json              # 2,670 govt hospitals generated from data.gov.in CSV
├── requirements.txt            # Python dependencies
│
├── static/
│   ├── css/
│   │   └── style.css           # Complete UI — dark/light theme, responsive, animations
│   ├── js/
│   │   └── main.js             # Nav, i18n (23 languages), TTS, drawer, PWA install
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   ├── icon-maskable-192.png
│   │   └── icon-maskable-512.png
│   ├── manifest.json           # PWA web app manifest
│   └── sw.js                   # Service worker for offline support
│
└── templates/
    ├── base.html               # Base layout — nav, drawer, bottom nav, modals
    ├── index.html              # Home page — hero, stats, feature cards
    ├── chat.html               # Symptom checker — AI chat with voice input
    ├── hospitals.html          # Hospital finder — state/district + GPS nearby
    ├── medicines.html          # Medicine info — AI-powered search
    ├── prescription.html       # Prescription reader — upload + AI vision
    ├── emergency.html          # Emergency contacts — all national helplines
    └── offline.html            # Offline fallback page
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Home page |
| GET | `/chat` | Symptom checker page |
| GET | `/hospitals` | Hospital finder page |
| GET | `/medicines` | Medicine info page |
| GET | `/prescription` | Prescription reader page |
| GET | `/emergency` | Emergency contacts page |
| POST | `/api/chat` | AI symptom guidance via Groq LLaMA |
| POST | `/api/prescription` | Vision-based prescription analysis |
| POST | `/api/medicine` | Medicine information in selected language |
| POST | `/api/districts` | Get districts for a given state |
| POST | `/api/hospitals` | Get hospitals by state and district |
| POST | `/api/hospitals/nearby` | Get hospitals near GPS coordinates |
| POST | `/api/tts` | Text to speech via gTTS |

### Sample — Symptom Chat

```json
POST /api/chat
{
  "message": "मुझे बुखार और सिरदर्द है",
  "lang": "hi",
  "history": []
}
```

### Sample — Hospital Nearby

```json
POST /api/hospitals/nearby
{
  "lat": 25.5941,
  "lon": 85.1376,
  "radius": 20
}
```

### Sample — Medicine Info

```json
POST /api/medicine
{
  "medicine": "Paracetamol",
  "lang": "hi"
}
```

---

## 🏥 Hospital Data Pipeline

1. **Download** — CSV from data.gov.in — National Hospital Directory with Geo Code — 30,273 total rows
2. **Filter** — Keep rows where `Hospital_Category = "Public/Government"` plus keyword match on hospital name (govt, civil, district, PHC, CHC, AIIMS, medical college, municipal...)
3. **Validate** — Parse lat/lon from `Location_Coordinates` column, check India bounding box (6.5–37.5°N, 68–97.5°E), discard invalid coordinates
4. **Generate** — `hospitals.json` with fields: name, state, district, address, phone, type, care_type, lat, lon — 2,670 hospitals, 662KB
5. **Load** — `app.py` loads at startup into `HOSPITALS_INDEX[state][district]` dictionary for O(1) lookup
6. **Query** — State/District search uses instant dict lookup · Nearby search uses Haversine distance loop · Zero results triggers Overpass API fallback

---

## 🌍 Language System

The entire UI translates instantly with no page reload and no server call. Language is persisted in localStorage across sessions. All 23 languages work offline after first load.

| Language | Script | Code |
|---|---|---|
| Hindi | Devanagari | hi |
| Bengali | Bengali | bn |
| Tamil | Tamil | ta |
| Telugu | Telugu | te |
| Marathi | Devanagari | mr |
| Gujarati | Gujarati | gu |
| Kannada | Kannada | kn |
| Malayalam | Malayalam | ml |
| Punjabi | Gurmukhi | pa |
| Odia | Odia | or |
| Assamese | Bengali | as |
| Urdu | Perso-Arabic | ur |
| Sanskrit | Devanagari | sa |
| Kashmiri | Perso-Arabic | ks |
| Sindhi | Perso-Arabic | sd |
| Nepali | Devanagari | ne |
| Konkani | Devanagari | kok |
| Dogri | Devanagari | doi |
| Manipuri | Bengali | mni |
| Santali | Ol Chiki | sat |
| Maithili | Devanagari | mai |
| Bhojpuri | Devanagari | bho |
| English | Latin | en |

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key for all AI features |
| `OPENWEATHER_KEY` | No | OpenWeatherMap key for weather health alerts |

Get your free Groq API key at [console.groq.com](https://console.groq.com) — no credit card needed.

---

## 🚀 Local Setup

```bash
# Clone the repository
git clone https://github.com/Anant-083/AarogyaBot.git
cd AarogyaBot

# Install dependencies
pip install -r requirements.txt

# Set environment variable
# Windows
set GROQ_API_KEY=your_groq_api_key_here

# Linux or Mac
export GROQ_API_KEY=your_groq_api_key_here

# Run
python app.py

# Open browser
# http://localhost:5000
```

---

## 🌐 Deploy on Render

```
1. Commit hospitals.json to your GitHub repository

2. Go to render.com → New → Web Service

3. Connect your GitHub repository

4. Configure:
   Build Command:  pip install -r requirements.txt
   Start Command:  gunicorn app:app
   Plan:           Free

5. Add environment variable:
   GROQ_API_KEY = your_key_here

6. Click Deploy
```

> Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes around 30 seconds.

---

## 📦 Requirements

```
flask
groq
langdetect
gTTS
requests
gunicorn
```

---

## 🔒 Privacy and Security

- No user data stored — conversations are not logged or saved anywhere
- No login required — completely anonymous usage
- No cookies — only localStorage for theme and language preference
- No tracking — no analytics, no ads, no third-party trackers
- API keys secured via environment variables, never in source code
- HTTPS enforced by Render deployment

---

## 🏗️ Architecture Decisions

**Why Groq instead of OpenAI?**
Groq's free tier provides LLaMA 3.3 70B inference in under 1 second. No credit card required for development. Perfect for a free public health app.

**Why JSON file instead of a database?**
Render free tier has no persistent database. A 662KB JSON loaded at startup into memory is faster than any DB query and requires zero infrastructure cost.

**Why OpenStreetMap instead of Google Maps API?**
Google Maps API requires billing. Overpass API is completely free, no key needed, and sufficient for hospital discovery as a fallback.

**Why no user authentication?**
Target users are rural patients who may be elderly or unfamiliar with technology. Any login barrier reduces adoption. Zero personal data means zero privacy risk.

**Why PWA instead of native app?**
No app store approval needed. Works on any Android or iOS device. Can be installed to home screen. Works on slow 2G connections. Zero install friction for rural users.

---

## 📊 Data Sources

| Data | Source | License |
|---|---|---|
| Government Hospital Directory | data.gov.in — National Hospital Directory with Geo Code | Government Open Data License India |
| Live Hospital Fallback | OpenStreetMap via Overpass API | Open Database License ODbL |
| AI Language Model | Groq — LLaMA 3.3 70B | Meta LLaMA Community License |
| AI Vision Model | Groq — LLaMA 4 Scout 17B | Meta LLaMA Community License |
| Text to Speech | Google gTTS | MIT |

---

## 🧪 Testing the APIs

```bash
# Symptom chat
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"I have fever and headache","lang":"en","history":[]}'

# Hospital search by district
curl -X POST http://localhost:5000/api/hospitals \
  -H "Content-Type: application/json" \
  -d '{"state":"Bihar","district":"Patna"}'

# Nearby hospitals by GPS
curl -X POST http://localhost:5000/api/hospitals/nearby \
  -H "Content-Type: application/json" \
  -d '{"lat":25.5941,"lon":85.1376,"radius":20}'

# Medicine information
curl -X POST http://localhost:5000/api/medicine \
  -H "Content-Type: application/json" \
  -d '{"medicine":"Paracetamol","lang":"hi"}'
```

---

## 🚧 Known Limitations

| Limitation | Reason | Workaround |
|---|---|---|
| Hospital coordinates may be inaccurate | data.gov.in dataset has some wrong lat/lon values | Maps uses name and address search for precision |
| Some hospitals missing from directory | Dataset compiled pre-2019, Ladakh not included | Overpass API fallback fills the gaps |
| Render cold start delay of ~30s | Free tier sleeps after inactivity | Use UptimeRobot to keep alive |
| Voice input requires Chrome | Web Speech API not supported everywhere | Text input always available |
| AI responses are not medical advice | LLM limitations | Clear disclaimer shown on every page |

---

## 🗺️ Roadmap

- [ ] Add Ladakh and missing districts to hospital data
- [ ] Integrate ABDM Ayushman Bharat Digital Mission hospital API
- [ ] Seasonal disease alerts based on location and weather
- [ ] ASHA worker simplified mode for community health workers
- [ ] WhatsApp Bot integration for feature phone users
- [ ] Offline AI for basic symptoms using on-device model

---

## 👤 Developer

**Anant Paul**
B.Tech Computer Science — Artificial Intelligence and Machine Learning
Brainware University, Kolkata — Semester 4
Roll No: BWU/BTA/24/083

📧 [14359shanant@gmail.com](mailto:14359shanant@gmail.com)
🐙 [github.com/Anant-083](https://github.com/Anant-083)
💼 [linkedin.com/in/anant-paul-5852a333b](https://linkedin.com/in/anant-paul-5852a333b)

---

## 📄 License

MIT License — free to use, modify and distribute with attribution.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — blazing fast LLaMA inference
- [Meta AI](https://ai.meta.com) — LLaMA 3.3 and LLaMA 4 models
- [data.gov.in](https://data.gov.in) — National Hospital Directory dataset
- [OpenStreetMap](https://openstreetmap.org) — free map data via Overpass API
- [PDF.js](https://mozilla.github.io/pdf.js/) — client-side PDF rendering
- [Render](https://render.com) — free hosting platform

---

*Built with ❤️ for rural India — because quality healthcare guidance should be available in your language, free, forever.*

⭐ If this project helped you, please star the repository!
