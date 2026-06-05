window.onload = () => {
    const lang = localStorage.getItem('selectedLanguage') || 'English';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => fetchWeatherThenAlerts(pos.coords.latitude, pos.coords.longitude, lang),
            () => fetchIPThenAlerts(lang)
        );
    } else {
        fetchIPThenAlerts(lang);
    }
};

function fetchIPThenAlerts(lang) {
    fetch("https://ipapi.co/json/")
        .then(r => r.json())
        .then(data => fetchWeatherThenAlerts(data.latitude, data.longitude, lang))
        .catch(() => fetchWeatherThenAlerts(28.6139, 77.2090, lang));
}

function fetchWeatherThenAlerts(lat, lon, lang) {
    fetch("/get_weather", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({lat, lon})
    })
    .then(r => r.json())
    .then(data => fetchAlerts(data.current, lang))
    .catch(() => fetchAlerts({}, lang));
}

function fetchAlerts(weather, lang) {
    fetch("/get_alerts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({weather, lang})
    })
    .then(r => r.json())
    .then(data => renderAlerts(data.alerts))
    .catch(() => {
        document.getElementById("alerts-grid").innerHTML = `
            <div class="alert-item danger">
                <div class="alert-icon">❌</div>
                <div class="alert-body"><h4>Error</h4><p>Could not load alerts.</p></div>
            </div>`;
    });
}

function renderAlerts(text) {
    const lines = text.split('\n').filter(l => l.trim());
    let html = '';
    lines.forEach(line => {
        if (!line.trim()) return;
        let icon = '⚠️', cls = '';
        const l = line.toLowerCase();
        if (l.includes('danger') || l.includes('risk') || l.includes('harmful') || l.includes('avoid')) { icon = '🚨'; cls = 'danger'; }
        else if (l.includes('safe') || l.includes('good') || l.includes('best')) { icon = '✅'; cls = 'safe'; }
        else if (l.includes('pest') || l.includes('insect') || l.includes('fly')) { icon = '🐛'; }
        else if (l.includes('weather') || l.includes('rain') || l.includes('heat') || l.includes('temperature')) { icon = '🌦️'; }
        else if (l.includes('pesticide') || l.includes('chemical') || l.includes('spray')) { icon = '🧪'; }
        else if (l.includes('water') || l.includes('irrigat')) { icon = '💧'; }
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();
        html += `
            <div class="alert-item ${cls}">
                <div class="alert-icon">${icon}</div>
                <div class="alert-body"><p>${cleanLine}</p></div>
            </div>`;
    });
    document.getElementById("alerts-grid").innerHTML = html || `
        <div class="alert-item safe">
            <div class="alert-icon">✅</div>
            <div class="alert-body"><h4>All Clear</h4><p>No major alerts for your area.</p></div>
        </div>`;
}
