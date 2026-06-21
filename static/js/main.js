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
};
const LANG_LIST=[
  {code:'en',label:'🇬🇧 English'},{code:'hi',label:'🇮🇳 हिंदी'},{code:'bn',label:'🇧🇩 বাংলা'},
  {code:'ta',label:'🇮🇳 தமிழ்'},{code:'te',label:'🇮🇳 తెలుగు'},{code:'mr',label:'🇮🇳 मराठी'},
  {code:'gu',label:'🇮🇳 ગુજરાતી'},{code:'kn',label:'🇮🇳 ಕನ್ನಡ'},{code:'ml',label:'🇮🇳 മലയാളം'},
  {code:'pa',label:'🇮🇳 ਪੰਜਾਬੀ'},{code:'or',label:'🇮🇳 ଓଡ଼ିଆ'},{code:'ur',label:'🇵🇰 اردو'},
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
    currentUtterance.lang = {hi:'hi-IN',bn:'bn-IN',ta:'ta-IN',te:'te-IN',en:'en-US'}[l] || 'en-US';
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
  const stopBtn = document.getElementById('globalTtsStop');
  if(stopBtn) stopBtn.classList.toggle('show', isSpeaking);
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
  document.querySelectorAll('#installBtn').forEach(b=>b.style.display='flex');
});

function installApp(){
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(()=>{
      deferredPrompt = null;
      document.querySelectorAll('#installBtn').forEach(b=>b.style.display='none');
    });
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

window.addEventListener('appinstalled',()=>{
  document.querySelectorAll('#installBtn').forEach(b=>b.style.display='none');
});

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{ navigator.serviceWorker.register('/sw.js').catch(()=>{}); });
}

window.addEventListener('DOMContentLoaded', ()=>{
  applyTheme(localStorage.getItem('ab_theme') || 'dark');
  populateLangSelectors();
  applyLang(currentLang);
  setupScrollAnim();

  const yearEl = document.getElementById('copyYear');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  setTimeout(()=>{
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if(!isStandalone){
      document.querySelectorAll('#installBtn').forEach(b=>b.style.display='flex');
    }
  }, 1500);
});
