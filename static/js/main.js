/* ── NAV ── */
function toggleNav(){document.getElementById('drawer').classList.toggle('open')}
function closeNav(){document.getElementById('drawer').classList.remove('open')}
document.addEventListener('click',function(e){
  const d=document.getElementById('drawer');
  const h=document.querySelector('.nav-ham');
  if(d&&h&&!d.contains(e.target)&&!h.contains(e.target))d.classList.remove('open');
});

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
    pg_chat_title:'Symptom Checker',pg_chat_sub:'Voice or text · Auto language · AI-powered',
    pg_hosp_title:'Find Government Hospital',pg_hosp_sub:'Select your state and district',
    pg_med_title:'Medicine Information',pg_med_sub:'Dosage, uses, side effects and affordable alternatives',
    pg_emg_title:'Emergency Contacts',pg_emg_sub:'Free helplines, available 24/7 — tap to call',
    lbl_language:'Language',lbl_severity:'Severity',lbl_settings:'Settings',
    lbl_actions:'Actions',lbl_tip:'Health Tip',lbl_recent:'Recent',
    lbl_body:'Body Area',lbl_common:'Common',lbl_sos:'Quick SOS',
    sv_mild:'Mild',sv_mod:'Moderate',sv_high:'Severe',
    tog_voice:'Speak replies',tog_send:'Auto-send voice',tog_sug:'Suggestions',
    act_copy:'Copy chat',act_dl:'Download',act_share:'Share',act_clear:'Clear chat',
    quick_fever:'Fever',quick_stomach:'Stomach',quick_cough:'Cough',
    quick_chest:'Chest',quick_rash:'Rash',quick_fatigue:'Fatigue',quick_back:'Back pain',quick_bp:'High BP',
    bp_head:'Head',bp_chest:'Chest',bp_stomach:'Stomach',bp_throat:'Throat',
    bp_legs:'Legs',bp_skin:'Skin',bp_eyes:'Eyes',bp_ears:'Ears',
    sym1:'High Fever',sym2:'Headache',sym3:'Diarrhoea',sym4:'High BP',sym5:'Sugar',sym6:'Anxiety',sym7:'Cold',sym8:'UTI',
    sos_amb:'108 — Ambulance',sos_nat:'112 — Emergency',sos_hl:'104 — Health Line',
    med_placeholder:'Enter medicine — e.g. Paracetamol, Metformin…',
    med_search:'Search',med_common:'Common medicines',
    hosp_state:'State',hosp_district:'District',
    hosp_sel_state:'— Select your state —',hosp_sel_dist:'— Select district —',
    call_btn:'Call',
    emg_title:'Life-threatening emergency?',
    emg_sub:'Call 108 — free ambulance, all India, 24/7',
    emg_tap:'Tap to call',
    tip_save:'Save 108 and 112 right now. They work without balance on any network.',
    welcome:'Hello! I\'m AarogyaBot — your free AI health assistant. Speak or type your symptoms. I understand Hindi, Bengali and English.',
    listening:'Listening… speak your symptoms',
    stop_voice:'Stop',
    placeholder_chat:'Type symptoms… / बोलें या लिखें…',
    sug_label:'Ask next:',
    footer_copy:'AarogyaBot provides general health guidance only. Always consult a qualified doctor.',
    state_select_hosp:'Select your state and district to find hospitals',
    state_select_dist:'Now select your district',
    speak:'Speak',stop:'Stop',
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
    pg_chat_title:'लक्षण जांचक',pg_chat_sub:'आवाज़ या टेक्स्ट · भाषा स्वतः · AI संचालित',
    pg_hosp_title:'सरकारी अस्पताल खोजें',pg_hosp_sub:'राज्य और जिला चुनें',
    pg_med_title:'दवाई जानकारी',pg_med_sub:'खुराक, उपयोग, साइड इफेक्ट और सस्ते विकल्प',
    pg_emg_title:'आपातकालीन संपर्क',pg_emg_sub:'मुफ्त हेल्पलाइन, 24/7 उपलब्ध — टैप करके कॉल करें',
    lbl_language:'भाषा',lbl_severity:'गंभीरता',lbl_settings:'सेटिंग्स',
    lbl_actions:'कार्य',lbl_tip:'स्वास्थ्य सुझाव',lbl_recent:'हाल के',
    lbl_body:'शरीर का हिस्सा',lbl_common:'सामान्य',lbl_sos:'त्वरित SOS',
    sv_mild:'हल्का',sv_mod:'मध्यम',sv_high:'गंभीर',
    tog_voice:'जवाब सुनें',tog_send:'आवाज़ ऑटो-भेजें',tog_sug:'सुझाव',
    act_copy:'चैट कॉपी',act_dl:'डाउनलोड',act_share:'शेयर',act_clear:'चैट साफ़',
    quick_fever:'बुखार',quick_stomach:'पेट दर्द',quick_cough:'खांसी',
    quick_chest:'सीने का दर्द',quick_rash:'चकत्ते',quick_fatigue:'थकान',quick_back:'पीठ दर्द',quick_bp:'बीपी',
    bp_head:'सिर',bp_chest:'सीना',bp_stomach:'पेट',bp_throat:'गला',
    bp_legs:'पैर',bp_skin:'त्वचा',bp_eyes:'आंखें',bp_ears:'कान',
    sym1:'तेज़ बुखार',sym2:'सिरदर्द',sym3:'दस्त',sym4:'हाई बीपी',sym5:'शुगर',sym6:'चिंता',sym7:'जुकाम',sym8:'UTI',
    sos_amb:'108 — एम्बुलेंस',sos_nat:'112 — आपातकाल',sos_hl:'104 — हेल्थ लाइन',
    med_placeholder:'दवाई का नाम — जैसे पैरासिटामोल, मेटफॉर्मिन…',
    med_search:'खोजें',med_common:'सामान्य दवाइयां',
    hosp_state:'राज्य',hosp_district:'जिला',
    hosp_sel_state:'— राज्य चुनें —',hosp_sel_dist:'— जिला चुनें —',
    call_btn:'कॉल',
    emg_title:'जानलेवा आपातकाल?',
    emg_sub:'108 पर कॉल करें — मुफ्त एम्बुलेंस, 24/7 उपलब्ध',
    emg_tap:'टैप करके कॉल करें',
    tip_save:'अभी 108 और 112 सेव करें। ये बिना बैलेंस के भी काम करते हैं।',
    welcome:'नमस्ते! मैं AarogyaBot हूं। आवाज़ से या टाइप करके अपने लक्षण बताएं। मैं हिंदी, बंगाली और अंग्रेजी समझता हूं।',
    listening:'सुन रहा हूं… लक्षण बोलें',
    stop_voice:'रोकें',
    placeholder_chat:'लक्षण लिखें या बोलें…',
    sug_label:'अगला सवाल:',
    footer_copy:'AarogyaBot केवल सामान्य स्वास्थ्य जानकारी देता है। हमेशा डॉक्टर से मिलें।',
    state_select_hosp:'राज्य और जिला चुनकर अस्पताल खोजें',
    state_select_dist:'अब जिला चुनें',
    speak:'सुनें',stop:'रोकें',
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
    pg_chat_title:'লক্ষণ পরীক্ষক',pg_chat_sub:'কণ্ঠ বা টেক্সট · স্বয়ংক্রিয় ভাষা · AI-চালিত',
    pg_hosp_title:'সরকারি হাসপাতাল খুঁজুন',pg_hosp_sub:'রাজ্য ও জেলা নির্বাচন করুন',
    pg_med_title:'ওষুধ তথ্য',pg_med_sub:'ডোজ, ব্যবহার, পার্শ্বপ্রতিক্রিয়া ও বিকল্প',
    pg_emg_title:'জরুরি যোগাযোগ',pg_emg_sub:'বিনামূল্যে হেল্পলাইন, ২৪/৭ — ট্যাপ করে কল',
    lbl_language:'ভাষা',lbl_severity:'তীব্রতা',lbl_settings:'সেটিংস',
    lbl_actions:'কার্যাবলি',lbl_tip:'স্বাস্থ্য পরামর্শ',lbl_recent:'সাম্প্রতিক',
    lbl_body:'শরীরের অংশ',lbl_common:'সাধারণ',lbl_sos:'দ্রুত SOS',
    sv_mild:'হালকা',sv_mod:'মাঝারি',sv_high:'গুরুতর',
    tog_voice:'উত্তর শুনুন',tog_send:'কণ্ঠ অটো-পাঠান',tog_sug:'পরামর্শ',
    act_copy:'চ্যাট কপি',act_dl:'ডাউনলোড',act_share:'শেয়ার',act_clear:'চ্যাট মুছুন',
    quick_fever:'জ্বর',quick_stomach:'পেটব্যথা',quick_cough:'কাশি',
    quick_chest:'বুকব্যথা',quick_rash:'র‍্যাশ',quick_fatigue:'ক্লান্তি',quick_back:'পিঠব্যথা',quick_bp:'বিপি',
    bp_head:'মাথা',bp_chest:'বুক',bp_stomach:'পেট',bp_throat:'গলা',
    bp_legs:'পা',bp_skin:'চামড়া',bp_eyes:'চোখ',bp_ears:'কান',
    sym1:'তীব্র জ্বর',sym2:'মাথাব্যথা',sym3:'ডায়রিয়া',sym4:'হাই বিপি',sym5:'সুগার',sym6:'উদ্বেগ',sym7:'ঠান্ডা',sym8:'ইউটিআই',
    sos_amb:'108 — অ্যাম্বুলেন্স',sos_nat:'112 — জরুরি',sos_hl:'104 — স্বাস্থ্য লাইন',
    med_placeholder:'ওষুধের নাম — যেমন প্যারাসিটামল, মেটফর্মিন…',
    med_search:'খুঁজুন',med_common:'সাধারণ ওষুধ',
    hosp_state:'রাজ্য',hosp_district:'জেলা',
    hosp_sel_state:'— রাজ্য নির্বাচন করুন —',hosp_sel_dist:'— জেলা নির্বাচন করুন —',
    call_btn:'কল',
    emg_title:'জীবনঘাতী জরুরি অবস্থা?',
    emg_sub:'108 কল করুন — বিনামূল্যে অ্যাম্বুলেন্স, সর্বত্র, ২৪/৭',
    emg_tap:'ট্যাপ করে কল করুন',
    tip_save:'এখনই 108 ও 112 সেভ করুন। এগুলো ব্যালেন্স ছাড়াও কাজ করে।',
    welcome:'নমস্কার! আমি AarogyaBot। কথা বলুন বা টাইপ করুন আপনার লক্ষণ। আমি হিন্দি, বাংলা ও ইংরেজি বুঝি।',
    listening:'শুনছি… লক্ষণ বলুন',
    stop_voice:'থামুন',
    placeholder_chat:'লক্ষণ লিখুন বা বলুন…',
    sug_label:'পরবর্তী প্রশ্ন:',
    footer_copy:'AarogyaBot শুধু সাধারণ স্বাস্থ্য তথ্য দেয়। সর্বদা ডাক্তারের পরামর্শ নিন।',
    state_select_hosp:'রাজ্য ও জেলা নির্বাচন করে হাসপাতাল খুঁজুন',
    state_select_dist:'এখন জেলা নির্বাচন করুন',
    speak:'শুনুন',stop:'থামুন',
  },
};

let currentLang = localStorage.getItem('ab_lang') || 'en';

function applyLang(lang){
  currentLang = lang;
  localStorage.setItem('ab_lang', lang);
  const T = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-t]').forEach(el=>{
    const key = el.getAttribute('data-t');
    if(T[key] !== undefined) el.innerHTML = T[key];
  });
  document.querySelectorAll('[data-tp]').forEach(el=>{
    const key = el.getAttribute('data-tp');
    if(T[key] !== undefined) el.placeholder = T[key];
  });
  // sync all lang selectors
  document.querySelectorAll('.lang-select').forEach(s=>{ s.value = lang; });
}

function onLangChange(val){ applyLang(val); }

window.addEventListener('DOMContentLoaded', ()=>{
  applyLang(currentLang);
});
JSEOF
echo "JS done"