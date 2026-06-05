let userLat = null;
let userLon = null;
let currentWeather = {};
let selectedLang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('selectedLanguage') || 'English';
window.onload = () => {
  getLocation();
};

function getLocation() {
  document.getElementById("location-text").textContent = "Detecting location...";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        fetchWeather();
      },
      error => {
        // GPS denied — fallback to IP location
        fetch("https://ipapi.co/json/")
          .then(r => r.json())
          .then(data => {
            userLat = data.latitude;
            userLon = data.longitude;
            document.getElementById("location-text").textContent = data.city + ", " + data.region;
            fetchWeather();
          })
          .catch(() => {
            // Final fallback — Delhi
            userLat = 28.6139;
            userLon = 77.2090;
            fetchWeather();
          });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    // Browser doesn't support geolocation
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        userLat = data.latitude;
        userLon = data.longitude;
        fetchWeather();
      })
      .catch(() => {
        userLat = 28.6139;
        userLon = 77.2090;
        fetchWeather();
      });
  }
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
    document.getElementById("location-text").textContent = "📍 " + data.current.city;
    renderWeather(data.current);
    renderForecast(data.forecast);
    fetchRecommendation(data.current);
  })
  .catch(err => {
    document.getElementById("weather-card").innerHTML = `
      <div style="color:white;text-align:center;padding:20px">
        ❌ Could not load weather. Check your API key.
      </div>`;
  });
}

function renderWeather(w) {
  document.getElementById("weather-card").innerHTML = `
    <div class="weather-main">
      <img src="https://openweathermap.org/img/wn/${w.icon}@2x.png" alt="weather"/>
      <div class="weather-info">
        <div class="weather-temp">${Math.round(w.temp)}°C</div>
        <div class="weather-desc">${w.description}</div>
        <div class="weather-city">${w.city}</div>
      </div>
    </div>
    <div class="weather-stats">
      <div class="stat">
        <div class="stat-val">💧 ${w.humidity}%</div>
        <div class="stat-label">Humidity</div>
      </div>
      <div class="stat">
        <div class="stat-val">💨 ${w.wind} m/s</div>
        <div class="stat-label">Wind Speed</div>
      </div>
      <div class="stat">
        <div class="stat-val">🌡️ ${Math.round(w.temp)}°C</div>
        <div class="stat-label">Temperature</div>
      </div>
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
      </div>`;
  });
  document.getElementById("forecast-grid").innerHTML = html;
}

function fetchRecommendation(weather) {
  fetch("/get_recommendation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      lat: userLat, 
      lon: userLon, 
      weather, 
      lang: selectedLang  // ✅ this should already be Bengali
    })
  })
  .then(r => r.json())
  .then(data => {
    document.getElementById("recommendation-card").innerHTML = `
      <div class="rec-text">${data.recommendation.replace(/\n/g, '<br>')}</div>`;
  })
  .catch(() => {
    document.getElementById("recommendation-card").innerHTML = "❌ Could not load recommendations.";
  });
}
