function previewImage(input) {
  const preview = document.getElementById("preview");
  const uploadArea = document.getElementById("upload-area");
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = "block";
      if (uploadArea) uploadArea.style.display = "none"; // Hides upload box for clean preview
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function diagnoseImage() {
  const fileInput = document.getElementById("crop-image");
  const description = document.getElementById("description").value;
  const resultCard = document.getElementById("result-card");
  const typingEl = document.getElementById("diag-typing");
  const resultEl = document.getElementById("diagnosis-result");

  // 1. Validation: Block requests if the user hasn't selected an image
  if (!fileInput || !fileInput.files[0]) {
    alert("Please select or capture an image first!");
    return;
  }

  resultCard.style.display = "block";
  typingEl.style.display = "block";
  resultEl.innerHTML = "";

  // 2. Read language preferences dynamically from localStorage, fallback to English
  const chosenLang = localStorage.getItem("selectedLanguage") || "English";

  // 3. Use FormData to handle both text fields and binary file uploads together
  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("description", description || "Crop looks diseased");
  formData.append("lang", chosenLang);

  // NOTE: Do NOT add a 'Content-Type' header here. 
  // Passing formData forces the browser to set multipart/form-data with the correct boundary automatically.
  fetch("/diagnose_crop", {
    method: "POST",
    body: formData
  })
  .then(r => r.json())
  .then(data => {
    typingEl.style.display = "none";
    if (data.success) {
      resultEl.innerHTML = data.diagnosis.replace(/\n/g, "<br>");
    } else {
      resultEl.innerHTML = `<span style="color:#d32f2f; font-weight:600;">❌ Error: ${data.error}</span>`;
    }
  })
  .catch((err) => {
    console.error("Diagnosis request trace error:", err);
    typingEl.style.display = "none";
    resultEl.innerHTML = "❌ Could not diagnose. Please check your connection and try again.";
  });
}
function openCamera() {
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile) {
    document.getElementById('camera-capture').click();
  } else {
    // Desktop — open file dialog instead
    document.getElementById('file-upload').click();
  }
}
