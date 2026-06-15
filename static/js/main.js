let selectedLang = localStorage.getItem('selectedLanguage') || window.appLang || 'English';
let selectedCrop = '';
let selectedProblem = '';
let pendingLang = selectedLang;

// ── LANGUAGE MODAL ──
function openLangModal() {
  document.querySelectorAll('#lang-modal-grid .lang-option').forEach(opt => {
    opt.classList.remove('selected');
    if (opt.getAttribute('onclick').includes(`'${selectedLang}'`)) {
      opt.classList.add('selected');
    }
  });
  pendingLang = selectedLang;
  document.getElementById('lang-modal').classList.add('open');
}

function selectModalLang(el, lang) {
  document.querySelectorAll('#lang-modal-grid .lang-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  pendingLang = lang;
}

function confirmLang() {
  selectedLang = pendingLang;
  localStorage.setItem('selectedLanguage', selectedLang);
  document.getElementById('lang-modal').classList.remove('open');
  document.getElementById('nav-lang-label').textContent = selectedLang;
  // Sync advisory lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${selectedLang}'`)) {
      btn.classList.add('selected');
    }
  });
  // Redirect to apply language to weather/recommendation
  window.location.href = '/?lang=' + selectedLang;
}

// ── ADVISORY LANG BUTTONS ──
function selectLang(el, lang) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedLang = lang;
  localStorage.setItem('selectedLanguage', lang);
  document.getElementById('nav-lang-label').textContent = lang;
  checkReady();
}

// ── CROP SELECT ──
function selectCrop(el, crop) {
  document.querySelectorAll('.crop-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedCrop = crop;
  checkReady();
}

// ── PROBLEM SELECT ──
function selectProblem(el, problem) {
  document.querySelectorAll('.problem-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedProblem = problem;
  checkReady();
}

// ── CHECK READY ──
function checkReady() {
  const btn = document.getElementById('go-btn');
  if (btn) btn.disabled = !(selectedCrop && selectedProblem);
}

// ── GO TO CHAT ──
function goToChat() {
  if (!selectedCrop || !selectedProblem) return;
  window.location.href = `/chat?lang=${encodeURIComponent(selectedLang)}&crop=${encodeURIComponent(selectedCrop)}&problem=${encodeURIComponent(selectedProblem)}`;
}

// ── MOBILE MENU ──
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.getElementById('mobile-overlay').classList.toggle('open');
}

// ── INIT ──
window.addEventListener('load', () => {
  // Sync saved language on load
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${selectedLang}'`)) {
      btn.classList.add('selected');
    }
  });
  const navLabel = document.getElementById('nav-lang-label');
  if (navLabel) navLabel.textContent = selectedLang;
  checkReady();
});
