let selectedLang = window.appLang || new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('selectedLanguage') || 'English';
let selectedCrop = '';
let selectedProblem = '';

window.addEventListener('load', () => {
  // Auto select current language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.innerText.trim() === selectedLang || 
        btn.getAttribute('data-lang') === selectedLang) {
      btn.classList.add('selected');
    }
  });
  checkReady();
});

function selectLang(el, lang) {
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.remove('selected');
    b.style.background = '';
    b.style.borderColor = '';
    b.style.color = '';
  });
  el.classList.add('selected');
  el.style.background = 'linear-gradient(135deg, #d8f3dc, #b7e4c7)';
  el.style.borderColor = '#2d6a4f';
  el.style.color = '#2d6a4f';
  selectedLang = lang;
  localStorage.setItem('selectedLanguage', lang);
  checkReady();
}

function selectCrop(el, crop) {
  document.querySelectorAll('.crop-btn').forEach(b => {
    b.classList.remove('selected');
    b.style.background = '';
    b.style.borderColor = '';
  });
  el.classList.add('selected');
  el.style.background = 'linear-gradient(135deg, #d8f3dc, #b7e4c7)';
  el.style.borderColor = '#2d6a4f';
  selectedCrop = crop;
  checkReady();
}

function selectProblem(el, problem) {
  document.querySelectorAll('.problem-btn').forEach(b => {
    b.classList.remove('selected');
    b.style.background = '';
    b.style.borderColor = '';
  });
  el.classList.add('selected');
  el.style.background = 'linear-gradient(135deg, #fff8ec, #fde8b0)';
  el.style.borderColor = '#f4a716';
  selectedProblem = problem;
  checkReady();
}

function checkReady() {
  const btn = document.getElementById('go-btn');
  if (btn) btn.disabled = !(selectedCrop && selectedProblem);
}

function goToChat() {
  window.location.href = `/chat?lang=${selectedLang}&crop=${selectedCrop}&problem=${selectedProblem}`;
}

function changeLanguage(lang) {
  selectedLang = lang;
  localStorage.setItem('selectedLanguage', lang);
  window.location.href = '/?lang=' + lang;
}

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  if (menu) menu.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}
