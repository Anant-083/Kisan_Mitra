/* ── NAV / DRAWER ── */
function toggleNav(){document.getElementById('drawer').classList.toggle('open')}
function closeNav(){document.getElementById('drawer').classList.remove('open')}
document.addEventListener('click',function(e){
  const d=document.getElementById('drawer');
  const h=document.querySelector('.nav-ham');
  if(d&&h&&!d.contains(e.target)&&!h.contains(e.target))d.classList.remove('open');
});

/* ── THEME (dark / light) ── */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('ab_theme', t);
  document.querySelectorAll('.theme-btn').forEach(b=>{
    b.innerHTML = t === 'dark'
      ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
      : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
  });
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}

/* ── GLOBAL LANGUAGE SYSTEM ── */
const TRANSLATIONS={
  en:{
    nav_home:'Home',nav_chat:'Symptom Check',nav_hospitals:'Hospitals',
    nav_medicines:'Medicines',nav_sos:'Emergency',
    hero_kicker:'Free · No Login · AI-Powered · 24/7',
    hero_h1:'Health guidance in <b>your language</b>',
    hero_sub:'Describe symptoms, find hospitals, check medicines — completely free, no registration.',
    btn_chat:'Check Symptoms',btn_hosp:'Find Hospital',btn_emg:'Emergency',
    stat1:'Languages',stat2:'States',stat3:'SOS Lines',stat4:'Available',
    sec_title:'Everything you need',
    fc1_title:'Symptom Checker',fc1_desc:'Speak or type symptoms — fever, cough, pain. Get instant AI guidance in your language.',fc1_cta:'Start chatting',
    fc2_title:'Find Hospital',fc2_desc:'Nearest government hospitals in your state and district. One tap to call.',fc2_cta:'Find now',
    fc3_title:'Medicine Info',fc3_desc:'Dosage, uses, side effects and affordable Indian alternatives for any medicine.',fc3_cta:'Search',
    fc4_title:'Emergency Contacts',fc4_desc:'All national helplines — ambulance, mental health, senior care. One tap to call.',fc4_cta:'View all',
    disclaimer:'AarogyaBot gives general health information only — not a substitute for medical diagnosis.',
    footer_copy:'AarogyaBot provides general health guidance only. Always consult a qualified doctor.',
    lbl_language:'Language',lbl_theme:'Theme',
  },
  hi:{
    nav_home:'होम',nav_chat:'लक्षण जांच',nav_hospitals:'अस्पताल',
    nav_medicines:'दवाइयां',nav_sos:'आपातकाल',
    hero_kicker:'मुफ्त · बिना लॉगिन · AI-संचालित · 24/7',
    hero_h1:'<b>आपकी भाषा</b> में स्वास्थ्य मार्गदर्शन',
    hero_sub:'लक्षण बताएं, अस्पताल खोजें, दवाइयां जानें — पूरी तरह मुफ्त।',
    btn_chat:'लक्षण जांचें',btn_hosp:'अस्पताल खोजें',btn_emg:'आपातकाल',
    stat1:'भाषाएं',stat2:'राज्य',stat3:'SOS लाइनें',stat4:'उपलब्ध',
    sec_title:'सभी सेवाएं',
    fc1_title:'लक्षण जांचक',fc1_desc:'बोलकर या टाइप करके लक्षण बताएं — बुखार, खांसी, दर्द। तुरंत AI मार्गदर्शन पाएं।',fc1_cta:'बात शुरू करें',
    fc2_title:'अस्पताल खोजें',fc2_desc:'अपने राज्य और जिले में सरकारी अस्पताल। एक टैप में कॉल करें।',fc2_cta:'अभी खोजें',
    fc3_title:'दवाई जानकारी',fc3_desc:'किसी भी दवाई का उपयोग, खुराक, साइड इफेक्ट और सस्ते विकल्प।',fc3_cta:'खोजें',
    fc4_title:'आपातकालीन नंबर',fc4_desc:'सभी राष्ट्रीय हेल्पलाइन — एम्बुलेंस, मानसिक स्वास्थ्य। एक टैप में कॉल करें।',fc4_cta:'सभी देखें',
    disclaimer:'AarogyaBot केवल सामान्य स्वास्थ्य जानकारी देता है — यह चिकित्सा निदान नहीं है।',
    footer_copy:'AarogyaBot केवल सामान्य स्वास्थ्य जानकारी देता है। हमेशा डॉक्टर से मिलें।',
    lbl_language:'भाषा',lbl_theme:'थीम',
  },
  bn:{
    nav_home:'হোম',nav_chat:'লক্ষণ পরীক্ষা',nav_hospitals:'হাসপাতাল',
    nav_medicines:'ওষুধ',nav_sos:'জরুরি',
    hero_kicker:'বিনামূল্যে · লগইন ছাড়া · AI-চালিত · ২৪/৭',
    hero_h1:'<b>আপনার ভাষায়</b> স্বাস্থ্য পরামর্শ',
    hero_sub:'লক্ষণ বলুন, হাসপাতাল খুঁজুন, ওষুধ জানুন — সম্পূর্ণ বিনামূল্যে।',
    btn_chat:'লক্ষণ পরীক্ষা',btn_hosp:'হাসপাতাল খুঁজুন',btn_emg:'জরুরি',
    stat1:'ভাষা',stat2:'রাজ্য',stat3:'SOS লাইন',stat4:'সক্রিয়',
    sec_title:'সব সেবা',
    fc1_title:'লক্ষণ পরীক্ষক',fc1_desc:'বলুন বা টাইপ করুন — জ্বর, কাশি, ব্যথা। তাৎক্ষণিক AI পরামর্শ পান।',fc1_cta:'চ্যাট শুরু করুন',
    fc2_title:'হাসপাতাল খুঁজুন',fc2_desc:'আপনার জেলায় সরকারি হাসপাতাল। এক ট্যাপে কল করুন।',fc2_cta:'এখনই খুঁজুন',
    fc3_title:'ওষুধ তথ্য',fc3_desc:'যেকোনো ওষুধের ব্যবহার, ডোজ, পার্শ্বপ্রতিক্রিয়া ও সস্তা বিকল্প।',fc3_cta:'খুঁজুন',
    fc4_title:'জরুরি যোগাযোগ',fc4_desc:'সব জাতীয় হেল্পলাইন — অ্যাম্বুলেন্স, মানসিক স্বাস্থ্য। এক ট্যাপে কল।',fc4_cta:'সব দেখুন',
    disclaimer:'AarogyaBot শুধু সাধারণ স্বাস্থ্য তথ্য দেয় — এটি চিকিৎসা নির্ণয় নয়।',
    footer_copy:'AarogyaBot শুধু সাধারণ স্বাস্থ্য তথ্য দেয়। সর্বদা ডাক্তারের পরামর্শ নিন।',
    lbl_language:'ভাষা',lbl_theme:'থিম',
  },
  ta:{
    nav_home:'முகப்பு',nav_chat:'அறிகுறி பரிசோதனை',nav_hospitals:'மருத்துவமனைகள்',
    nav_medicines:'மருந்துகள்',nav_sos:'அவசரநிலை',
    hero_kicker:'இலவசம் · உள்நுழைவு தேவையில்லை · AI · 24/7',
    hero_h1:'<b>உங்கள் மொழியில்</b> சுகாதார வழிகாட்டுதல்',
    hero_sub:'அறிகுறிகளைச் சொல்லுங்கள், மருத்துவமனைகளைக் கண்டறியுங்கள், மருந்துகளைச் சரிபார்க்கவும் — முற்றிலும் இலவசம்.',
    btn_chat:'அறிகுறிகளை சரிபார்க்க',btn_hosp:'மருத்துவமனை தேடு',btn_emg:'அவசரநிலை',
    stat1:'மொழிகள்',stat2:'மாநிலங்கள்',stat3:'SOS லைன்கள்',stat4:'கிடைக்கும்',
    sec_title:'உங்களுக்கு தேவையான அனைத்தும்',
    fc1_title:'அறிகுறி பரிசோதகர்',fc1_desc:'பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள் — காய்ச்சல், இருமல், வலி. உடனடி AI வழிகாட்டுதல்.',fc1_cta:'அரட்டை தொடங்கு',
    fc2_title:'மருத்துவமனை தேடு',fc2_desc:'உங்கள் மாவட்டத்தில் அரசு மருத்துவமனைகள். ஒரே தட்டில் அழைக்கவும்.',fc2_cta:'இப்போது தேடு',
    fc3_title:'மருந்து தகவல்',fc3_desc:'எந்த மருந்துக்கும் பயன்பாடு, அளவு, பக்க விளைவுகள் மற்றும் மாற்றுகள்.',fc3_cta:'தேடு',
    fc4_title:'அவசர தொடர்புகள்',fc4_desc:'அனைத்து தேசிய உதவி எண்கள் — ஆம்புலன்ஸ், மனநல உதவி. ஒரே தட்டில் அழைக்கவும்.',fc4_cta:'அனைத்தையும் பார்',
    disclaimer:'AarogyaBot பொது சுகாதார தகவலை மட்டுமே வழங்குகிறது — இது மருத்துவ நோயறிதல் அல்ல.',
    footer_copy:'AarogyaBot பொது சுகாதார வழிகாட்டுதலை மட்டுமே வழங்குகிறது. எப்போதும் மருத்துவரை அணுகவும்.',
    lbl_language:'மொழி',lbl_theme:'தீம்',
  },
  te:{
    nav_home:'హోమ్',nav_chat:'లక్షణ తనిఖీ',nav_hospitals:'ఆసుపత్రులు',
    nav_medicines:'మందులు',nav_sos:'అత్యవసరం',
    hero_kicker:'ఉచితం · లాగిన్ అవసరం లేదు · AI · 24/7',
    hero_h1:'<b>మీ భాషలో</b> ఆరోగ్య మార్గదర్శనం',
    hero_sub:'లక్షణాలను చెప్పండి, ఆసుపత్రులను కనుగొనండి, మందులను తనిఖీ చేయండి — పూర్తిగా ఉచితం.',
    btn_chat:'లక్షణాలను తనిఖీ చేయండి',btn_hosp:'ఆసుపత్రి కనుగొనండి',btn_emg:'అత్యవసరం',
    stat1:'భాషలు',stat2:'రాష్ట్రాలు',stat3:'SOS లైన్లు',stat4:'అందుబాటులో',
    sec_title:'మీకు కావలసినవన్నీ',
    fc1_title:'లక్షణ తనిఖీదారు',fc1_desc:'మాట్లాడండి లేదా టైప్ చేయండి — జ్వరం, దగ్గు, నొప్పి. తక్షణ AI మార్గదర్శనం పొందండి.',fc1_cta:'చాట్ ప్రారంభించండి',
    fc2_title:'ఆసుపత్రి కనుగొనండి',fc2_desc:'మీ జిల్లాలో ప్రభుత్వ ఆసుపత్రులు. ఒక్క నొక్కుతో కాల్ చేయండి.',fc2_cta:'ఇప్పుడే వెతకండి',
    fc3_title:'మందుల సమాచారం',fc3_desc:'ఏ మందుకైనా ఉపయోగాలు, మోతాదు, దుష్ప్రభావాలు మరియు చౌక ప్రత్యామ్నాయాలు.',fc3_cta:'వెతకండి',
    fc4_title:'అత్యవసర పరిచయాలు',fc4_desc:'అన్ని జాతీయ హెల్ప్‌లైన్‌లు — అంబులెన్స్, మానసిక ఆరోగ్యం. ఒక్క నొక్కుతో కాల్ చేయండి.',fc4_cta:'అన్నీ చూడండి',
    disclaimer:'AarogyaBot సాధారణ ఆరోగ్య సమాచారాన్ని మాత్రమే ఇస్తుంది — ఇది వైద్య నిర్ధారణ కాదు.',
    footer_copy:'AarogyaBot సాధారణ ఆరోగ్య మార్గదర్శకత్వాన్ని మాత్రమే అందిస్తుంది. ఎల్లప్పుడూ వైద్యుడిని సంప్రదించండి.',
    lbl_language:'భాష',lbl_theme:'థీమ్',
  },
  mr:{
    nav_home:'मुख्यपृष्ठ',nav_chat:'लक्षण तपासणी',nav_hospitals:'रुग्णालये',
    nav_medicines:'औषधे',nav_sos:'आणीबाणी',
    hero_kicker:'मोफत · लॉगिन नाही · AI · 24/7',
    hero_h1:'<b>तुमच्या भाषेत</b> आरोग्य मार्गदर्शन',
    hero_sub:'लक्षणे सांगा, रुग्णालये शोधा, औषधे तपासा — पूर्णपणे मोफत.',
    btn_chat:'लक्षणे तपासा',btn_hosp:'रुग्णालय शोधा',btn_emg:'आणीबाणी',
    stat1:'भाषा',stat2:'राज्ये',stat3:'SOS लाईन्स',stat4:'उपलब्ध',
    sec_title:'तुम्हाला हवे ते सर्व',
    fc1_title:'लक्षण तपासक',fc1_desc:'बोला किंवा टाइप करा — ताप, खोकला, वेदना. त्वरित AI मार्गदर्शन मिळवा.',fc1_cta:'चॅट सुरू करा',
    fc2_title:'रुग्णालय शोधा',fc2_desc:'तुमच्या जिल्ह्यातील सरकारी रुग्णालये. एका टॅपमध्ये कॉल करा.',fc2_cta:'आता शोधा',
    fc3_title:'औषध माहिती',fc3_desc:'कोणत्याही औषधाचा वापर, मात्रा, दुष्परिणाम आणि स्वस्त पर्याय.',fc3_cta:'शोधा',
    fc4_title:'आणीबाणी संपर्क',fc4_desc:'सर्व राष्ट्रीय हेल्पलाईन्स — रुग्णवाहिका, मानसिक आरोग्य. एका टॅपमध्ये कॉल करा.',fc4_cta:'सर्व पहा',
    disclaimer:'AarogyaBot फक्त सामान्य आरोग्य माहिती देते — हे वैद्यकीय निदान नाही.',
    footer_copy:'AarogyaBot फक्त सामान्य आरोग्य मार्गदर्शन देते. नेहमी डॉक्टरांचा सल्ला घ्या.',
    lbl_language:'भाषा',lbl_theme:'थीम',
  },
};
const LANG_LIST=[
  {code:'en',label:'🇬🇧 English'},{code:'hi',label:'🇮🇳 हिंदी'},{code:'bn',label:'🇧🇩 বাংলা'},
  {code:'ta',label:'🇮🇳 தமிழ்'},{code:'te',label:'🇮🇳 తెలుగు'},{code:'mr',label:'🇮🇳 मराठी'},
];

let currentLang = localStorage.getItem('ab_lang') || 'en';

function applyLang(lang){
  currentLang = lang;
  localStorage.setItem('ab_lang', lang);
  const T = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const FALLBACK = TRANSLATIONS.en;
  document.querySelectorAll('[data-t]').forEach(el=>{
    const key = el.getAttribute('data-t');
    const val = T[key] !== undefined ? T[key] : FALLBACK[key];
    if(val !== undefined) el.innerHTML = val;
  });
  document.querySelectorAll('[data-tp]').forEach(el=>{
    const key = el.getAttribute('data-tp');
    const val = T[key] !== undefined ? T[key] : FALLBACK[key];
    if(val !== undefined) el.placeholder = val;
  });
  document.querySelectorAll('.lang-select').forEach(s=>{ s.value = lang; });
}
function onLangChange(val){ applyLang(val); }

function populateLangSelectors(){
  document.querySelectorAll('.lang-select').forEach(sel=>{
    sel.innerHTML = LANG_LIST.map(l=>`<option value="${l.code}">${l.label}</option>`).join('');
  });
}

window.addEventListener('DOMContentLoaded', ()=>{
  applyTheme(localStorage.getItem('ab_theme') || 'dark');
  populateLangSelectors();
  applyLang(currentLang);
});
