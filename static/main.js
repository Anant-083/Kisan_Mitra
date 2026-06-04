let selectedLang = 'English';
let selectedCrop = '';
let selectedProblem = '';

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
  btn.disabled = !(selectedLang && selectedCrop && selectedProblem);
}

function goToChat() {
  window.location.href = `/chat?lang=${selectedLang}&crop=${selectedCrop}&problem=${selectedProblem}`;
}

function changeLanguage(lang) {
  selectedLang = lang;
  fetch("/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: document.body.innerText, lang })
  })
  .then(r => r.json())
  .then(data => {
    console.log("Language changed to:", lang);
  });
} 
