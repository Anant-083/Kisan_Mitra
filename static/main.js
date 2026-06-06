let selectedLang = window.appLang || new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('selectedLanguage') || 'English';
let selectedCrop = '';
let selectedProblem = '';

window.addEventListener('load', () => {
  // Auto highlight current language
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      selectLang(this, lang);
    });
    if (btn.getAttribute('data-lang') === selectedLang) {
      btn.classList.add('selected');
    }
  });

  document.querySelectorAll('.crop-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const crop = this.getAttribute('data-crop');
      selectCrop(this, crop);
    });
  });

  document.querySelectorAll('.problem-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const problem = this.getAttribute('data-problem');
      selectProblem(this, problem);
    });
  });

  checkReady();
});

function selectLang(el, lang) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedLang = lang;
  localStorage.setItem('selectedLanguage', lang);
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
