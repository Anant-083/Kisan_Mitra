window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherForAlerts(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeatherForAlerts(28.6139, 77.2090)
    );
  } else {
    fetchWeatherForAlerts(28.6139, 77.2090);
  }
};

function fetchWeatherForAlerts(lat, lon) {
  fetch("/get_weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lon })
  })
  .then(r => r.json())
  .then(data => fetchAlerts(data.current))
  .catch(() => fetchAlerts({}));
}

function fetchAlerts(weather) {
  fetch("/get_alerts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weather, lang: "English" })
  })
  .then(r => r.json())
  .then(data => renderAlerts(data.alerts))
  .catch(() => {
    document.getElementById("alerts-grid").innerHTML = `
      <div class="alert-item danger">
        <div class="alert-icon">❌</div>
        <div class="alert-body">
          <h4>Error</h4>
          <p>Could not load alerts. Please try again.</p>
        </div>
      </div>`;
  });
}

function renderAlerts(text) {
  const lines = text.split('\n').filter(l => l.trim());
  let html = '';

  lines.forEach(line => {
    if (!line.trim()) return;
    let icon = '⚠️';
    let cls = '';

    if (line.toLowerCase().includes('danger') || line.toLowerCase().includes('harmful') || line.toLowerCase().includes('risk')) {
      icon = '🚨'; cls = 'danger';
    } else if (line.toLowerCase().includes('safe') || line.toLowerCase().includes('good') || line.toLowerCase().includes('suitable')) {
      icon = '✅'; cls = 'safe';
    } else if (line.toLowerCase().includes('pest') || line.toLowerCase().includes('insect')) {
      icon = '🐛';
    } else if (line.toLowerCase().includes('weather') || line.toLowerCase().includes('rain') || line.toLowerCase().includes('temperature')) {
      icon = '🌦️';
    } else if (line.toLowerCase().includes('pesticide') || line.toLowerCase().includes('chemical')) {
      icon = '🧪';
    }

    html += `
      <div class="alert-item ${cls}">
        <div class="alert-icon">${icon}</div>
        <div class="alert-body">
          <p>${line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '')}</p>
        </div>
      </div>`;
  });

  document.getElementById("alerts-grid").innerHTML = html || `
    <div class="alert-item safe">
      <div class="alert-icon">✅</div>
      <div class="alert-body"><h4>All Clear</h4><p>No major alerts for your area right now.</p></div>
    </div>`;
}