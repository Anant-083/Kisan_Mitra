/* ── NAV / DRAWER ── */
function toggleNav(){document.getElementById('drawer').classList.toggle('open')}
function closeNav(){document.getElementById('drawer').classList.remove('open')}
document.addEventListener('click',function(e){
  const d=document.getElementById('drawer');
  const h=document.querySelector('.nav-ham');
  if(d&&h&&!d.contains(e.target)&&!h.contains(e.target))d.classList.remove('open');
});

/* ── THEME ── */
const ICON_MOON='<svg class="icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
const ICON_SUN='<svg class="icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('ab_theme', t);
  document.querySelectorAll('.theme-btn').forEach(b=>{ b.innerHTML = t === 'dark' ? ICON_SUN : ICON_MOON; });
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}

/* ── MARKDOWN RENDERER (for AI replies) ── */
function mdToHtml(text){
  if(!text) return '';
  let html = text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^### (.*$)/gim, '<h4 class="md-h">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="md-h">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 class="md-h">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  const lines = html.split('\n');
  let out = [];
  let inList = false;
  for(let line of lines){
    const m = line.match(/^[-•]\s+(.*)/);
    if(m){
      if(!inList){ out.push('<ul class="md-list">'); inList = true; }
      out.push(`<li>${m[1]}</li>`);
    } else {
      if(inList){ out.push('</ul>'); inList = false; }
      if(line.trim() !== '') out.push(`<p class="md-p">${line}</p>`);
    }
  }
  if(inList) out.push('</ul>');
  return out.join('');
}

/* ── LANGUAGE SYSTEM ── */
/* 6 languages with full real UI translations. Trimmed from 12 because the other
   6 had no actual translated strings and were silently falling back to English. */
const TRANSLATIONS={
  en:{nav_home:'Home',nav_chat:'Symptom Check',nav_hospitals:'Hospitals',nav_medicines:'Medicines',nav_sos:'Emergency',
    hero_kicker:'Free · No Login · AI-Powered · 24/7',hero_h1:'Health guidance in <b>your language</b>',
    hero_sub:'Describe symptoms, find hospitals, check medicines — completely free, no registration.',
    btn_chat:'Check Symptoms',btn_hosp:'Find Hospital',btn_emg:'Emergency',
    stat1:'Languages',stat2:'States',stat3:'SOS Lines',stat4:'Available',sec_title:'Everything you need',
    fc1_title:'Symptom Checker',fc1_desc:'Speak or type symptoms — fever, cough, pain. Get instant AI guidance in your language.',fc1_cta:'Start chatting',
    fc2_title:'Find Hospital',fc2_desc:'Nearest government hospitals in your state and district. One tap to call.',fc2_cta:'Find now',
    fc3_title:'Medicine Info',fc3_desc:'Dosage, uses, side effects and affordable Indian alternatives for any medicine.',fc3_cta:'Search',
    fc4_title:'Emergency Contacts',fc4_desc:'All national helplines — ambulance, mental health, senior care. One tap to call.',fc4_cta:'View all',
    disclaimer:'AarogyaBot gives general health information only — not a substitute for medical diagnosis.',
    footer_copy:'AarogyaBot provides general health guidance only. Always consult a qualified doctor.',
    lbl_language:'Language',lbl_theme:'Theme',
    pg_chat_title:'Symptom Checker',pg_chat_sub:'Voice or text · Auto language detection · AI-powered',
    pg_hosp_title:'Find Government Hospital',pg_hosp_sub:'Select your state and district to find nearby hospitals',
    pg_med_title:'Medicine Information',pg_med_sub:'Dosage, uses, side effects and affordable alternatives',
    pg_emg_title:'Emergency Contacts',pg_emg_sub:'Free helplines, available 24/7 — tap to call',
    install_title:'Install AarogyaBot',
    install_ios:'1. Tap the Share icon in Safari<br>2. Scroll down and tap "Add to Home Screen"<br>3. Tap "Add"',
    install_android:'1. Tap the menu (⋮) in your browser<br>2. Tap "Install app" or "Add to Home screen"<br>3. Confirm',
    install_close:'Got it',
  },
  hi:{nav_home:'होम',nav_chat:'लक्षण जांच',nav_hospitals:'अस्पताल',nav_medicines:'दवाइयां',nav_sos:'आपातकाल',
    hero_kicker:'मुफ्त · बिना लॉगिन · AI-संचालित · 24/7',hero_h1:'<b>आपकी भाषा</b> में स्वास्थ्य मार्गदर्शन',
    hero_sub:'लक्षण बताएं, अस्पताल खोजें, दवाइयां जानें — पूरी तरह मुफ्त।',
    btn_chat:'लक्षण जांचें',btn_hosp:'अस्पताल खोजें',btn_emg:'आपातकाल',
    stat1:'भाषाएं',stat2:'राज्य',stat3:'SOS लाइनें',stat4:'उपलब्ध',sec_title:'सभी सेवाएं',
    fc1_title:'लक्षण जांचक',fc1_desc:'बोलकर या टाइप करके लक्षण बताएं — बुखार, खांसी, दर्द।',fc1_cta:'बात शुरू करें',
    fc2_title:'अस्पताल खोजें',fc2_desc:'अपने राज्य और जिले में सरकारी अस्पताल।',fc2_cta:'अभी खोजें',
    fc3_title:'दवाई जानकारी',fc3_desc:'किसी भी दवाई का उपयोग, खुराक, साइड इफेक्ट।',fc3_cta:'खोजें',
    fc4_title:'आपातकालीन नंबर',fc4_desc:'सभी राष्ट्रीय हेल्पलाइन — एम्बुलेंस, मानसिक स्वास्थ्य।',fc4_cta:'सभी देखें',
    disclaimer:'AarogyaBot केवल सामान्य स्वास्थ्य जानकारी देता है।',
    footer_copy:'AarogyaBot केवल सामान्य स्वास्थ्य जानकारी देता है। हमेशा डॉक्टर से मिलें।',
    lbl_language:'भाषा',lbl_theme:'थीम',
    pg_chat_title:'लक्षण जांचक',pg_chat_sub:'आवाज़ या टेक्स्ट · AI संचालित',
    pg_hosp_title:'सरकारी अस्पताल खोजें',pg_hosp_sub:'राज्य और जिला चुनें',
    pg_med_title:'दवाई जानकारी',pg_med_sub:'खुराक, उपयोग, साइड इफेक्ट',
    pg_emg_title:'आपातकालीन संपर्क',pg_emg_sub:'मुफ्त हेल्पलाइन, 24/7',
    install_title:'AarogyaBot इंस्टॉल करें',
    install_ios:'1. Safari में Share आइकन टैप करें<br>2. नीचे स्क्रॉल करें और "Add to Home Screen" टैप करें<br>3. "Add" टैप करें',
    install_android:'1. ब्राउज़र मेन्यू (⋮) टैप करें<br>2. "Install app" टैप करें<br>3. पुष्टि करें',
    install_close:'समझ गया',
  },
  bn:{nav_home:'হোম',nav_chat:'লক্ষণ পরীক্ষা',nav_hospitals:'হাসপাতাল',nav_medicines:'ওষুধ',nav_sos:'জরুরি',
    hero_kicker:'বিনামূল্যে · লগইন ছাড়া · AI-চালিত · 24/7',hero_h1:'<b>আপনার ভাষায়</b> স্বাস্থ্য নির্দেশনা',
    hero_sub:'লক্ষণ বলুন, হাসপাতাল খুঁজুন, ওষুধ জানুন — সম্পূর্ণ বিনামূল্যে।',
    btn_chat:'লক্ষণ পরীক্ষা করুন',btn_hosp:'হাসপাতাল খুঁজুন',btn_emg:'জরুরি',
    stat1:'ভাষা',stat2:'রাজ্য',stat3:'SOS লাইন',stat4:'উপলব্ধ',sec_title:'সব পরিষেবা',
    fc1_title:'লক্ষণ পরীক্ষক',fc1_desc:'বলে বা টাইপ করে লক্ষণ জানান — জ্বর, কাশি, ব্যথা।',fc1_cta:'চ্যাট শুরু করুন',
    fc2_title:'হাসপাতাল খুঁজুন',fc2_desc:'আপনার রাজ্য ও জেলায় সরকারি হাসপাতাল।',fc2_cta:'এখনই খুঁজুন',
    fc3_title:'ওষুধের তথ্য',fc3_desc:'যেকোনো ওষুধের ব্যবহার, মাত্রা, পার্শ্বপ্রতিক্রিয়া।',fc3_cta:'খুঁজুন',
    fc4_title:'জরুরি যোগাযোগ',fc4_desc:'সব জাতীয় হেল্পলাইন — অ্যাম্বুলেন্স, মানসিক স্বাস্থ্য।',fc4_cta:'সব দেখুন',
    disclaimer:'AarogyaBot শুধু সাধারণ স্বাস্থ্য তথ্য দেয়।',
    footer_copy:'AarogyaBot শুধু সাধারণ স্বাস্থ্য তথ্য দেয়। সবসময় ডাক্তারের পরামর্শ নিন।',
    lbl_language:'ভাষা',lbl_theme:'থিম',
    pg_chat_title:'লক্ষণ পরীক্ষক',pg_chat_sub:'ভয়েস বা টেক্সট · AI চালিত',
    pg_hosp_title:'সরকারি হাসপাতাল খুঁজুন',pg_hosp_sub:'রাজ্য ও জেলা নির্বাচন করুন',
    pg_med_title:'ওষুধের তথ্য',pg_med_sub:'মাত্রা, ব্যবহার, পার্শ্বপ্রতিক্রিয়া',
    pg_emg_title:'জরুরি যোগাযোগ',pg_emg_sub:'বিনামূল্যে হেল্পলাইন, 24/7',
    install_title:'AarogyaBot ইনস্টল করুন',
    install_ios:'1. Safari তে Share আইকনে ট্যাপ করুন<br>2. নিচে স্ক্রল করে "Add to Home Screen" ট্যাপ করুন<br>3. "Add" ট্যাপ করুন',
    install_android:'1. ব্রাউজার মেনু (⋮) ট্যাপ করুন<br>2. "Install app" ট্যাপ করুন<br>3. নিশ্চিত করুন',
    install_close:'বুঝেছি',
  },
  ta:{nav_home:'முகப்பு',nav_chat:'அறிகுறி சோதனை',nav_hospitals:'மருத்துவமனைகள்',nav_medicines:'மருந்துகள்',nav_sos:'அவசரம்',
    hero_kicker:'இலவசம் · உள்நுழைவு இல்லை · AI-இயங்கும் · 24/7',hero_h1:'<b>உங்கள் மொழியில்</b> சுகாதார வழிகாட்டுதல்',
    hero_sub:'அறிகுறிகளை சொல்லுங்கள், மருத்துவமனைகளை கண்டறியுங்கள் — முற்றிலும் இலவசம்.',
    btn_chat:'அறிகுறிகளை சரிபார்க்கவும்',btn_hosp:'மருத்துவமனை கண்டுபிடி',btn_emg:'அவசரம்',
    stat1:'மொழிகள்',stat2:'மாநிலங்கள்',stat3:'SOS லைன்கள்',stat4:'கிடைக்கிறது',sec_title:'அனைத்து சேவைகள்',
    fc1_title:'அறிகுறி சோதனையாளர்',fc1_desc:'பேசி அல்லது தட்டச்சு செய்து அறிகுறிகளை சொல்லுங்கள்.',fc1_cta:'அரட்டை தொடங்கு',
    fc2_title:'மருத்துவமனை கண்டுபிடி',fc2_desc:'உங்கள் மாநிலம் மற்றும் மாவட்டத்தில் அரசு மருத்துவமனைகள்.',fc2_cta:'இப்போது தேடு',
    fc3_title:'மருந்து தகவல்',fc3_desc:'எந்த மருந்தின் பயன்பாடு, அளவு, பக்க விளைவுகள்.',fc3_cta:'தேடு',
    fc4_title:'அவசர தொடர்புகள்',fc4_desc:'அனைத்து தேசிய உதவி எண்கள் — ஆம்புலன்ஸ், மனநல சேவை.',fc4_cta:'அனைத்தையும் காண',
    disclaimer:'AarogyaBot பொது சுகாதார தகவலை மட்டுமே வழங்குகிறது.',
    footer_copy:'AarogyaBot பொது சுகாதார தகவலை மட்டுமே வழங்குகிறது. எப்போதும் மருத்துவரை அணுகவும்.',
    lbl_language:'மொழி',lbl_theme:'தீம்',
    pg_chat_title:'அறிகுறி சோதனையாளர்',pg_chat_sub:'குரல் அல்லது உரை · AI இயங்கும்',
    pg_hosp_title:'அரசு மருத்துவமனை கண்டுபிடி',pg_hosp_sub:'மாநிலம் மற்றும் மாவட்டத்தை தேர்ந்தெடுக்கவும்',
    pg_med_title:'மருந்து தகவல்',pg_med_sub:'அளவு, பயன்பாடு, பக்க விளைவுகள்',
    pg_emg_title:'அவசர தொடர்புகள்',pg_emg_sub:'இலவச உதவி எண்கள், 24/7',
    install_title:'AarogyaBot ஐ நிறுவவும்',
    install_ios:'1. Safari இல் Share ஐகானை தட்டவும்<br>2. கீழே சென்று "Add to Home Screen" தட்டவும்<br>3. "Add" தட்டவும்',
    install_android:'1. உலாவி மெனுவை (⋮) தட்டவும்<br>2. "Install app" தட்டவும்<br>3. உறுதிப்படுத்தவும்',
    install_close:'புரிந்தது',
  },
  te:{nav_home:'హోమ్',nav_chat:'లక్షణ తనిఖీ',nav_hospitals:'ఆసుపత్రులు',nav_medicines:'మందులు',nav_sos:'అత్యవసరం',
    hero_kicker:'ఉచితం · లాగిన్ లేదు · AI-ఆధారిత · 24/7',hero_h1:'<b>మీ భాషలో</b> ఆరోగ్య మార్గదర్శకత్వం',
    hero_sub:'లక్షణాలు చెప్పండి, ఆసుపత్రులు కనుగొనండి — పూర్తిగా ఉచితం.',
    btn_chat:'లక్షణాలు తనిఖీ చేయండి',btn_hosp:'ఆసుపత్రి కనుగొనండి',btn_emg:'అత్యవసరం',
    stat1:'భాషలు',stat2:'రాష్ట్రాలు',stat3:'SOS లైన్లు',stat4:'అందుబాటులో',sec_title:'మీకు కావలసినవన్నీ',
    fc1_title:'లక్షణ తనిఖీదారు',fc1_desc:'మాట్లాడి లేదా టైప్ చేసి లక్షణాలు చెప్పండి.',fc1_cta:'చాట్ ప్రారంభించండి',
    fc2_title:'ఆసుపత్రి కనుగొనండి',fc2_desc:'మీ రాష్ట్రం మరియు జిల్లాలో ప్రభుత్వ ఆసుపత్రులు.',fc2_cta:'ఇప్పుడు వెతకండి',
    fc3_title:'మందు సమాచారం',fc3_desc:'ఏ మందు అయినా వాడకం, మోతాదు, దుష్ప్రభావాలు.',fc3_cta:'వెతకండి',
    fc4_title:'అత్యవసర పరిచయాలు',fc4_desc:'అన్ని జాతీయ హెల్ప్‌లైన్లు — అంబులెన్స్, మానసిక ఆరోగ్యం.',fc4_cta:'అన్నీ చూడండి',
    disclaimer:'AarogyaBot సాధారణ ఆరోగ్య సమాచారం మాత్రమే ఇస్తుంది.',
    footer_copy:'AarogyaBot సాధారణ ఆరోగ్య సమాచారం మాత్రమే ఇస్తుంది. ఎల్లప్పుడూ వైద్యుడిని సంప్రదించండి.',
    lbl_language:'భాష',lbl_theme:'థీమ్',
    pg_chat_title:'లక్షణ తనిఖీదారు',pg_chat_sub:'వాయిస్ లేదా టెక్స్ట్ · AI ఆధారిత',
    pg_hosp_title:'ప్రభుత్వ ఆసుపత్రి కనుగొనండి',pg_hosp_sub:'రాష్ట్రం మరియు జిల్లాను ఎంచుకోండి',
    pg_med_title:'మందు సమాచారం',pg_med_sub:'మోతాదు, వాడకం, దుష్ప్రభావాలు',
    pg_emg_title:'అత్యవసర పరిచయాలు',pg_emg_sub:'ఉచిత హెల్ప్‌లైన్లు, 24/7',
    install_title:'AarogyaBot ఇన్‌స్టాల్ చేయండి',
    install_ios:'1. Safari లో Share చిహ్నాన్ని నొక్కండి<br>2. క్రిందికి స్క్రోల్ చేసి "Add to Home Screen" నొక్కండి<br>3. "Add" నొక్కండి',
    install_android:'1. బ్రౌజర్ మెనూ (⋮) నొక్కండి<br>2. "Install app" నొక్కండి<br>3. నిర్ధారించండి',
    install_close:'అర్థమైంది',
  },
  mr:{nav_home:'मुख्यपृष्ठ',nav_chat:'लक्षण तपासणी',nav_hospitals:'रुग्णालये',nav_medicines:'औषधे',nav_sos:'आणीबाणी',
    hero_kicker:'मोफत · लॉगिन नाही · AI-चालित · 24/7',hero_h1:'<b>तुमच्या भाषेत</b> आरोग्य मार्गदर्शन',
    hero_sub:'लक्षणे सांगा, रुग्णालये शोधा, औषधे जाणून घ्या — पूर्णपणे मोफत.',
    btn_chat:'लक्षणे तपासा',btn_hosp:'रुग्णालय शोधा',btn_emg:'आणीबाणी',
    stat1:'भाषा',stat2:'राज्ये',stat3:'SOS लाईन्स',stat4:'उपलब्ध',sec_title:'सर्व सेवा',
    fc1_title:'लक्षण तपासक',fc1_desc:'बोलून किंवा टाइप करून लक्षणे सांगा.',fc1_cta:'चॅट सुरू करा',
    fc2_title:'रुग्णालय शोधा',fc2_desc:'तुमच्या राज्य आणि जिल्ह्यातील सरकारी रुग्णालये.',fc2_cta:'आता शोधा',
    fc3_title:'औषध माहिती',fc3_desc:'कोणत्याही औषधाचा वापर, मात्रा, दुष्परिणाम.',fc3_cta:'शोधा',
    fc4_title:'आणीबाणी संपर्क',fc4_desc:'सर्व राष्ट्रीय हेल्पलाईन — रुग्णवाहिका, मानसिक आरोग्य.',fc4_cta:'सर्व पहा',
    disclaimer:'AarogyaBot फक्त सामान्य आरोग्य माहिती देते.',
    footer_copy:'AarogyaBot फक्त सामान्य आरोग्य माहिती देते. नेहमी डॉक्टरांचा सल्ला घ्या.',
    lbl_language:'भाषा',lbl_theme:'थीम',
    pg_chat_title:'लक्षण तपासक',pg_chat_sub:'आवाज किंवा मजकूर · AI चालित',
    pg_hosp_title:'सरकारी रुग्णालय शोधा',pg_hosp_sub:'राज्य आणि जिल्हा निवडा',
    pg_med_title:'औषध माहिती',pg_med_sub:'मात्रा, वापर, दुष्परिणाम',
    pg_emg_title:'आणीबाणी संपर्क',pg_emg_sub:'मोफत हेल्पलाईन, 24/7',
    install_title:'AarogyaBot इंस्टॉल करा',
    install_ios:'1. Safari मध्ये Share आयकॉनवर टॅप करा<br>2. खाली स्क्रोल करून "Add to Home Screen" टॅप करा<br>3. "Add" टॅप करा',
    install_android:'1. ब्राउझर मेनू (⋮) टॅप करा<br>2. "Install app" टॅप करा<br>3. पुष्टी करा',
    install_close:'समजले',
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

/* ── SCROLL-IN ANIMATIONS ── */
function setupScrollAnim(){
  const els = document.querySelectorAll('.fc, .hcard, .tb, .ec');
  if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('anim-up')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('anim-up'); io.unobserve(en.target); } });
  },{threshold:.1});
  els.forEach(e=>io.observe(e));
}

/* ── TTS WITH STOP CONTROL ── */
let currentUtterance = null;
let currentAudio = null;

function speak(textOrEnc, l, isEnc, btnEl){
  stopSpeak();
  const text = isEnc ? decodeURIComponent(textOrEnc) : textOrEnc;

  if('speechSynthesis' in window){
    currentUtterance = new SpeechSynthesisUtterance(text.slice(0,300));
    currentUtterance.lang = {hi:'hi-IN',bn:'bn-IN',ta:'ta-IN',te:'te-IN',mr:'mr-IN',en:'en-US'}[l] || 'en-US';
    currentUtterance.rate = .88;
    currentUtterance.onend = () => setSpeakingState(false, btnEl);
    currentUtterance.onerror = () => setSpeakingState(false, btnEl);
    window.speechSynthesis.speak(currentUtterance);
    setSpeakingState(true, btnEl);
    return;
  }
  fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.slice(0,400),lang:l})})
    .then(r=>r.blob())
    .then(b=>{
      currentAudio = new Audio(URL.createObjectURL(b));
      currentAudio.onended = () => setSpeakingState(false, btnEl);
      currentAudio.play();
      setSpeakingState(true, btnEl);
    }).catch(()=>{});
}

function setSpeakingState(isSpeaking, btnEl){
  document.querySelectorAll('.tts-b').forEach(b=>b.classList.remove('speaking'));
  if(btnEl) btnEl.classList.toggle('speaking', isSpeaking);
  document.querySelectorAll('.tts-stop-b, #globalTtsStop').forEach(b=>b.classList.toggle('show', isSpeaking));
}

function stopSpeak(){
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  if(currentAudio){ currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
  currentUtterance = null;
  setSpeakingState(false, null);
}

/* ── PWA INSTALL ── */
let deferredPrompt;

window.addEventListener('beforeinstallprompt',(e)=>{
  e.preventDefault();
  deferredPrompt = e;
  showInstallToast();
});

function installApp(){
  dismissInstallToast();
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(()=>{ deferredPrompt = null; });
    return;
  }
  showInstallModal();
}

function showInstallModal(){
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const modal = document.getElementById('installModalBg');
  if(!modal) return;
  document.getElementById('installInstructions').innerHTML =
    isIOS ? (TRANSLATIONS[currentLang]?.install_ios || TRANSLATIONS.en.install_ios)
          : (TRANSLATIONS[currentLang]?.install_android || TRANSLATIONS.en.install_android);
  modal.classList.add('show');
}
function closeInstallModal(){
  document.getElementById('installModalBg').classList.remove('show');
}

function showInstallToast(){
  if(sessionStorage.getItem('ab_install_dismissed')) return;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if(isStandalone) return;
  document.getElementById('installToast')?.classList.add('show');
}
function dismissInstallToast(){
  document.getElementById('installToast')?.classList.remove('show');
  sessionStorage.setItem('ab_install_dismissed','1');
}

window.addEventListener('appinstalled',()=>{
  dismissInstallToast();
});

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{ navigator.serviceWorker.register('/sw.js').catch(()=>{}); });
}

/* ── FLOATING CHAT POPUP ── */
let cpHist = [];
function toggleChatPopup(){
  const p = document.getElementById('chatPopup');
  if(!p) return;
  p.classList.toggle('open');
  document.getElementById('chatFab')?.classList.toggle('hide', p.classList.contains('open'));
}
async function sendCpMsg(){
  const inp = document.getElementById('cpInput');
  const txt = inp.value.trim();
  if(!txt) return;
  const body = document.getElementById('cpBody');
  inp.value = '';

  const uDiv = document.createElement('div');
  uDiv.className = 'msg usr';
  uDiv.innerHTML = `<div class="m-av"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="m-bub">${txt.replace(/\n/g,'<br>')}</div>`;
  body.appendChild(uDiv);
  body.scrollTop = body.scrollHeight;

  const typ = document.createElement('div');
  typ.className = 'msg bot'; typ.id = 'cpTyping';
  typ.innerHTML = `<div class="m-av"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/></svg></div><div class="typing-bub"><span class="td"></span><span class="td"></span><span class="td"></span></div>`;
  body.appendChild(typ);
  body.scrollTop = body.scrollHeight;

  try{
    const r = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:txt,history:cpHist})});
    const d = await r.json();
    document.getElementById('cpTyping')?.remove();
    const bDiv = document.createElement('div');
    bDiv.className = 'msg bot';
    bDiv.innerHTML = `<div class="m-av"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/></svg></div><div class="m-bub">${mdToHtml(d.reply)}</div>`;
    body.appendChild(bDiv);
    body.scrollTop = body.scrollHeight;
    cpHist.push({role:'user',content:txt});
    cpHist.push({role:'assistant',content:d.reply});
  }catch(e){
    document.getElementById('cpTyping')?.remove();
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
  applyTheme(localStorage.getItem('ab_theme') || 'dark');
  populateLangSelectors();
  applyLang(currentLang);
  setupScrollAnim();

  const yearEl = document.getElementById('copyYear');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const cpInput = document.getElementById('cpInput');
  if(cpInput){
    cpInput.addEventListener('keydown', e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendCpMsg(); } });
  }

  setTimeout(showInstallToast, 2500);
});
