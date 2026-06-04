function previewImage(input) {
  const preview = document.getElementById("preview");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function diagnoseImage() {
  const description = document.getElementById("description").value || "Crop looks diseased";
  const resultCard = document.getElementById("result-card");
  const typingEl = document.getElementById("diag-typing");
  const resultEl = document.getElementById("diagnosis-result");

  resultCard.style.display = "block";
  typingEl.style.display = "block";
  resultEl.innerHTML = "";

  fetch("/diagnose_crop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, lang: "English" })
  })
  .then(r => r.json())
  .then(data => {
    typingEl.style.display = "none";
    resultEl.innerHTML = data.diagnosis.replace(/\n/g, "<br>");
  })
  .catch(() => {
    typingEl.style.display = "none";
    resultEl.innerHTML = "❌ Could not diagnose. Please try again.";
  });
}  
