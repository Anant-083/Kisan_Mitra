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
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem('ab_theme',t);
  document.querySelectorAll('.theme-btn').forEach(b=>{b.innerHTML=t==='dark'?ICON_SUN:ICON_MOON;});
}
function toggleTheme(){
  applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
}

/* ── MARKDOWN RENDERER ── */
function mdToHtml(text){
  if(!text)return'';
  let html=text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^### (.*$)/gim,'<h4 class="md-h">$1</h4>')
    .replace(/^## (.*$)/gim,'<h3 class="md-h">$1</h3>')
    .replace(/^# (.*$)/gim,'<h2 class="md-h">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,'<em>$1</em>');
  const lines=html.split('\n');
  let out=[],inList=false;
  for(let line of lines){
    const m=line.match(/^[-•]\s+(.*)/);
    if(m){if(!inList){out.push('<ul class="md-list">');inList=true;}out.push(`<li>${m[1]}</li>`);}
    else{if(inList){out.push('</ul>');inList=false;}if(line.trim()!=='')out.push(`<p class="md-p">${line}</p>`);}
  }
  if(inList)out.push('</ul>');
  return out.join('');
}

function cleanTextForSpeech(text){
  return text
    .replace(/[\u{1F000}-\u{1FFFF}]/gu,'')
    .replace(/[\u{2600}-\u{27FF}]/gu,'')
    .replace(/[\u{FE00}-\u{FEFF}]/gu,'')
    .replace(/•/g,'').replace(/[►▶→←↑↓]/g,'')
    .replace(/\*\*/g,'').replace(/\*/g,'')
    .replace(/\s+/g,' ').trim();
}

/* ── ALL 23 LANGUAGES — NO FLAGS ── */
const TRANSLATIONS={
  en:{
    nav_home:'Home',nav_chat:'Symptom Check',nav_hospitals:'Hospitals',nav_medicines:'Medicines',nav_sos:'Emergency',nav_prx:'Prescription',
    hero_kicker:'Free · No Login · AI-Powered · 24/7',
    hero_h1:'Health guidance in <b>your language</b>',
    hero_sub:'Describe symptoms, find hospitals, check medicines — completely free, no registration.',
    btn_chat:'Check Symptoms',btn_hosp:'Find Hospital',btn_emg:'Emergency',
    stat1:'Languages',stat2:'States',stat3:'SOS Lines',stat4:'Available',
    sec_title:'Everything you need',
    fc1_title:'Symptom Checker',fc1_desc:'Speak or type symptoms — fever, cough, pain. Get instant AI guidance.',fc1_cta:'Start chatting',
    fc2_title:'Find Hospital',fc2_desc:'Nearest government hospitals in your state and district. One tap to call.',fc2_cta:'Find now',
    fc3_title:'Medicine Info',fc3_desc:'Dosage, uses, side effects and affordable Indian alternatives.',fc3_cta:'Search',
    fc4_title:'Emergency Contacts',fc4_desc:'All national helplines — ambulance, mental health, senior care.',fc4_cta:'View all',
    prx_title:'Prescription Reader',prx_desc:'Upload prescription — AI explains in simple language',
    disclaimer:'AarogyaBot gives general health information only — not a substitute for medical diagnosis.',
    footer_copy:'AarogyaBot provides general health guidance only. Always consult a qualified doctor.',
    lbl_language:'Language',lbl_theme:'Theme',
    pg_chat_title:'Symptom Checker',pg_chat_sub:'Voice or text · Auto language detection · AI-powered',
    pg_hosp_title:'Find Government Hospital',pg_hosp_sub:'Find hospitals near you or search by state & district',
    pg_med_title:'Medicine Information',pg_med_sub:'Dosage, uses, side effects and affordable alternatives',
    pg_emg_title:'Emergency Contacts',pg_emg_sub:'Free helplines, available 24/7 — tap to call',
    pg_prx_title:'Prescription Reader',pg_prx_sub:'Upload any prescription — AI explains it in your language',
    install_title:'Install AarogyaBot',
    install_ios:'1. Tap Share in Safari<br>2. Tap "Add to Home Screen"<br>3. Tap "Add"',
    install_android:'1. Tap menu (⋮) in browser<br>2. Tap "Install app"<br>3. Confirm',
    install_close:'Got it',
  },
  hi:{
    nav_home:'होम',nav_chat:'लक्षण जांच',nav_hospitals:'अस्पताल',nav_medicines:'दवाइयां',nav_sos:'आपातकाल',nav_prx:'पर्चा',
    hero_kicker:'मुफ्त · बिना लॉगिन · AI-संचालित · 24/7',
    hero_h1:'<b>आपकी भाषा</b> में स्वास्थ्य मार्गदर्शन',
    hero_sub:'लक्षण बताएं, अस्पताल खोजें, दवाइयां जानें — पूरी तरह मुफ्त।',
    btn_chat:'लक्षण जांचें',btn_hosp:'अस्पताल खोजें',btn_emg:'आपातकाल',
    stat1:'भाषाएं',stat2:'राज्य',stat3:'SOS लाइनें',stat4:'उपलब्ध',
    sec_title:'सभी सेवाएं',
    fc1_title:'लक्षण जांचक',fc1_desc:'बोलकर या टाइप करके लक्षण बताएं — बुखार, खांसी, दर्द।',fc1_cta:'बात शुरू करें',
    fc2_title:'अस्पताल खोजें',fc2_desc:'अपने राज्य और जिले में सरकारी अस्पताल।',fc2_cta:'अभी खोजें',
    fc3_title:'दवाई जानकारी',fc3_desc:'किसी भी दवाई का उपयोग, खुराक, साइड इफेक्ट।',fc3_cta:'खोजें',
    fc4_title:'आपातकालीन नंबर',fc4_desc:'सभी राष्ट्रीय हेल्पलाइन — एम्बुलेंस, मानसिक स्वास्थ्य।',fc4_cta:'सभी देखें',
    prx_title:'पर्चा पाठक',prx_desc:'पर्चा अपलोड करें — AI सरल भाषा में समझाएगा',
    disclaimer:'AarogyaBot केवल सामान्य स्वास्थ्य जानकारी देता है।',
    footer_copy:'AarogyaBot केवल सामान्य स्वास्थ्य जानकारी देता है। हमेशा डॉक्टर से मिलें।',
    lbl_language:'भाषा',lbl_theme:'थीम',
    pg_chat_title:'लक्षण जांचक',pg_chat_sub:'आवाज़ या टेक्स्ट · AI संचालित',
    pg_hosp_title:'सरकारी अस्पताल खोजें',pg_hosp_sub:'राज्य और जिला चुनें',
    pg_med_title:'दवाई जानकारी',pg_med_sub:'खुराक, उपयोग, साइड इफेक्ट',
    pg_emg_title:'आपातकालीन संपर्क',pg_emg_sub:'मुफ्त हेल्पलाइन, 24/7',
    pg_prx_title:'पर्चा पाठक',pg_prx_sub:'कोई भी पर्चा अपलोड करें',
    install_title:'AarogyaBot इंस्टॉल करें',
    install_ios:'1. Safari में Share टैप करें<br>2. "Add to Home Screen" टैप करें<br>3. "Add" टैप करें',
    install_android:'1. ब्राउज़र मेन्यू (⋮) टैप करें<br>2. "Install app" टैप करें<br>3. पुष्टि करें',
    install_close:'समझ गया',
  },
  bn:{
    nav_home:'হোম',nav_chat:'লক্ষণ পরীক্ষা',nav_hospitals:'হাসপাতাল',nav_medicines:'ওষুধ',nav_sos:'জরুরি',nav_prx:'প্রেসক্রিপশন',
    hero_kicker:'বিনামূল্যে · লগইন ছাড়া · AI-চালিত · 24/7',
    hero_h1:'<b>আপনার ভাষায়</b> স্বাস্থ্য নির্দেশনা',
    hero_sub:'লক্ষণ বলুন, হাসপাতাল খুঁজুন, ওষুধ জানুন — সম্পূর্ণ বিনামূল্যে।',
    btn_chat:'লক্ষণ পরীক্ষা করুন',btn_hosp:'হাসপাতাল খুঁজুন',btn_emg:'জরুরি',
    stat1:'ভাষা',stat2:'রাজ্য',stat3:'SOS লাইন',stat4:'উপলব্ধ',
    sec_title:'সব পরিষেবা',
    fc1_title:'লক্ষণ পরীক্ষক',fc1_desc:'বলে বা টাইপ করে লক্ষণ জানান।',fc1_cta:'চ্যাট শুরু করুন',
    fc2_title:'হাসপাতাল খুঁজুন',fc2_desc:'আপনার রাজ্য ও জেলায় সরকারি হাসপাতাল।',fc2_cta:'এখনই খুঁজুন',
    fc3_title:'ওষুধের তথ্য',fc3_desc:'যেকোনো ওষুধের ব্যবহার, মাত্রা, পার্শ্বপ্রতিক্রিয়া।',fc3_cta:'খুঁজুন',
    fc4_title:'জরুরি যোগাযোগ',fc4_desc:'সব জাতীয় হেল্পলাইন — অ্যাম্বুলেন্স।',fc4_cta:'সব দেখুন',
    prx_title:'প্রেসক্রিপশন পাঠক',prx_desc:'প্রেসক্রিপশন আপলোড করুন — AI সহজ ভাষায় বুঝিয়ে দেবে',
    disclaimer:'AarogyaBot শুধু সাধারণ স্বাস্থ্য তথ্য দেয়।',
    footer_copy:'AarogyaBot শুধু সাধারণ স্বাস্থ্য তথ্য দেয়। সবসময় ডাক্তারের পরামর্শ নিন।',
    lbl_language:'ভাষা',lbl_theme:'থিম',
    pg_chat_title:'লক্ষণ পরীক্ষক',pg_chat_sub:'ভয়েস বা টেক্সট · AI চালিত',
    pg_hosp_title:'সরকারি হাসপাতাল খুঁজুন',pg_hosp_sub:'রাজ্য ও জেলা নির্বাচন করুন',
    pg_med_title:'ওষুধের তথ্য',pg_med_sub:'মাত্রা, ব্যবহার, পার্শ্বপ্রতিক্রিয়া',
    pg_emg_title:'জরুরি যোগাযোগ',pg_emg_sub:'বিনামূল্যে হেল্পলাইন, 24/7',
    pg_prx_title:'প্রেসক্রিপশন পাঠক',pg_prx_sub:'যেকোনো প্রেসক্রিপশন আপলোড করুন',
    install_title:'AarogyaBot ইনস্টল করুন',
    install_ios:'1. Safari তে Share ট্যাপ করুন<br>2. "Add to Home Screen" ট্যাপ করুন<br>3. "Add" ট্যাপ করুন',
    install_android:'1. ব্রাউজার মেনু (⋮) ট্যাপ করুন<br>2. "Install app" ট্যাপ করুন<br>3. নিশ্চিত করুন',
    install_close:'বুঝেছি',
  },
  ta:{
    nav_home:'முகப்பு',nav_chat:'அறிகுறி சோதனை',nav_hospitals:'மருத்துவமனைகள்',nav_medicines:'மருந்துகள்',nav_sos:'அவசரம்',nav_prx:'மருந்துச்சீட்டு',
    hero_kicker:'இலவசம் · உள்நுழைவு இல்லை · AI · 24/7',
    hero_h1:'<b>உங்கள் மொழியில்</b> சுகாதார வழிகாட்டுதல்',
    hero_sub:'அறிகுறிகளை சொல்லுங்கள், மருத்துவமனை கண்டறியுங்கள் — முற்றிலும் இலவசம்.',
    btn_chat:'அறிகுறிகளை சரிபார்',btn_hosp:'மருத்துவமனை கண்டுபிடி',btn_emg:'அவசரம்',
    stat1:'மொழிகள்',stat2:'மாநிலங்கள்',stat3:'SOS லைன்கள்',stat4:'கிடைக்கிறது',
    sec_title:'அனைத்து சேவைகள்',
    fc1_title:'அறிகுறி சோதனையாளர்',fc1_desc:'பேசி அல்லது தட்டச்சு செய்து அறிகுறிகளை சொல்லுங்கள்.',fc1_cta:'அரட்டை தொடங்கு',
    fc2_title:'மருத்துவமனை கண்டுபிடி',fc2_desc:'உங்கள் மாநிலத்தில் அரசு மருத்துவமனைகள்.',fc2_cta:'இப்போது தேடு',
    fc3_title:'மருந்து தகவல்',fc3_desc:'எந்த மருந்தின் பயன்பாடு, அளவு, பக்க விளைவுகள்.',fc3_cta:'தேடு',
    fc4_title:'அவசர தொடர்புகள்',fc4_desc:'அனைத்து தேசிய உதவி எண்கள்.',fc4_cta:'அனைத்தையும் காண',
    prx_title:'மருந்துச் சீட்டு வாசிப்பி',prx_desc:'மருந்துச் சீட்டை பதிவேற்றவும் — AI எளிய மொழியில் விளக்கும்',
    disclaimer:'AarogyaBot பொது சுகாதார தகவலை மட்டுமே வழங்குகிறது.',
    footer_copy:'AarogyaBot பொது சுகாதார தகவலை மட்டுமே வழங்குகிறது. எப்போதும் மருத்துவரை அணுகவும்.',
    lbl_language:'மொழி',lbl_theme:'தீம்',
    pg_chat_title:'அறிகுறி சோதனையாளர்',pg_chat_sub:'குரல் அல்லது உரை · AI',
    pg_hosp_title:'அரசு மருத்துவமனை கண்டுபிடி',pg_hosp_sub:'மாநிலம் மற்றும் மாவட்டம் தேர்ந்தெடுக்கவும்',
    pg_med_title:'மருந்து தகவல்',pg_med_sub:'அளவு, பயன்பாடு, பக்க விளைவுகள்',
    pg_emg_title:'அவசர தொடர்புகள்',pg_emg_sub:'இலவச உதவி எண்கள், 24/7',
    pg_prx_title:'மருந்துச் சீட்டு வாசிப்பி',pg_prx_sub:'எந்த மருந்துச் சீட்டையும் பதிவேற்றவும்',
    install_title:'AarogyaBot நிறுவவும்',
    install_ios:'1. Safari இல் Share தட்டவும்<br>2. "Add to Home Screen" தட்டவும்<br>3. "Add" தட்டவும்',
    install_android:'1. உலாவி மெனுவை (⋮) தட்டவும்<br>2. "Install app" தட்டவும்<br>3. உறுதிப்படுத்தவும்',
    install_close:'புரிந்தது',
  },
  te:{
    nav_home:'హోమ్',nav_chat:'లక్షణ తనిఖీ',nav_hospitals:'ఆసుపత్రులు',nav_medicines:'మందులు',nav_sos:'అత్యవసరం',nav_prx:'ప్రిస్క్రిప్షన్',
    hero_kicker:'ఉచితం · లాగిన్ లేదు · AI · 24/7',
    hero_h1:'<b>మీ భాషలో</b> ఆరోగ్య మార్గదర్శకత్వం',
    hero_sub:'లక్షణాలు చెప్పండి, ఆసుపత్రులు కనుగొనండి — పూర్తిగా ఉచితం.',
    btn_chat:'లక్షణాలు తనిఖీ చేయండి',btn_hosp:'ఆసుపత్రి కనుగొనండి',btn_emg:'అత్యవసరం',
    stat1:'భాషలు',stat2:'రాష్ట్రాలు',stat3:'SOS లైన్లు',stat4:'అందుబాటులో',
    sec_title:'మీకు కావలసినవన్నీ',
    fc1_title:'లక్షణ తనిఖీదారు',fc1_desc:'మాట్లాడి లేదా టైప్ చేసి లక్షణాలు చెప్పండి.',fc1_cta:'చాట్ ప్రారంభించండి',
    fc2_title:'ఆసుపత్రి కనుగొనండి',fc2_desc:'మీ రాష్ట్రంలో ప్రభుత్వ ఆసుపత్రులు.',fc2_cta:'ఇప్పుడు వెతకండి',
    fc3_title:'మందు సమాచారం',fc3_desc:'ఏ మందు అయినా వాడకం, మోతాదు, దుష్ప్రభావాలు.',fc3_cta:'వెతకండి',
    fc4_title:'అత్యవసర పరిచయాలు',fc4_desc:'అన్ని జాతీయ హెల్ప్‌లైన్లు.',fc4_cta:'అన్నీ చూడండి',
    prx_title:'ప్రిస్క్రిప్షన్ రీడర్',prx_desc:'ప్రిస్క్రిప్షన్ అప్‌లోడ్ చేయండి — AI సరళంగా వివరిస్తుంది',
    disclaimer:'AarogyaBot సాధారణ ఆరోగ్య సమాచారం మాత్రమే ఇస్తుంది.',
    footer_copy:'AarogyaBot సాధారణ ఆరోగ్య సమాచారం మాత్రమే ఇస్తుంది. ఎల్లప్పుడూ వైద్యుడిని సంప్రదించండి.',
    lbl_language:'భాష',lbl_theme:'థీమ్',
    pg_chat_title:'లక్షణ తనిఖీదారు',pg_chat_sub:'వాయిస్ లేదా టెక్స్ట్ · AI',
    pg_hosp_title:'ప్రభుత్వ ఆసుపత్రి కనుగొనండి',pg_hosp_sub:'రాష్ట్రం మరియు జిల్లాను ఎంచుకోండి',
    pg_med_title:'మందు సమాచారం',pg_med_sub:'మోతాదు, వాడకం, దుష్ప్రభావాలు',
    pg_emg_title:'అత్యవసర పరిచయాలు',pg_emg_sub:'ఉచిత హెల్ప్‌లైన్లు, 24/7',
    pg_prx_title:'ప్రిస్క్రిప్షన్ రీడర్',pg_prx_sub:'ఏ ప్రిస్క్రిప్షన్ అయినా అప్‌లోడ్ చేయండి',
    install_title:'AarogyaBot ఇన్‌స్టాల్ చేయండి',
    install_ios:'1. Safari లో Share నొక్కండి<br>2. "Add to Home Screen" నొక్కండి<br>3. "Add" నొక్కండి',
    install_android:'1. బ్రౌజర్ మెనూ (⋮) నొక్కండి<br>2. "Install app" నొక్కండి<br>3. నిర్ధారించండి',
    install_close:'అర్థమైంది',
  },
  mr:{
    nav_home:'मुख्यपृष्ठ',nav_chat:'लक्षण तपासणी',nav_hospitals:'रुग्णालये',nav_medicines:'औषधे',nav_sos:'आणीबाणी',nav_prx:'प्रिस्क्रिप्शन',
    hero_kicker:'मोफत · लॉगिन नाही · AI · 24/7',
    hero_h1:'<b>तुमच्या भाषेत</b> आरोग्य मार्गदर्शन',
    hero_sub:'लक्षणे सांगा, रुग्णालये शोधा, औषधे जाणून घ्या — पूर्णपणे मोफत.',
    btn_chat:'लक्षणे तपासा',btn_hosp:'रुग्णालय शोधा',btn_emg:'आणीबाणी',
    stat1:'भाषा',stat2:'राज्ये',stat3:'SOS लाईन्स',stat4:'उपलब्ध',
    sec_title:'सर्व सेवा',
    fc1_title:'लक्षण तपासक',fc1_desc:'बोलून किंवा टाइप करून लक्षणे सांगा.',fc1_cta:'चॅट सुरू करा',
    fc2_title:'रुग्णालय शोधा',fc2_desc:'तुमच्या राज्यातील सरकारी रुग्णालये.',fc2_cta:'आता शोधा',
    fc3_title:'औषध माहिती',fc3_desc:'कोणत्याही औषधाचा वापर, मात्रा, दुष्परिणाम.',fc3_cta:'शोधा',
    fc4_title:'आणीबाणी संपर्क',fc4_desc:'सर्व राष्ट्रीय हेल्पलाईन.',fc4_cta:'सर्व पहा',
    prx_title:'प्रिस्क्रिप्शन वाचक',prx_desc:'प्रिस्क्रिप्शन अपलोड करा — AI सरळ भाषेत समजावेल',
    disclaimer:'AarogyaBot फक्त सामान्य आरोग्य माहिती देते.',
    footer_copy:'AarogyaBot फक्त सामान्य आरोग्य माहिती देते. नेहमी डॉक्टरांचा सल्ला घ्या.',
    lbl_language:'भाषा',lbl_theme:'थीम',
    pg_chat_title:'लक्षण तपासक',pg_chat_sub:'आवाज किंवा मजकूर · AI',
    pg_hosp_title:'सरकारी रुग्णालय शोधा',pg_hosp_sub:'राज्य आणि जिल्हा निवडा',
    pg_med_title:'औषध माहिती',pg_med_sub:'मात्रा, वापर, दुष्परिणाम',
    pg_emg_title:'आणीबाणी संपर्क',pg_emg_sub:'मोफत हेल्पलाईन, 24/7',
    pg_prx_title:'प्रिस्क्रिप्शन वाचक',pg_prx_sub:'कोणतेही प्रिस्क्रिप्शन अपलोड करा',
    install_title:'AarogyaBot इंस्टॉल करा',
    install_ios:'1. Safari मध्ये Share टॅप करा<br>2. "Add to Home Screen" टॅप करा<br>3. "Add" टॅप करा',
    install_android:'1. ब्राउझर मेनू (⋮) टॅप करा<br>2. "Install app" टॅप करा<br>3. पुष्टी करा',
    install_close:'समजले',
  },
  gu:{nav_home:'ઘર',nav_chat:'લક્ષણ તપાસ',nav_hospitals:'હોસ્પિટલ',nav_medicines:'દવાઓ',nav_sos:'કટોકટી',nav_prx:'પ્રિસ્ક્રિપ્શન',hero_kicker:'મફત · લૉગિન નહીં · AI · 24/7',hero_h1:'<b>તમારી ભાષામાં</b> આરોગ્ય માર્ગદર્શન',hero_sub:'લક્ષણો જણાવો, હોસ્પિટલ શોધો — સંપૂર્ણ મફત.',btn_chat:'લક્ષણ તપાસો',btn_hosp:'હોસ્પિટલ શોધો',btn_emg:'કટોકટી',stat1:'ભાષાઓ',stat2:'રાજ્યો',stat3:'SOS',stat4:'ઉપલબ્ધ',sec_title:'બધી સેવાઓ',fc1_title:'લક્ષણ તપાસક',fc1_desc:'બોલીને અથવા ટાઇપ કરીને લક્ષણો જણાવો.',fc1_cta:'વાત શરૂ કરો',fc2_title:'હોસ્પિટલ શોધો',fc2_desc:'તમારા રાજ્યમાં સરકારી હોસ્પિટલ.',fc2_cta:'અત્યારે શોધો',fc3_title:'દવાની માહિતી',fc3_desc:'ઉપયોગ, ડોઝ, આડ અસરો.',fc3_cta:'શોધો',fc4_title:'કટોકટી સંપર્ક',fc4_desc:'તમામ હેલ્પલાઇન.',fc4_cta:'બધા જુઓ',prx_title:'પ્રિસ્ક્રિપ્શન વાચક',prx_desc:'પ્રિસ્ક્રિપ્શન અપલોડ કરો — AI સમજાવશે',disclaimer:'AarogyaBot ફક્ત સામાન્ય આરોગ્ય માહિતી આપે છે.',footer_copy:'AarogyaBot ફક્ત સામાન્ય આરોગ્ય માહિતી આપે છે. હંમેશા ડૉક્ટરની સલાહ લો.',lbl_language:'ભાષા',lbl_theme:'થીમ',pg_chat_title:'લક્ષણ તપાસક',pg_chat_sub:'વૉઇસ અથવા ટેક્સ્ટ · AI',pg_hosp_title:'સરકારી હોસ્પિટલ',pg_hosp_sub:'રાજ્ય અને જિલ્લો પસંદ કરો',pg_med_title:'દવાની માહિતી',pg_med_sub:'ડોઝ, ઉપયોગ, આડ અસરો',pg_emg_title:'કટોકટી સંપર્ક',pg_emg_sub:'મફત હેલ્પલાઇન, 24/7',pg_prx_title:'પ્રિસ્ક્રિપ્શન વાચક',pg_prx_sub:'કોઈ પણ પ્રિસ્ક્રિપ્શન અપલોડ કરો',install_title:'AarogyaBot ઇન્સ્ટૉલ',install_ios:'Safari માં Share ટૅપ',install_android:'મેનૂ (⋮) ટૅપ, Install',install_close:'સમજ્યો'},
  kn:{nav_home:'ಮನೆ',nav_chat:'ಲಕ್ಷಣ ತಪಾಸಣೆ',nav_hospitals:'ಆಸ್ಪತ್ರೆಗಳು',nav_medicines:'ಔಷಧಗಳು',nav_sos:'ತುರ್ತು',nav_prx:'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್',hero_kicker:'ಉಚಿತ · ಲಾಗಿನ್ ಇಲ್ಲ · AI · 24/7',hero_h1:'<b>ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ</b> ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ',hero_sub:'ಲಕ್ಷಣಗಳನ್ನು ಹೇಳಿ, ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ — ಸಂಪೂರ್ಣ ಉಚಿತ.',btn_chat:'ಲಕ್ಷಣ ತಪಾಸಿಸಿ',btn_hosp:'ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ',btn_emg:'ತುರ್ತು',stat1:'ಭಾಷೆಗಳು',stat2:'ರಾಜ್ಯಗಳು',stat3:'SOS',stat4:'ಲಭ್ಯ',sec_title:'ಎಲ್ಲಾ ಸೇವೆಗಳು',fc1_title:'ಲಕ್ಷಣ ಪರೀಕ್ಷಕ',fc1_desc:'ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.',fc1_cta:'ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ',fc2_title:'ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ',fc2_desc:'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು.',fc2_cta:'ಈಗ ಹುಡುಕಿ',fc3_title:'ಔಷಧ ಮಾಹಿತಿ',fc3_desc:'ಬಳಕೆ, ಪ್ರಮಾಣ, ಅಡ್ಡ ಪರಿಣಾಮಗಳು.',fc3_cta:'ಹುಡುಕಿ',fc4_title:'ತುರ್ತು ಸಂಪರ್ಕಗಳು',fc4_desc:'ಎಲ್ಲಾ ಹೆಲ್ಪ್‌ಲೈನ್‌ಗಳು.',fc4_cta:'ಎಲ್ಲಾ ನೋಡಿ',prx_title:'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಓದುಗ',prx_desc:'ಅಪ್‌ಲೋಡ್ ಮಾಡಿ — AI ವಿವರಿಸುತ್ತದೆ',disclaimer:'AarogyaBot ಸಾಮಾನ್ಯ ಮಾಹಿತಿ ಮಾತ್ರ.',footer_copy:'AarogyaBot ಸಾಮಾನ್ಯ ಮಾಹಿತಿ ಮಾತ್ರ. ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',lbl_language:'ಭಾಷೆ',lbl_theme:'ಥೀಮ್',pg_chat_title:'ಲಕ್ಷಣ ಪರೀಕ್ಷಕ',pg_chat_sub:'ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯ · AI',pg_hosp_title:'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ',pg_hosp_sub:'ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ',pg_med_title:'ಔಷಧ ಮಾಹಿತಿ',pg_med_sub:'ಪ್ರಮಾಣ, ಬಳಕೆ',pg_emg_title:'ತುರ್ತು ಸಂಪರ್ಕ',pg_emg_sub:'ಉಚಿತ ಹೆಲ್ಪ್‌ಲೈನ್, 24/7',pg_prx_title:'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಓದುಗ',pg_prx_sub:'ಯಾವುದೇ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಪ್‌ಲೋಡ್',install_title:'AarogyaBot ಸ್ಥಾಪಿಸಿ',install_ios:'Safari ನಲ್ಲಿ Share ಟ್ಯಾಪ್',install_android:'ಮೆನು (⋮) ಟ್ಯಾಪ್',install_close:'ಅರ್ಥವಾಯಿತು'},
  ml:{nav_home:'ഹോം',nav_chat:'ലക്ഷണ പരിശോധന',nav_hospitals:'ആശുപത്രികൾ',nav_medicines:'മരുന്നുകൾ',nav_sos:'അടിയന്തരം',nav_prx:'പ്രിസ്ക്രിപ്ഷൻ',hero_kicker:'സൗജന്യം · ലോഗിൻ ഇല്ല · AI · 24/7',hero_h1:'<b>നിങ്ങളുടെ ഭാഷയിൽ</b> ആരോഗ്യ മാർഗ്ഗദർശനം',hero_sub:'ലക്ഷണങ്ങൾ പറയൂ, ആശുപത്രി കണ്ടെത്തൂ — പൂർണ്ണ സൗജന്യം.',btn_chat:'ലക്ഷണം പരിശോധിക്കൂ',btn_hosp:'ആശുപത്രി കണ്ടെത്തൂ',btn_emg:'അടിയന്തരം',stat1:'ഭാഷകൾ',stat2:'സംസ്ഥാനങ്ങൾ',stat3:'SOS',stat4:'ലഭ്യം',sec_title:'എല്ലാ സേവനങ്ങളും',fc1_title:'ലക്ഷണ പരിശോധകൻ',fc1_desc:'സംസാരിച്ചോ ടൈപ്പ് ചെയ്തോ ലക്ഷണങ്ങൾ പറയൂ.',fc1_cta:'ചാറ്റ് ആരംഭിക്കൂ',fc2_title:'ആശുപത്രി കണ്ടെത്തൂ',fc2_desc:'സർക്കാർ ആശുപത്രികൾ.',fc2_cta:'ഇപ്പോൾ കണ്ടെത്തൂ',fc3_title:'മരുന്ന് വിവരം',fc3_desc:'ഉപയോഗം, അളവ്, പാർശ്വഫലങ്ങൾ.',fc3_cta:'തിരയൂ',fc4_title:'അടിയന്തര ബന്ധങ്ങൾ',fc4_desc:'ഹെൽപ്‌ലൈനുകൾ.',fc4_cta:'എല്ലാം കാണൂ',prx_title:'പ്രിസ്ക്രിപ്ഷൻ വായനക്കാരൻ',prx_desc:'അപ്‌ലോഡ് ചെയ്യൂ — AI വിശദീകരിക്കും',disclaimer:'AarogyaBot പൊതു വിവരം മാത്രം.',footer_copy:'AarogyaBot പൊതു വിവരം മാത്രം. ഡോക്ടറെ സമീപിക്കൂ.',lbl_language:'ഭാഷ',lbl_theme:'തീം',pg_chat_title:'ലക്ഷണ പരിശോധകൻ',pg_chat_sub:'ശബ്ദം അല്ലെങ്കിൽ ടെക്സ്റ്റ് · AI',pg_hosp_title:'സർക്കാർ ആശുപത്രി',pg_hosp_sub:'സംസ്ഥാനവും ജില്ലയും',pg_med_title:'മരുന്ന് വിവരം',pg_med_sub:'അളവ്, ഉപയോഗം',pg_emg_title:'അടിയന്തര ബന്ധങ്ങൾ',pg_emg_sub:'സൗജന്യ ഹെൽപ്‌ലൈൻ, 24/7',pg_prx_title:'പ്രിസ്ക്രിപ്ഷൻ',pg_prx_sub:'ഏതൊരു പ്രിസ്ക്രിപ്ഷനും',install_title:'AarogyaBot ഇൻസ്റ്റാൾ',install_ios:'Safari ൽ Share ടാപ്പ്',install_android:'മെനു (⋮) ടാപ്പ്',install_close:'മനസ്സിലായി'},
  pa:{nav_home:'ਘਰ',nav_chat:'ਲੱਛਣ ਜਾਂਚ',nav_hospitals:'ਹਸਪਤਾਲ',nav_medicines:'ਦਵਾਈਆਂ',nav_sos:'ਐਮਰਜੈਂਸੀ',nav_prx:'ਪਰਚਾ',hero_kicker:'ਮੁਫ਼ਤ · ਲੌਗਿਨ ਨਹੀਂ · AI · 24/7',hero_h1:'<b>ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ</b> ਸਿਹਤ ਮਾਰਗਦਰਸ਼ਨ',hero_sub:'ਲੱਛਣ ਦੱਸੋ, ਹਸਪਤਾਲ ਲੱਭੋ — ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁਫ਼ਤ।',btn_chat:'ਲੱਛਣ ਜਾਂਚੋ',btn_hosp:'ਹਸਪਤਾਲ ਲੱਭੋ',btn_emg:'ਐਮਰਜੈਂਸੀ',stat1:'ਭਾਸ਼ਾਵਾਂ',stat2:'ਸੂਬੇ',stat3:'SOS',stat4:'ਉਪਲਬਧ',sec_title:'ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ',fc1_title:'ਲੱਛਣ ਜਾਂਚਕਰਤਾ',fc1_desc:'ਬੋਲ ਕੇ ਜਾਂ ਟਾਈਪ ਕਰਕੇ ਲੱਛਣ ਦੱਸੋ।',fc1_cta:'ਗੱਲਬਾਤ ਸ਼ੁਰੂ',fc2_title:'ਹਸਪਤਾਲ ਲੱਭੋ',fc2_desc:'ਸਰਕਾਰੀ ਹਸਪਤਾਲ।',fc2_cta:'ਹੁਣੇ ਲੱਭੋ',fc3_title:'ਦਵਾਈ ਜਾਣਕਾਰੀ',fc3_desc:'ਵਰਤੋਂ, ਖੁਰਾਕ, ਮਾੜੇ ਪ੍ਰਭਾਵ।',fc3_cta:'ਖੋਜੋ',fc4_title:'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ',fc4_desc:'ਹੈਲਪਲਾਈਨਾਂ।',fc4_cta:'ਸਭ ਦੇਖੋ',prx_title:'ਪਰਚਾ ਪਾਠਕ',prx_desc:'ਪਰਚਾ ਅਪਲੋਡ — AI ਸਮਝਾਵੇਗਾ',disclaimer:'AarogyaBot ਕੇਵਲ ਆਮ ਜਾਣਕਾਰੀ।',footer_copy:'AarogyaBot ਕੇਵਲ ਆਮ ਜਾਣਕਾਰੀ। ਡਾਕਟਰ ਕੋਲ ਜਾਓ।',lbl_language:'ਭਾਸ਼ਾ',lbl_theme:'ਥੀਮ',pg_chat_title:'ਲੱਛਣ ਜਾਂਚਕਰਤਾ',pg_chat_sub:'ਆਵਾਜ਼ ਜਾਂ ਟੈਕਸਟ · AI',pg_hosp_title:'ਸਰਕਾਰੀ ਹਸਪਤਾਲ',pg_hosp_sub:'ਸੂਬਾ ਅਤੇ ਜ਼ਿਲ੍ਹਾ',pg_med_title:'ਦਵਾਈ ਜਾਣਕਾਰੀ',pg_med_sub:'ਖੁਰਾਕ, ਵਰਤੋਂ',pg_emg_title:'ਐਮਰਜੈਂਸੀ',pg_emg_sub:'ਮੁਫ਼ਤ ਹੈਲਪਲਾਈਨ, 24/7',pg_prx_title:'ਪਰਚਾ ਪਾਠਕ',pg_prx_sub:'ਕੋਈ ਵੀ ਪਰਚਾ ਅਪਲੋਡ',install_title:'AarogyaBot ਇੰਸਟਾਲ',install_ios:'Safari ਵਿੱਚ Share ਟੈਪ',install_android:'ਮੇਨੂ (⋮) ਟੈਪ',install_close:'ਸਮਝ ਗਿਆ'},
  or:{nav_home:'ଘର',nav_chat:'ଲକ୍ଷଣ ଯାଞ୍ଚ',nav_hospitals:'ହସ୍ପିଟାଲ',nav_medicines:'ଔଷଧ',nav_sos:'ଜରୁରୀ',nav_prx:'ପ୍ରେସ୍କ୍ରିପ୍ସନ',hero_kicker:'ମୁଫ୍ତ · ଲଗଇନ ନାହିଁ · AI · 24/7',hero_h1:'<b>ଆପଣଙ୍କ ଭାଷାରେ</b> ସ୍ୱାସ୍ଥ୍ୟ ମାର୍ଗଦର୍ଶନ',hero_sub:'ଲକ୍ଷଣ କୁହନ୍ତୁ, ହସ୍ପିଟାଲ ଖୋଜନ୍ତୁ — ସଂପୂର୍ଣ ମୁଫ୍ତ।',btn_chat:'ଲକ୍ଷଣ ଯାଞ୍ଚ',btn_hosp:'ହସ୍ପିଟାଲ ଖୋଜ',btn_emg:'ଜରୁରୀ',stat1:'ଭାଷା',stat2:'ରାଜ୍ୟ',stat3:'SOS',stat4:'ଉପଲବ୍ଧ',sec_title:'ସମସ୍ତ ସେବା',fc1_title:'ଲକ୍ଷଣ ଯାଞ୍ଚକ',fc1_desc:'ବୋଲ ବା ଟାଇପ।',fc1_cta:'ଚ୍ୟାଟ',fc2_title:'ହସ୍ପିଟାଲ ଖୋଜ',fc2_desc:'ସରକାରୀ ହସ୍ପିଟାଲ।',fc2_cta:'ଏବେ',fc3_title:'ଔଷଧ ତଥ୍ୟ',fc3_desc:'ଉପଯୋଗ, ମାତ୍ରା।',fc3_cta:'ଖୋଜ',fc4_title:'ଜରୁରୀ ଯୋଗାଯୋଗ',fc4_desc:'ହେଲ୍ପଲାଇନ।',fc4_cta:'ଦେଖ',prx_title:'ପ୍ରେସ୍କ୍ରିପ୍ସନ ପାଠକ',prx_desc:'ଅପଲୋଡ — AI ବୁଝାଇବ',disclaimer:'AarogyaBot ସାଧାରଣ ତଥ୍ୟ।',footer_copy:'AarogyaBot ସାଧାରଣ ତଥ୍ୟ। ଡାକ୍ତର ଭେଟ।',lbl_language:'ଭାଷା',lbl_theme:'ଥିମ',pg_chat_title:'ଲକ୍ଷଣ ଯାଞ୍ଚକ',pg_chat_sub:'AI',pg_hosp_title:'ସରକାରୀ ହସ୍ପିଟାଲ',pg_hosp_sub:'ରାଜ୍ୟ ଏବଂ ଜିଲ୍ଲା',pg_med_title:'ଔଷଧ ତଥ୍ୟ',pg_med_sub:'ମାତ୍ରା, ଉପଯୋଗ',pg_emg_title:'ଜରୁରୀ ଯୋଗାଯୋଗ',pg_emg_sub:'ହେଲ୍ପଲାଇନ, 24/7',pg_prx_title:'ପ୍ରେସ୍କ୍ରିପ୍ସନ',pg_prx_sub:'ଅପଲୋଡ ହୁଅ',install_title:'AarogyaBot ଇନ୍ସ୍ଟଲ',install_ios:'Share ଟ୍ୟାପ',install_android:'ମେନୁ (⋮) ଟ୍ୟାପ',install_close:'ବୁଝିଲି'},
  as:{nav_home:'ঘৰ',nav_chat:'লক্ষণ পৰীক্ষা',nav_hospitals:'হাস্পাতাল',nav_medicines:'ঔষধ',nav_sos:'জৰুৰী',nav_prx:'প্ৰেছক্ৰিপশ্বন',hero_kicker:'বিনামূলীয়া · AI · 24/7',hero_h1:'<b>আপোনাৰ ভাষাত</b> স্বাস্থ্য নিৰ্দেশনা',hero_sub:'লক্ষণ কওক, হাস্পাতাল বিচাৰক — সম্পূৰ্ণ বিনামূলীয়া।',btn_chat:'লক্ষণ পৰীক্ষা',btn_hosp:'হাস্পাতাল বিচাৰক',btn_emg:'জৰুৰী',stat1:'ভাষা',stat2:'ৰাজ্য',stat3:'SOS',stat4:'উপলব্ধ',sec_title:'সকলো সেৱা',fc1_title:'লক্ষণ পৰীক্ষক',fc1_desc:'কথা পাতক বা টাইপ কৰক।',fc1_cta:'চ্যাট',fc2_title:'হাস্পাতাল বিচাৰক',fc2_desc:'চৰকাৰী হাস্পাতাল।',fc2_cta:'বিচাৰক',fc3_title:'ঔষধৰ তথ্য',fc3_desc:'ব্যৱহাৰ, পৰিমাণ।',fc3_cta:'বিচাৰক',fc4_title:'জৰুৰী যোগাযোগ',fc4_desc:'হেল্পলাইন।',fc4_cta:'চাওক',prx_title:'প্ৰেছক্ৰিপশ্বন পাঠক',prx_desc:'আপলোড — AI বুজাব',disclaimer:'AarogyaBot সাধাৰণ তথ্য।',footer_copy:'AarogyaBot সাধাৰণ তথ্য। চিকিৎসকৰ পৰামৰ্শ লওক।',lbl_language:'ভাষা',lbl_theme:'থিম',pg_chat_title:'লক্ষণ পৰীক্ষক',pg_chat_sub:'AI',pg_hosp_title:'চৰকাৰী হাস্পাতাল',pg_hosp_sub:'ৰাজ্য আৰু জিলা',pg_med_title:'ঔষধৰ তথ্য',pg_med_sub:'পৰিমাণ, ব্যৱহাৰ',pg_emg_title:'জৰুৰী যোগাযোগ',pg_emg_sub:'হেল্পলাইন, 24/7',pg_prx_title:'প্ৰেছক্ৰিপশ্বন',pg_prx_sub:'আপলোড কৰক',install_title:'AarogyaBot ইনষ্টল',install_ios:'Share টেপ',install_android:'মেনু (⋮) টেপ',install_close:'বুজিলো'},
  ur:{nav_home:'گھر',nav_chat:'علامات کی جانچ',nav_hospitals:'ہسپتال',nav_medicines:'دوائیں',nav_sos:'ہنگامی',nav_prx:'نسخہ',hero_kicker:'مفت · لاگ ان نہیں · AI · 24/7',hero_h1:'<b>آپ کی زبان میں</b> صحت رہنمائی',hero_sub:'علامات بتائیں، ہسپتال ڈھونڈیں — مکمل مفت۔',btn_chat:'علامات جانچیں',btn_hosp:'ہسپتال ڈھونڈیں',btn_emg:'ہنگامی',stat1:'زبانیں',stat2:'ریاستیں',stat3:'SOS',stat4:'دستیاب',sec_title:'تمام خدمات',fc1_title:'علامات جانچ',fc1_desc:'بول کر یا ٹائپ کر کے بتائیں۔',fc1_cta:'بات شروع',fc2_title:'ہسپتال ڈھونڈیں',fc2_desc:'سرکاری ہسپتال۔',fc2_cta:'ابھی',fc3_title:'دوا کی معلومات',fc3_desc:'استعمال، خوراک۔',fc3_cta:'تلاش',fc4_title:'ہنگامی رابطے',fc4_desc:'ہیلپ لائن۔',fc4_cta:'دیکھیں',prx_title:'نسخہ قاری',prx_desc:'نسخہ اپلوڈ — AI سمجھائے گا',disclaimer:'AarogyaBot صرف عام معلومات۔',footer_copy:'AarogyaBot صرف عام معلومات۔ ڈاکٹر سے ملیں۔',lbl_language:'زبان',lbl_theme:'تھیم',pg_chat_title:'علامات جانچ',pg_chat_sub:'AI',pg_hosp_title:'سرکاری ہسپتال',pg_hosp_sub:'ریاست اور ضلع',pg_med_title:'دوا کی معلومات',pg_med_sub:'خوراک، استعمال',pg_emg_title:'ہنگامی',pg_emg_sub:'ہیلپ لائن، 24/7',pg_prx_title:'نسخہ قاری',pg_prx_sub:'نسخہ اپلوڈ',install_title:'AarogyaBot انسٹال',install_ios:'Share ٹیپ',install_android:'مینو (⋮) ٹیپ',install_close:'سمجھ گیا'},
  ne:{nav_home:'घर',nav_chat:'लक्षण जाँच',nav_hospitals:'अस्पताल',nav_medicines:'औषधि',nav_sos:'आपतकाल',nav_prx:'प्रिस्क्रिप्शन',hero_kicker:'निःशुल्क · AI · 24/7',hero_h1:'<b>तपाईंको भाषामा</b> स्वास्थ्य मार्गदर्शन',hero_sub:'लक्षण बताउनुहोस्, अस्पताल खोज्नुहोस् — पूर्णतः निःशुल्क।',btn_chat:'लक्षण जाँच्नुहोस्',btn_hosp:'अस्पताल खोज्नुहोस्',btn_emg:'आपतकाल',stat1:'भाषाहरू',stat2:'राज्यहरू',stat3:'SOS',stat4:'उपलब्ध',sec_title:'सबै सेवाहरू',fc1_title:'लक्षण जाँचकर्ता',fc1_desc:'बोलेर वा टाइप गरेर लक्षण बताउनुहोस्।',fc1_cta:'च्याट सुरु',fc2_title:'अस्पताल खोज्नुहोस्',fc2_desc:'सरकारी अस्पताल।',fc2_cta:'अहिले',fc3_title:'औषधि जानकारी',fc3_desc:'प्रयोग, मात्रा।',fc3_cta:'खोज्नुहोस्',fc4_title:'आपतकालीन सम्पर्क',fc4_desc:'हेल्पलाइन।',fc4_cta:'हेर्नुहोस्',prx_title:'प्रिस्क्रिप्शन पाठक',prx_desc:'अपलोड — AI बुझाउँछ',disclaimer:'AarogyaBot सामान्य जानकारी मात्र।',footer_copy:'AarogyaBot सामान्य जानकारी मात्र। डाक्टरको सल्लाह लिनुहोस्।',lbl_language:'भाषा',lbl_theme:'थिम',pg_chat_title:'लक्षण जाँचकर्ता',pg_chat_sub:'AI',pg_hosp_title:'सरकारी अस्पताल',pg_hosp_sub:'राज्य र जिल्ला',pg_med_title:'औषधि जानकारी',pg_med_sub:'मात्रा, प्रयोग',pg_emg_title:'आपतकालीन',pg_emg_sub:'हेल्पलाइन, 24/7',pg_prx_title:'प्रिस्क्रिप्शन',pg_prx_sub:'अपलोड गर्नुहोस्',install_title:'AarogyaBot स्थापना',install_ios:'Share ट्याप',install_android:'मेनु (⋮) ट्याप',install_close:'बुझियो'},
  sa:{nav_home:'गृहम्',nav_chat:'लक्षणपरीक्षा',nav_hospitals:'चिकित्सालयाः',nav_medicines:'औषधानि',nav_sos:'आपातम्',nav_prx:'व्यवस्थापत्रम्',hero_kicker:'निःशुल्कम् · AI · 24/7',hero_h1:'<b>भवतः भाषायाम्</b> स्वास्थ्यमार्गदर्शनम्',hero_sub:'लक्षणानि वदतु, चिकित्सालयं अन्वेषयतु — सर्वथा निःशुल्कम्।',btn_chat:'लक्षणं परीक्षताम्',btn_hosp:'चिकित्सालयम्',btn_emg:'आपातम्',stat1:'भाषाः',stat2:'राज्यानि',stat3:'SOS',stat4:'उपलब्धम्',sec_title:'सर्वाः सेवाः',fc1_title:'लक्षणपरीक्षकः',fc1_desc:'वदतु वा टाइप कुर्वन्तु।',fc1_cta:'वार्तालापम्',fc2_title:'चिकित्सालयम्',fc2_desc:'शासकीय चिकित्सालयाः।',fc2_cta:'अन्वेषयतु',fc3_title:'औषधसूचना',fc3_desc:'उपयोगः, मात्रा।',fc3_cta:'अन्वेषयतु',fc4_title:'आपातसम्पर्काः',fc4_desc:'हेल्पलाइनाः।',fc4_cta:'पश्यतु',prx_title:'व्यवस्थापत्रपाठकः',prx_desc:'अपलोड — AI समझाइष्यति',disclaimer:'AarogyaBot केवलं सामान्यसूचनाम्।',footer_copy:'AarogyaBot सामान्यसूचनाम्। वैद्यं पश्यतु।',lbl_language:'भाषा',lbl_theme:'विषयः',pg_chat_title:'लक्षणपरीक्षकः',pg_chat_sub:'AI',pg_hosp_title:'शासकीयचिकित्सालयम्',pg_hosp_sub:'राज्यं जिल्लां च',pg_med_title:'औषधसूचना',pg_med_sub:'मात्रा, उपयोगः',pg_emg_title:'आपातसम्पर्काः',pg_emg_sub:'24/7',pg_prx_title:'व्यवस्थापत्रपाठकः',pg_prx_sub:'अपलोड कुर्वन्तु',install_title:'AarogyaBot स्थापयतु',install_ios:'Share स्पृशतु',install_android:'मेनु (⋮) स्पृशतु',install_close:'अवगतम्'},
  kok:{nav_home:'घर',nav_chat:'लक्षण तपासणी',nav_hospitals:'दवाखानो',nav_medicines:'औखदां',nav_sos:'आपतकाल',nav_prx:'प्रिस्क्रिप्शन',hero_kicker:'मोफत · AI · 24/7',hero_h1:'<b>तुमच्या भाशेंत</b> आरोग्य मार्गदर्शन',hero_sub:'लक्षणां सांगात, दवाखानो सोदात — पुराय मोफत।',btn_chat:'लक्षण तपासात',btn_hosp:'दवाखानो सोदात',btn_emg:'आपतकाल',stat1:'भाशा',stat2:'राज्यां',stat3:'SOS',stat4:'उपलब्ध',sec_title:'सगळ्यो सेवा',fc1_title:'लक्षण तपासक',fc1_desc:'उलोवन वा टायप करन सांगात।',fc1_cta:'चॅट',fc2_title:'दवाखानो सोदात',fc2_desc:'सरकारी दवाखानो।',fc2_cta:'सोदात',fc3_title:'औखद माहिती',fc3_desc:'उपेग, प्रमाण।',fc3_cta:'सोदात',fc4_title:'आपत संपर्क',fc4_desc:'हेल्पलायनी।',fc4_cta:'पळयात',prx_title:'प्रिस्क्रिप्शन वाचप',prx_desc:'अपलोड — AI समजायतलो',disclaimer:'AarogyaBot साधारण माहिती।',footer_copy:'AarogyaBot साधारण माहिती। डॉक्टराचो सल्लो।',lbl_language:'भाशा',lbl_theme:'थीम',pg_chat_title:'लक्षण तपासक',pg_chat_sub:'AI',pg_hosp_title:'सरकारी दवाखानो',pg_hosp_sub:'राज्य आनी जिल्लो',pg_med_title:'औखद माहिती',pg_med_sub:'प्रमाण, उपेग',pg_emg_title:'आपत संपर्क',pg_emg_sub:'24/7',pg_prx_title:'प्रिस्क्रिप्शन',pg_prx_sub:'अपलोड करात',install_title:'AarogyaBot इन्स्टॉल',install_ios:'Share टॅप',install_android:'मेनू (⋮) टॅप',install_close:'समजलें'},
  doi:{nav_home:'घर',nav_chat:'लच्छण जांच',nav_hospitals:'अस्पताल',nav_medicines:'दवाइयां',nav_sos:'ज़रूरी',nav_prx:'नुस्खा',hero_kicker:'मुफ़त · AI · 24/7',hero_h1:'<b>तुंदी भाषा च</b> सेहत मार्गदर्शन',hero_sub:'लच्छण दसो, अस्पताल लब्भो — पूरी चाल मुफ़त।',btn_chat:'लच्छण जांचो',btn_hosp:'अस्पताल लब्भो',btn_emg:'ज़रूरी',stat1:'भाषाएं',stat2:'राज्य',stat3:'SOS',stat4:'उपलब्ध',sec_title:'सारी सेवाएं',fc1_title:'लच्छण जांचक',fc1_desc:'बोलियै जां टाइप करियै।',fc1_cta:'गल्लबात',fc2_title:'अस्पताल लब्भो',fc2_desc:'सरकारी अस्पताल।',fc2_cta:'लब्भो',fc3_title:'दवाई जानकारी',fc3_desc:'खुराक, नुकसान।',fc3_cta:'खोजो',fc4_title:'ज़रूरी संपर्क',fc4_desc:'हेल्पलाइन।',fc4_cta:'देखो',prx_title:'नुस्खा पाठक',prx_desc:'अपलोड — AI समझाएगा',disclaimer:'AarogyaBot आम जानकारी।',footer_copy:'AarogyaBot आम जानकारी। डाक्टर कनि जाओ।',lbl_language:'भाषा',lbl_theme:'थीम',pg_chat_title:'लच्छण जांचक',pg_chat_sub:'AI',pg_hosp_title:'सरकारी अस्पताल',pg_hosp_sub:'राज्य ते जिला',pg_med_title:'दवाई जानकारी',pg_med_sub:'खुराक, इस्तेमाल',pg_emg_title:'ज़रूरी',pg_emg_sub:'24/7',pg_prx_title:'नुस्खा',pg_prx_sub:'अपलोड करो',install_title:'AarogyaBot इंस्टॉल',install_ios:'Share टैप',install_android:'मेनू (⋮) टैप',install_close:'समझ गिया'},
  mni:{nav_home:'ইমা ইশাগী',nav_chat:'চেকশিনবা',nav_hospitals:'হস্পিটেল',nav_medicines:'ওষুধ',nav_sos:'ইমার্জেন্সি',nav_prx:'প্রেসক্রিপশন',hero_kicker:'ফ্রি · AI · 24/7',hero_h1:'<b>নঙগী লোন্দা</b> হেলথ গাইডেন্স',hero_sub:'নোংথাং ওইবা থাজিনবা পীবিরু — ফ্রি।',btn_chat:'নোংথাং চেক',btn_hosp:'হস্পিটেল',btn_emg:'ইমার্জেন্সি',stat1:'লোন',stat2:'রাজ্য',stat3:'SOS',stat4:'পাওখিবা',sec_title:'সর্বিস',fc1_title:'নোংথাং চেকার',fc1_desc:'ওইরকপা ওইনা থাজিনবিরু।',fc1_cta:'চ্যাট',fc2_title:'হস্পিটেল',fc2_desc:'গভর্নমেন্ট হস্পিটেল।',fc2_cta:'চেক',fc3_title:'ওষুধ ইনফো',fc3_desc:'য়াওনবা, মোতাদ।',fc3_cta:'থাজিন',fc4_title:'ইমার্জেন্সি',fc4_desc:'হেল্পলাইন।',fc4_cta:'উৎপা',prx_title:'প্রেসক্রিপশন রিডার',prx_desc:'আপলোড — AI বুজাবিগনি',disclaimer:'AarogyaBot জেনেরেল ইনফো।',footer_copy:'AarogyaBot জেনেরেল ইনফো। ডাক্তরদা ফোংদোকপা।',lbl_language:'লোন',lbl_theme:'থিম',pg_chat_title:'নোংথাং চেকার',pg_chat_sub:'AI',pg_hosp_title:'গভর্নমেন্ট হস্পিটেল',pg_hosp_sub:'রাজ্য অমদি জিলা',pg_med_title:'ওষুধ ইনফো',pg_med_sub:'মোতাদ, য়াওনবা',pg_emg_title:'ইমার্জেন্সি',pg_emg_sub:'24/7',pg_prx_title:'প্রেসক্রিপশন',pg_prx_sub:'আপলোড করবিরু',install_title:'AarogyaBot ইন্সটল',install_ios:'Share ট্যাপ',install_android:'মেনু (⋮) ট্যাপ',install_close:'থাজিনখি'},
  sat:{nav_home:'ᱜᱟᱲ',nav_chat:'ᱵᱮᱢᱟᱨ ᱡᱟᱸᱪ',nav_hospitals:'ᱦᱚᱥᱯᱤᱴᱟᱹᱞ',nav_medicines:'ᱫᱟᱣᱟᱭ',nav_sos:'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ',nav_prx:'ᱯᱨᱮᱥᱠᱨᱤᱯᱥᱚᱱ',hero_kicker:'ᱦᱤᱱᱟ · AI · 24/7',hero_h1:'<b>ᱟᱯᱮ ᱠᱷᱚᱱ</b> ᱥᱤᱠᱷᱮᱛ ᱢᱟᱨᱜᱚᱫᱚᱨᱥᱚᱱ',hero_sub:'ᱵᱮᱢᱟᱨ ᱮᱥᱮ ᱵᱩᱡᱷᱟᱣ।',btn_chat:'ᱵᱮᱢᱟᱨ ᱡᱟᱸᱪ',btn_hosp:'ᱦᱚᱥᱯᱤᱴᱟᱹᱞ',btn_emg:'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ',stat1:'ᱵᱷᱟᱥᱟ',stat2:'ᱨᱟᱡᱽᱭᱚ',stat3:'SOS',stat4:'ᱜᱚᱴᱟᱣ',sec_title:'ᱥᱮᱵᱟ',fc1_title:'ᱵᱮᱢᱟᱨ ᱡᱟᱸᱪ',fc1_desc:'ᱠᱷᱟᱱᱟᱣ।',fc1_cta:'ᱪᱮᱴ',fc2_title:'ᱦᱚᱥᱯᱤᱴᱟᱹᱞ',fc2_desc:'ᱥᱚᱨᱠᱟᱨᱤ।',fc2_cta:'ᱮᱠᱷᱚᱱ',fc3_title:'ᱫᱟᱣᱟᱭ ᱤᱱᱯᱷᱚ',fc3_desc:'ᱫᱟᱣᱟᱭ।',fc3_cta:'ᱵᱷᱟᱞ',fc4_title:'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ',fc4_desc:'ᱦᱮᱞᱯᱞᱟᱭᱱ।',fc4_cta:'ᱫᱮᱠᱷᱟᱣ',prx_title:'ᱯᱨᱮᱥᱠᱨᱤᱯᱥᱚᱱ',prx_desc:'ᱟᱯᱞᱚᱰ — AI ᱵᱩᱡᱷᱟᱣᱢᱮ',disclaimer:'AarogyaBot ᱥᱟᱫᱷᱟᱨᱚᱱ ᱤᱱᱯᱷᱚ।',footer_copy:'AarogyaBot ᱥᱟᱫᱷᱟᱨᱚᱱ ᱤᱱᱯᱷᱚ। ᱰᱟᱠᱴᱚᱨ ᱠᱷᱚᱱ।',lbl_language:'ᱵᱷᱟᱥᱟ',lbl_theme:'ᱛᱷᱤᱢ',pg_chat_title:'ᱵᱮᱢᱟᱨ ᱡᱟᱸᱪ',pg_chat_sub:'AI',pg_hosp_title:'ᱦᱚᱥᱯᱤᱴᱟᱹᱞ',pg_hosp_sub:'ᱨᱟᱡᱽᱭᱚ',pg_med_title:'ᱫᱟᱣᱟᱭ',pg_med_sub:'ᱤᱱᱯᱷᱚ',pg_emg_title:'ᱤᱢᱟᱨᱡᱮᱱᱥᱤ',pg_emg_sub:'24/7',pg_prx_title:'ᱯᱨᱮᱥᱠᱨᱤᱯᱥᱚᱱ',pg_prx_sub:'ᱟᱯᱞᱚᱰ ᱠᱚᱨᱚ',install_title:'AarogyaBot ᱤᱱᱥᱴᱚᱞ',install_ios:'Share ᱴᱮᱯ',install_android:'ᱢᱮᱱᱩ (⋮) ᱴᱮᱯ',install_close:'ᱵᱩᱡᱷᱞᱮᱫ'},
  mai:{nav_home:'घर',nav_chat:'लक्षण जाँच',nav_hospitals:'अस्पताल',nav_medicines:'दवाइ',nav_sos:'आपातकाल',nav_prx:'पर्चा',hero_kicker:'मुफ्त · AI · 24/7',hero_h1:'<b>अपनेक भाषामे</b> स्वास्थ्य मार्गदर्शन',hero_sub:'लक्षण बताऊ, अस्पताल खोजू — पूर्णतः मुफ्त।',btn_chat:'लक्षण जाँचू',btn_hosp:'अस्पताल खोजू',btn_emg:'आपातकाल',stat1:'भाषा',stat2:'राज्य',stat3:'SOS',stat4:'उपलब्ध',sec_title:'सभ सेवा',fc1_title:'लक्षण जाँचक',fc1_desc:'बाजि वा टाइप करि बताऊ।',fc1_cta:'चैट',fc2_title:'अस्पताल खोजू',fc2_desc:'सरकारी अस्पताल।',fc2_cta:'खोजू',fc3_title:'दवाइ जानकारी',fc3_desc:'उपयोग, मात्रा।',fc3_cta:'खोजू',fc4_title:'आपातकालीन',fc4_desc:'हेल्पलाइन।',fc4_cta:'देखू',prx_title:'पर्चा पाठक',prx_desc:'अपलोड — AI बुझाएत',disclaimer:'AarogyaBot साधारण जानकारी।',footer_copy:'AarogyaBot साधारण जानकारी। डाक्टर सँ भेँटू।',lbl_language:'भाषा',lbl_theme:'थीम',pg_chat_title:'लक्षण जाँचक',pg_chat_sub:'AI',pg_hosp_title:'सरकारी अस्पताल',pg_hosp_sub:'राज्य आ जिला',pg_med_title:'दवाइ जानकारी',pg_med_sub:'मात्रा, उपयोग',pg_emg_title:'आपातकाल',pg_emg_sub:'24/7',pg_prx_title:'पर्चा पाठक',pg_prx_sub:'अपलोड करू',install_title:'AarogyaBot इंस्टॉल',install_ios:'Share टैप',install_android:'मेनू (⋮) टैप',install_close:'बुझलहुँ'},
  bho:{nav_home:'घर',nav_chat:'लच्छन जांच',nav_hospitals:'अस्पताल',nav_medicines:'दवाई',nav_sos:'इमर्जेंसी',nav_prx:'पर्चा',hero_kicker:'मुफ्त · AI · 24/7',hero_h1:'<b>रउरा भाषा में</b> सेहत मार्गदर्शन',hero_sub:'लच्छन बताईं, अस्पताल खोजीं — पूरा मुफ्त।',btn_chat:'लच्छन जांचीं',btn_hosp:'अस्पताल खोजीं',btn_emg:'इमर्जेंसी',stat1:'भाषा',stat2:'राज्य',stat3:'SOS',stat4:'उपलब्ध',sec_title:'सब सेवा',fc1_title:'लच्छन जांचक',fc1_desc:'बोल के या टाइप करके बताईं।',fc1_cta:'बात शुरू',fc2_title:'अस्पताल खोजीं',fc2_desc:'सरकारी अस्पताल।',fc2_cta:'अब्बे',fc3_title:'दवाई जानकारी',fc3_desc:'खुराक, नुकसान।',fc3_cta:'खोजीं',fc4_title:'इमर्जेंसी',fc4_desc:'हेल्पलाइन।',fc4_cta:'देखीं',prx_title:'पर्चा पाठक',prx_desc:'अपलोड — AI समझाई',disclaimer:'AarogyaBot साधारण जानकारी।',footer_copy:'AarogyaBot साधारण जानकारी। डाक्टर से मिलीं।',lbl_language:'भाषा',lbl_theme:'थीम',pg_chat_title:'लच्छन जांचक',pg_chat_sub:'AI',pg_hosp_title:'सरकारी अस्पताल',pg_hosp_sub:'राज्य आ जिला',pg_med_title:'दवाई जानकारी',pg_med_sub:'खुराक, उपयोग',pg_emg_title:'इमर्जेंसी',pg_emg_sub:'24/7',pg_prx_title:'पर्चा',pg_prx_sub:'अपलोड करीं',install_title:'AarogyaBot इंस्टॉल',install_ios:'Share टैप',install_android:'मेनू (⋮) टैप',install_close:'समझ गइनी'},
  ks:{nav_home:'گھر',nav_chat:'علامات',nav_hospitals:'ہسپتال',nav_medicines:'دوایہ',nav_sos:'ہنگامی',nav_prx:'نسخہ',hero_kicker:'مفت · AI · 24/7',hero_h1:'<b>تُہُنزِ زبانَس</b> صحت رہنمائی',hero_sub:'علامات دِتھ، ہسپتال لبتھ — بالکل مفت۔',btn_chat:'علامات جانچِتھ',btn_hosp:'ہسپتال لبتھ',btn_emg:'ہنگامی',stat1:'زبانہ',stat2:'ریاست',stat3:'SOS',stat4:'دستیاب',sec_title:'سارِ خدمات',fc1_title:'علامات جانچ',fc1_desc:'بولِتھ یا ٹایپ کرِتھ۔',fc1_cta:'چٲت',fc2_title:'ہسپتال لبتھ',fc2_desc:'سرکاری ہسپتال۔',fc2_cta:'لبتھ',fc3_title:'دوایہ معلومات',fc3_desc:'استعمال، مقدار۔',fc3_cta:'لبتھ',fc4_title:'ہنگامی',fc4_desc:'ہیلپ لایِن۔',fc4_cta:'ونتھ',prx_title:'نسخہ پاٹھک',prx_desc:'نسخہ اپلوڈ — AI بوزِنَوتھ',disclaimer:'AarogyaBot عام معلومات۔',footer_copy:'AarogyaBot عام معلومات۔ ڈاکٹر کنِ وچھِتھ۔',lbl_language:'زبان',lbl_theme:'تھیم',pg_chat_title:'علامات جانچ',pg_chat_sub:'AI',pg_hosp_title:'سرکاری ہسپتال',pg_hosp_sub:'ریاست تہ ضلع',pg_med_title:'دوایہ',pg_med_sub:'مقدار، استعمال',pg_emg_title:'ہنگامی',pg_emg_sub:'24/7',pg_prx_title:'نسخہ',pg_prx_sub:'اپلوڈ کرِتھ',install_title:'AarogyaBot نصب',install_ios:'Share ٹیپ',install_android:'مینو (⋮) ٹیپ',install_close:'سمجھ گیوم'},
  sd:{nav_home:'گهر',nav_chat:'علامتن جي جاچ',nav_hospitals:'اسپتال',nav_medicines:'دوائون',nav_sos:'هنگامي',nav_prx:'نسخو',hero_kicker:'مفت · AI · 24/7',hero_h1:'<b>توهانجي ٻوليءَ ۾</b> صحت رهنمائي',hero_sub:'علامتون ٻڌايو، اسپتال ڳوليو — مڪمل مفت۔',btn_chat:'علامتون چيڪ ڪريو',btn_hosp:'اسپتال ڳوليو',btn_emg:'هنگامي',stat1:'ٻوليون',stat2:'رياستون',stat3:'SOS',stat4:'دستياب',sec_title:'سڀ خدمتون',fc1_title:'علامتن جي جاچ',fc1_desc:'ڳالهايو يا ٽائيپ ڪريو۔',fc1_cta:'ڳالهه ٻولهه',fc2_title:'اسپتال ڳوليو',fc2_desc:'سرڪاري اسپتال۔',fc2_cta:'ڳوليو',fc3_title:'دوائن جي معلومات',fc3_desc:'استعمال، مقدار۔',fc3_cta:'ڳوليو',fc4_title:'هنگامي',fc4_desc:'هيلپ لائنون۔',fc4_cta:'ڏسو',prx_title:'نسخو پڙهندڙ',prx_desc:'اپلوڊ ڪريو — AI سمجهائيندو',disclaimer:'AarogyaBot عام معلومات۔',footer_copy:'AarogyaBot عام معلومات۔ ڊاڪٽر سان ملو۔',lbl_language:'ٻولي',lbl_theme:'ٿيم',pg_chat_title:'علامتن جي جاچ',pg_chat_sub:'AI',pg_hosp_title:'سرکاري اسپتال',pg_hosp_sub:'رياست ۽ ضلعو',pg_med_title:'دوائن جي معلومات',pg_med_sub:'مقدار، استعمال',pg_emg_title:'هنگامي',pg_emg_sub:'24/7',pg_prx_title:'نسخو',pg_prx_sub:'اپلوڊ ڪريو',install_title:'AarogyaBot انسٽال',install_ios:'Share ٽيپ',install_android:'مينيو (⋮) ٽيپ',install_close:'سمجهيو'},
};

/* Language list — NO FLAGS, clean text only */
const LANG_LIST=[
  {code:'en',label:'English'},{code:'hi',label:'हिंदी'},{code:'bn',label:'বাংলা'},
  {code:'ta',label:'தமிழ்'},{code:'te',label:'తెలుగు'},{code:'mr',label:'मराठी'},
  {code:'gu',label:'ગુજરાતી'},{code:'kn',label:'ಕನ್ನಡ'},{code:'ml',label:'മലയാളം'},
  {code:'pa',label:'ਪੰਜਾਬੀ'},{code:'or',label:'ଓଡ଼ିଆ'},{code:'as',label:'অসমীয়া'},
  {code:'ur',label:'اردو'},{code:'ne',label:'नेपाली'},{code:'sa',label:'संस्कृतम्'},
  {code:'kok',label:'कोंकणी'},{code:'doi',label:'डोगरी'},{code:'mni',label:'মৈতৈলোন্'},
  {code:'sat',label:'ᱥᱟᱱᱛᱟᱲᱤ'},{code:'mai',label:'मैथिली'},{code:'bho',label:'भोजपुरी'},
  {code:'ks',label:'كٲشُر'},{code:'sd',label:'سنڌي'},
];

const SPEECH_LANGS={
  en:'en-IN',hi:'hi-IN',bn:'bn-IN',ta:'ta-IN',te:'te-IN',mr:'mr-IN',
  gu:'gu-IN',kn:'kn-IN',ml:'ml-IN',pa:'pa-IN',or:'or-IN',as:'as-IN',
  ur:'ur-IN',ne:'ne-NP',sa:'sa-IN',kok:'kok-IN',doi:'hi-IN',
  mni:'mni-IN',sat:'hi-IN',mai:'hi-IN',bho:'hi-IN',ks:'ur-IN',sd:'ur-IN',
};

const ICON_SPEAK='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>';
const ICON_STOP_SM='<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>';

let availableVoices=[];
function loadVoices(){availableVoices=window.speechSynthesis?window.speechSynthesis.getVoices():[];}
if('speechSynthesis' in window){loadVoices();window.speechSynthesis.onvoiceschanged=loadVoices;}
function getBestVoice(langCode){
  const speechLang=SPEECH_LANGS[langCode]||'en-IN';
  const langPrefix=speechLang.split('-')[0];
  let voice=availableVoices.find(v=>v.lang===speechLang);
  if(!voice)voice=availableVoices.find(v=>v.lang.startsWith(langPrefix));
  if(!voice&&langCode!=='en')voice=availableVoices.find(v=>v.lang==='en-IN');
  if(!voice)voice=availableVoices.find(v=>v.lang.startsWith('en'));
  return voice||null;
}

let currentLang=localStorage.getItem('ab_lang')||'en';

function applyLang(lang){
  currentLang=lang;
  localStorage.setItem('ab_lang',lang);
  const T=TRANSLATIONS[lang]||TRANSLATIONS.en;
  const FB=TRANSLATIONS.en;
  document.querySelectorAll('[data-t]').forEach(el=>{
    const key=el.getAttribute('data-t');
    const val=T[key]!==undefined?T[key]:FB[key];
    if(val!==undefined)el.innerHTML=val;
  });
  document.querySelectorAll('[data-tp]').forEach(el=>{
    const key=el.getAttribute('data-tp');
    const val=T[key]!==undefined?T[key]:FB[key];
    if(val!==undefined)el.placeholder=val;
  });
  document.querySelectorAll('.lang-select').forEach(s=>{s.value=lang;});
  if(typeof window.syncChatLang==='function')window.syncChatLang(lang);
}
function onLangChange(val){applyLang(val);}
function populateLangSelectors(){
  document.querySelectorAll('.lang-select').forEach(sel=>{
    sel.innerHTML=LANG_LIST.map(l=>`<option value="${l.code}">${l.label}</option>`).join('');
  });
}

/* ── SCROLL-IN ANIMATIONS ── */
function setupScrollAnim(){
  const els=document.querySelectorAll('.fc,.hcard,.tb,.ec');
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('anim-up'));return;}
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('anim-up');io.unobserve(en.target);}});
  },{threshold:.1});
  els.forEach(e=>io.observe(e));
}

/* ── TTS — SINGLE TOGGLE BUTTON (click to play, click again to stop) ── */
let currentUtterance=null,currentAudio=null;

function speak(textOrEnc,l,isEnc,btnEl){
  /* If the same button is already speaking, stop it */
  if(btnEl&&btnEl.classList.contains('speaking')){
    stopSpeak();
    return;
  }
  stopSpeak();
  const raw=isEnc?decodeURIComponent(textOrEnc):textOrEnc;
  const text=cleanTextForSpeech(raw);
  const lang=l||currentLang;

  if('speechSynthesis' in window){
    const voice=getBestVoice(lang);
    currentUtterance=new SpeechSynthesisUtterance(text.slice(0,300));
    currentUtterance.lang=SPEECH_LANGS[lang]||'en-IN';
    if(voice)currentUtterance.voice=voice;
    currentUtterance.rate=.88;
    currentUtterance.onend=()=>setSpeakingState(false,btnEl);
    currentUtterance.onerror=()=>setSpeakingState(false,btnEl);
    window.speechSynthesis.speak(currentUtterance);
    setSpeakingState(true,btnEl);
    return;
  }
  fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.slice(0,400),lang})})
    .then(r=>r.blob()).then(b=>{
      currentAudio=new Audio(URL.createObjectURL(b));
      currentAudio.onended=()=>setSpeakingState(false,btnEl);
      currentAudio.play();
      setSpeakingState(true,btnEl);
    }).catch(()=>{});
}

function setSpeakingState(isSpeaking,btnEl){
  /* Reset all tts buttons to speak icon */
  document.querySelectorAll('.tts-b').forEach(b=>{
    b.classList.remove('speaking');
    b.innerHTML=ICON_SPEAK;
    b.title='Play';
  });
  /* Set active button to stop icon */
  if(btnEl&&isSpeaking){
    btnEl.classList.add('speaking');
    btnEl.innerHTML=ICON_STOP_SM;
    btnEl.title='Stop';
  }
  /* Global stop buttons (in chat bar, popup bar, prescription) */
  document.querySelectorAll('.tts-stop-b,#globalTtsStop,#cpTtsStop,#rxStopBtn').forEach(b=>b.classList.toggle('show',isSpeaking));
}

function stopSpeak(){
  if('speechSynthesis' in window)window.speechSynthesis.cancel();
  if(currentAudio){currentAudio.pause();currentAudio.currentTime=0;currentAudio=null;}
  currentUtterance=null;
  setSpeakingState(false,null);
}

/* ── PWA INSTALL ── */
let deferredPrompt;
window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault();deferredPrompt=e;showInstallToast();});
function installApp(){
  dismissInstallToast();
  if(deferredPrompt){deferredPrompt.prompt();deferredPrompt.userChoice.then(()=>{deferredPrompt=null;});return;}
  showInstallModal();
}
function showInstallModal(){
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const modal=document.getElementById('installModalBg');if(!modal)return;
  const T=TRANSLATIONS[currentLang]||TRANSLATIONS.en;
  document.getElementById('installInstructions').innerHTML=isIOS?(T.install_ios||TRANSLATIONS.en.install_ios):(T.install_android||TRANSLATIONS.en.install_android);
  modal.classList.add('show');
}
function closeInstallModal(){document.getElementById('installModalBg').classList.remove('show');}
function showInstallToast(){
  if(sessionStorage.getItem('ab_install_dismissed'))return;
  if(window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone)return;
  document.getElementById('installToast')?.classList.add('show');
}
function dismissInstallToast(){
  document.getElementById('installToast')?.classList.remove('show');
  sessionStorage.setItem('ab_install_dismissed','1');
}
window.addEventListener('appinstalled',()=>dismissInstallToast());
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}

/* ── FLOATING CHAT POPUP ── */
let cpHist=[];
function toggleChatPopup(){
  const p=document.getElementById('chatPopup');if(!p)return;
  p.classList.toggle('open');
  document.getElementById('chatFab')?.classList.toggle('hide',p.classList.contains('open'));
}
async function sendCpMsg(){
  const inp=document.getElementById('cpInput');
  const txt=inp.value.trim();if(!txt)return;
  const body=document.getElementById('cpBody');
  inp.value='';
  const uDiv=document.createElement('div');uDiv.className='msg usr';
  uDiv.innerHTML=`<div class="m-av"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="m-bub">${txt.replace(/\n/g,'<br>')}</div>`;
  body.appendChild(uDiv);body.scrollTop=body.scrollHeight;
  const typ=document.createElement('div');typ.className='msg bot';typ.id='cpTyping';
  typ.innerHTML=`<div class="m-av"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/></svg></div><div class="typing-bub"><span class="td"></span><span class="td"></span><span class="td"></span></div>`;
  body.appendChild(typ);body.scrollTop=body.scrollHeight;
  try{
    const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:txt,history:cpHist,lang:currentLang})});
    const d=await r.json();
    document.getElementById('cpTyping')?.remove();
    const bDiv=document.createElement('div');bDiv.className='msg bot';
    const msgId='cp'+Date.now();
    bDiv.innerHTML=`<div class="m-av"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="10" rx="2"/></svg></div><div class="m-bub">${mdToHtml(d.reply)}<div class="m-foot"><button class="tts-b" id="${msgId}" onclick="speak('${encodeURIComponent(d.reply)}','${d.lang||currentLang}',1,document.getElementById('${msgId}'))" title="Play">${ICON_SPEAK}</button></div></div>`;
    body.appendChild(bDiv);body.scrollTop=body.scrollHeight;
    cpHist.push({role:'user',content:txt});cpHist.push({role:'assistant',content:d.reply});
  }catch(e){document.getElementById('cpTyping')?.remove();}
}

window.addEventListener('DOMContentLoaded',()=>{
  applyTheme(localStorage.getItem('ab_theme')||'dark');
  populateLangSelectors();
  applyLang(currentLang);
  setupScrollAnim();
  const yearEl=document.getElementById('copyYear');if(yearEl)yearEl.textContent=new Date().getFullYear();
  const cpInput=document.getElementById('cpInput');
  if(cpInput)cpInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendCpMsg();}});
  setTimeout(showInstallToast,2500);
// Dynamic welcome message based on language
const WELCOME = {
  hi: '<strong>नमस्ते! 🙏</strong> मैं <strong>AarogyaBot</strong> हूं — ग्रामीण भारत के लिए आपका मुफ्त AI स्वास्थ्य सहायक।<br><br>🎤 माइक बटन दबाएं और अपने लक्षण बोलें।<br>💬 या नीचे टाइप करें।',
  bn: '<strong>নমস্কার! 🙏</strong> আমি <strong>AarogyaBot</strong> — গ্রামীণ ভারতের জন্য আপনার বিনামূল্যে AI স্বাস্থ্য সহায়ক।<br><br>🎤 মাইক বোতাম চাপুন এবং আপনার লক্ষণ বলুন।<br>💬 বা নিচে টাইপ করুন।',
  ta: '<strong>வணக்கம்! 🙏</strong> நான் <strong>AarogyaBot</strong> — கிராமப்புற இந்தியாவிற்கான உங்கள் இலவச AI சுகாதார உதவியாளர்।<br><br>🎤 மைக் பொத்தானை அழுத்தி உங்கள் அறிகுறிகளை சொல்லுங்கள்।<br>💬 அல்லது கீழே தட்டச்சு செய்யுங்கள்।',
  te: '<strong>నమస్కారం! 🙏</strong> నేను <strong>AarogyaBot</strong> — గ్రామీణ భారతదేశం కోసం మీ ఉచిత AI ఆరోగ్య సహాయకుడు।<br><br>🎤 మైక్ బటన్ నొక్కి మీ లక్షణాలు చెప్పండి।<br>💬 లేదా క్రింద టైప్ చేయండి।',
  mr: '<strong>नमस्कार! 🙏</strong> मी <strong>AarogyaBot</strong> — ग्रामीण भारतासाठी तुमचा मोफत AI आरोग्य सहाय्यक।<br><br>🎤 मायक्रोफोन बटण दाबा आणि लक्षणे सांगा।<br>💬 किंवा खाली टाइप करा।',
  gu: '<strong>નમસ્તે! 🙏</strong> હું <strong>AarogyaBot</strong> — ગ્રામીણ ભારત માટે તમારો મફત AI સ્વાસ્થ્ય સહાયક।<br><br>🎤 માઇક બટન દબાવો અને તમારા લક્ષણો કહો।<br>💬 અથવા નીચે ટાઇપ કરો।',
  kn: '<strong>ನಮಸ್ಕಾರ! 🙏</strong> ನಾನು <strong>AarogyaBot</strong> — ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕಾಗಿ ನಿಮ್ಮ ಉಚಿತ AI ಆರೋಗ್ಯ ಸಹಾಯಕ।<br><br>🎤 ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಹೇಳಿ।<br>💬 ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ।',
  ml: '<strong>നമസ്കാരം! 🙏</strong> ഞാൻ <strong>AarogyaBot</strong> — ഗ്രാമീണ ഇന്ത്യയ്ക്കായുള്ള നിങ്ങളുടെ സൗജന്യ AI ആരോഗ്യ സഹായി।<br><br>🎤 മൈക്ക് ബട്ടൺ അമർത്തി നിങ്ങളുടെ ലക്ഷണങ്ങൾ പറയൂ।<br>💬 അല്ലെങ്കിൽ താഴെ ടൈപ്പ് ചെയ്യൂ।',
  pa: '<strong>ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! 🙏</strong> ਮੈਂ <strong>AarogyaBot</strong> ਹਾਂ — ਪੇਂਡੂ ਭਾਰਤ ਲਈ ਤੁਹਾਡਾ ਮੁਫ਼ਤ AI ਸਿਹਤ ਸਹਾਇਕ।<br><br>🎤 ਮਾਈਕ ਬਟਨ ਦਬਾਓ ਅਤੇ ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ।<br>💬 ਜਾਂ ਹੇਠਾਂ ਟਾਈਪ ਕਰੋ।',
  ne: '<strong>नमस्ते! 🙏</strong> म <strong>AarogyaBot</strong> हुँ — ग्रामीण भारतको लागि तपाईंको निःशुल्क AI स्वास्थ्य सहायक।<br><br>🎤 माइक बटन थिच्नुहोस् र आफ्ना लक्षणहरू भन्नुहोस्।<br>💬 वा तल टाइप गर्नुहोस्।',
  ur: '<strong>السلام علیکم! 🙏</strong> میں <strong>AarogyaBot</strong> ہوں — دیہی ہندوستان کے لیے آپ کا مفت AI صحت معاون۔<br><br>🎤 مائیک بٹن دبائیں اور اپنی علامات بتائیں۔<br>💬 یا نیچے ٹائپ کریں۔',
};
function updateWelcome(l){
  const el = document.getElementById('welcomeBubble');
  if(el && WELCOME[l]) el.innerHTML = WELCOME[l];
}
if(typeof currentLang !== 'undefined' && currentLang !== 'en') updateWelcome(currentLang);

// Also hook into syncChatLang so it updates on language change
const _origSyncChatLang = window.syncChatLang;
window.syncChatLang = function(newLang){
  if(_origSyncChatLang) _origSyncChatLang(newLang);
  updateWelcome(newLang);
};
);
