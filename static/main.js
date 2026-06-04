let selectedLang = 'English';
let selectedCrop = '';
let selectedProblem = '';

// Auto highlight English on page load
window.addEventListener('load', () => {
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    if (btn.getAttribute('onclick').includes('English')) {
      btn.classList.add('selected');
    }
  });
  checkReady();
});

function selectLang(el, lang) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedLang = lang;
  checkReady();
}

function selectCrop(el, crop) {
  document.querySelectorAll('.crop-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedCrop = crop;
  checkReady();
}

function selectProblem(el, problem) {
  document.querySelectorAll('.problem-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedProblem = problem;
  checkReady();
}

function checkReady() {
  const btn = document.getElementById('go-btn');
  if (btn) {
    btn.disabled = !(selectedLang && selectedCrop && selectedProblem);
  }
}

function goToChat() {
  window.location.href = `/chat?lang=${selectedLang}&crop=${selectedCrop}&problem=${selectedProblem}`;
}

function changeLanguage(lang) {
  selectedLang = lang;
}

function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}
