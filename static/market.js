let userState = '';

window.onload = () => detectLocationAndLoad();

function detectLocationAndLoad() {
    document.getElementById("market-body").innerHTML = "<tr><td colspan='7' style='text-align:center;padding:20px'>📍 Detecting your location...</td></tr>";
    fetch("https://ipapi.co/json/")
        .then(r => r.json())
        .then(data => {
            userState = data.region || '';
            document.getElementById("search-state").value = userState;
            loadMarket(userState, '');
        })
        .catch(() => loadMarket('', ''));
}

function searchMarket() {
    const state = document.getElementById("search-state").value;
    const commodity = document.getElementById("search-commodity").value;
    loadMarket(state, commodity);
}

function loadMarket(state, commodity) {
    document.getElementById("market-body").innerHTML = "<tr><td colspan='7' style='text-align:center;padding:20px'>⏳ Loading...</td></tr>";

    // Try live API from browser first
    const apiKey = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
    let url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=20`;
    if (state) url += `&filters[state]=${encodeURIComponent(state)}`;
    if (commodity) url += `&filters[commodity]=${encodeURIComponent(commodity)}`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            if (data.records && data.records.length > 0) {
                renderTable(data.records);
                renderChart(data.records);
                document.querySelector(".page-title p").textContent = "✅ Live prices from Agmarknet";
            } else {
                loadFallback(state, commodity);
            }
        })
        .catch(() => loadFallback(state, commodity));
}

function loadFallback(state, commodity) {
    fetch("/get_market", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({state, commodity})
    })
    .then(r => r.json())
    .then(data => {
        renderTable(data.data);
        renderChart(data.data);
        document.querySelector(".page-title p").textContent = "⚠️ Showing latest available data";
    })
    .catch(() => {
        document.getElementById("market-body").innerHTML = "<tr><td colspan='7' style='text-align:center'>❌ Failed to load</td></tr>";
    });
}

function getTrend(min, max) {
    const diff = parseFloat(max) - parseFloat(min);
    if (diff > 1000) return {label: "🟢 High Demand", cls: "trend-high"};
    if (diff > 400) return {label: "🟡 Stable", cls: "trend-stable"};
    return {label: "🔴 Low Demand", cls: "trend-low"};
}

function renderTable(records) {
    let html = '';
    records.forEach(r => {
        const min = r.min_price || r["Min Price"] || 0;
        const max = r.max_price || r["Max Price"] || 0;
        const modal = r.modal_price || r["Modal Price"] || 0;
        const state = r.state || r.State || '';
        const market = r.market || r.Market || '';
        const commodity = r.commodity || r.Commodity || '';
        const trend = getTrend(min, max);
        html += `
            <tr class="${trend.cls}">
                <td>${state}</td>
                <td>${market}</td>
                <td><strong>${commodity}</strong></td>
                <td>₹${min}</td>
                <td>₹${max}</td>
                <td><strong>₹${modal}</strong></td>
                <td>${trend.label}</td>
            </tr>`;
    });
    document.getElementById("market-body").innerHTML = html;
}

function renderChart(records) {
    const labels = records.map(r => r.commodity || r.Commodity || '');
    const prices = records.map(r => parseFloat(r.modal_price || r["Modal Price"] || 0));
    const canvas = document.getElementById("market-chart");
    if (!canvas) return;
    if (window.marketChart) window.marketChart.destroy();
    window.marketChart = new Chart(canvas.getContext("2d"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Modal Price (₹/quintal)",
                data: prices,
                backgroundColor: prices.map(p => p > 5000 ? "rgba(46,213,115,0.85)" : p > 2000 ? "rgba(255,165,0,0.85)" : "rgba(255,71,87,0.85)"),
                borderRadius: 10,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {display: true},
                tooltip: {callbacks: {label: ctx => `₹${ctx.raw}/quintal`}}
            },
            scales: {y: {beginAtZero: true, ticks: {callback: val => `₹${val}`}}}
        }
    });
}
