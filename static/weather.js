let userLat = null;
let userLon = null;
let currentWeather = {};
let selectedLang = 'English';

window.onload = () => {
  getLocation();
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        document.getElementById("location-text").textContent = `${userLat.toFixed(2)}, ${userLon.toFixed(2)}`;
        fetchWeather();
      },
      error => {
        document.getElementById("location-text").textContent = "Location access denied";
        loadDefaultWeather();
      }
    );
  } else {
    loadDefaultWeather();
  }
}

function loadDefaultWeather() {
  userLat = 28.6139;
  userLon = 77.2090;
  fetchWeather();
}

function fetchWeather() {
  fetch("/get_weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat: userLat, lon: userLon })
  })
  .then(r => r.json())
  .then(data => {
    currentWeather = data.current;
    document.getElementById("location-text").textContent = `📍 ${data.current.city}`;
    renderWeather(data.current);
    renderForecast(data.forecast);
    fetchRecommendation(data.current);
  })
  .catch(err => {
    document.getElementById("weather-card").innerHTML = "❌ Could not load weather.";
  });
}

function renderWeather(w) {
  document.getElementById("weather-card").innerHTML = `
    <div class="weather-main">
      <img src="https://openweathermap.org/img/wn/${w.icon}@2x.png" alt="weather"/>
      <div class="weather-temp">${Math.round(w.temp)}°C</div>
      <div class="weather-desc">${w.description}</div>
      <div class="weather-city">${w.city}</div>
    </div>
    <div class="weather-stats">
      <div class="stat">💧 ${w.humidity}%<br><small>Humidity</small></div>
      <div class="stat">💨 ${w.wind} m/s<br><small>Wind</small></div>
    </div>
  `;
}

function renderForecast(forecast) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = '';
  forecast.forEach(f => {
    const date = new Date(f.date);
    const day = days[date.getDay()];
    html += `
      <div class="forecast-card">
        <div class="forecast-day">${day}</div>
        <img src="https://openweathermap.org/img/wn/${f.icon}.png" alt="icon"/>
        <div class="forecast-temp">${Math.round(f.temp)}°C</div>
        <div class="forecast-desc">${f.description}</div>
      </div>
    `;
  });
  document.getElementById("forecast-grid").innerHTML = html;
}

function fetchRecommendation(weather) {
  fetch("/get_recommendation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat: userLat, lon: userLon, weather, lang: selectedLang })
  })
  .then(r => r.json())
  .then(data => {
    document.getElementById("recommendation-card").innerHTML = `
      <div class="rec-text">${data.recommendation.replace(/\n/g, '<br>')}</div>
    `;
  })
  .catch(() => {
    document.getElementById("recommendation-card").innerHTML = "❌ Could not load recommendations.";
  });
} 
