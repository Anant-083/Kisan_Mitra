let userLat = null, userLon = null;
let selectedLang = window.appLang || new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('selectedLanguage') || 'English';

window.onload = () => getLocation();

function getLocation() {
  const locEl = document.getElementById('location-text');
  if (locEl) locEl.textContent = 'Detecting location...';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => { userLat = pos.coords.latitude; userLon = pos.coords.longitude; fetchWeather(); },
      () => fetchIPLocation()
    );
  } else { fetchIPLocation(); }
}

function fetchIPLocation() {
  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(d => { userLat = d.latitude; userLon = d.longitude; fetchWeather(); })
    .catch(() => { userLat = 28.6139; userLon = 77.2090; fetchWeather(); });
}

function fetchWeather() {
  fetch('/get_weather', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({lat: userLat, lon: userLon})
  })
  .then(r => r.json())
  .then(data => {
    const locEl = document.getElementById('location-text');
    if (locEl) locEl.textContent = '📍 ' + data.current.city;
    renderWeather(data.current);
    renderForecast(data.forecast);
    fetchRecommendation(data.current);
  })
  .catch(() => {
    const wc = document.getElementById('weather-card');
    if (wc) wc.innerHTML = '<div style="color:rgba(255,255,255,0.7);text-align:center;padding:20px">❌ Could not load weather</div>';
  });
}

function renderWeather(w) {
  const card = document.getElementById('weather-card');
  if (!card) return;
  card.innerHTML = `
    <div class="weather-top">
      <div class="weather-temp-block">
        <div class="weather-temp">${Math.round(w.temp)}°</div>
        <div class="weather-info-text">
          <div class="city">${w.city}</div>
          <div class="desc">${w.description}</div>
        </div>
      </div>
      <img class="weather-icon-img" src="https://openweathermap.org/img/wn/${w.icon}@2x.png" alt="weather"/>
    </div>
    <div class="weather-stats">
      <div class="w-stat">
        <div class="w-stat-val">💧 ${w.humidity}%</div>
        <div class="w-stat-label">Humidity</div>
      </div>
      <div class="w-stat">
        <div class="w-stat-val">💨 ${w.wind}m/s</div>
        <div class="w-stat-label">Wind</div>
      </div>
      <div class="w-stat">
        <div class="w-stat-val">🌡️ ${Math.round(w.feels_like)}°</div>
        <div class="w-stat-label">Feels Like</div>
      </div>
    </div>`;
}

function renderForecast(forecast) {
  const grid = document.getElementById('forecast-grid');
  if (!grid) return;
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = '';
  forecast.forEach(f => {
    const day = days[new Date(f.date).getDay()];
    html += `
      <div class="forecast-item">
        <div class="forecast-day">${day}</div>
        <img src="https://openweathermap.org/img/wn/${f.icon}.png" alt=""/>
        <div class="forecast-temp">${Math.round(f.temp)}°C</div>
        <div class="forecast-rain">${f.description}</div>
      </div>`;
  });
  grid.innerHTML = html;
}

function fetchRecommendation(weather) {
  fetch('/get_recommendation', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({lat: userLat, lon: userLon, weather, lang: selectedLang})
  })
  .then(r => r.json())
  .then(data => {
    const el = document.getElementById('recommendation-card');
    if (el) el.innerHTML = data.recommendation.replace(/\n/g, '<br>');
  })
  .catch(() => {
    const el = document.getElementById('recommendation-card');
    if (el) el.innerHTML = '❌ Could not load recommendations.';
  });
}
