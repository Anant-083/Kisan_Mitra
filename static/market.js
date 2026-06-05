let userState = '';

window.onload = () => {
  detectLocationAndLoad();
};

function detectLocationAndLoad() {
  document.getElementById("market-body").innerHTML = "<tr><td colspan='7' style='text-align:center;padding:20px'>📍 Detecting your location...</td></tr>";

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        // Get state from coordinates using ipapi
        fetch(`https://ipapi.co/json/`)
          .then(r => r.json())
          .then(data => {
            userState = data.region || '';
            document.getElementById("search-state").value = userState;
            loadLiveMarket(userState, '');
          })
          .catch(() => loadLiveMarket('', ''));
      },
      error => {
        // GPS denied — use IP location
        fetch("https://ipapi.co/json/")
          .then(r => r.json())
          .then(data => {
            userState = data.region || '';
            document.getElementById("search-state").value = userState;
            loadLiveMarket(userState, '');
          })
          .catch(() => loadLiveMarket('', ''));
      }
    );
  } else {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        userState = data.region || '';
        document.getElementById("search-state").value = userState;
        loadLiveMarket(userState, '');
      })
      .catch(() => loadLiveMarket('', ''));
  }
}

function searchMarket() {
  const state = document.getElementById("search-state").value;
  const commodity = document.getElementById("search-commodity").value;
  loadLiveMarket(state, commodity);
}

function loadLiveMarket(state, commodity) {
  document.getElementById("market-body").innerHTML = "<tr><td colspan='7' style='text-align:center;padding:20px'>Loading...</td></tr>";

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
      document.querySelector(".page-title p").textContent = `✅ Live prices — ${state || 'All India'}`;
    } else {
      useFallback(state, commodity);
    }
  })
  .catch(() => useFallback(state, commodity));
}

function useFallback(state, commodity) {
  let data = getFallbackData();
  if (state) data = data.filter(r => r.state.toLowerCase().includes(state.toLowerCase()) || r.district.toLowerCase().includes(state.toLowerCase()));
  if (commodity) data = data.filter(r => r.commodity.toLowerCase().includes(commodity.toLowerCase()));
  if (data.length === 0) data = getFallbackData();
  renderTable(data);
  renderChart(data);
  document.querySelector(".page-title p").textContent = "⚠️ Showing cached data • Live API unavailable";
}

function getTrend(min, max) {
  const diff = parseFloat(max) - parseFloat(min);
  if (diff > 1000) return "🟢 High";
  if (diff > 500) return "🟡 Stable";
  return "🔴 Low";
}

function renderTable(records) {
  let html = '';
  records.forEach(r => {
    const minPrice = r.min_price || r["Min Price"] || 0;
    const maxPrice = r.max_price || r["Max Price"] || 0;
    const modalPrice = r.modal_price || r["Modal Price"] || 0;
    const state = r.state || r.State || '';
    const market = r.market || r.Market || '';
    const commodity = r.commodity || r.Commodity || '';
    const trend = getTrend(minPrice, maxPrice);
    const trendClass = trend.includes("High") ? "trend-high" :
                       trend.includes("Low") ? "trend-low" : "trend-stable";
    html += `
      <tr class="${trendClass}">
        <td>${state}</td>
        <td>${market}</td>
        <td>${commodity}</td>
        <td>₹${minPrice}</td>
        <td>₹${maxPrice}</td>
        <td>₹${modalPrice}</td>
        <td>${trend}</td>
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
  const ctx = canvas.getContext("2d");
  window.marketChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Modal Price (₹/quintal)",
        data: prices,
        backgroundColor: prices.map(p =>
          p > 5000 ? "rgba(46,213,115,0.8)" :
          p > 2000 ? "rgba(255,165,0,0.8)" :
          "rgba(255,71,87,0.8)"
        ),
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { callbacks: { label: ctx => `₹${ctx.raw}/quintal` } }
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: val => `₹${val}` } }
      }
    }
  });
}

function getFallbackData() {
  return [
    {"state": "Maharashtra", "district": "Pune", "market": "Pune", "commodity": "Tomato", "min_price": "800", "max_price": "1200", "modal_price": "1000"},
    {"state": "Punjab", "district": "Ludhiana", "market": "Ludhiana", "commodity": "Wheat", "min_price": "2000", "max_price": "2200", "modal_price": "2100"},
    {"state": "West Bengal", "district": "Kolkata", "market": "Kolkata", "commodity": "Rice", "min_price": "1800", "max_price": "2200", "modal_price": "2000"},
    {"state": "Uttar Pradesh", "district": "Lucknow", "market": "Lucknow", "commodity": "Potato", "min_price": "600", "max_price": "900", "modal_price": "750"},
    {"state": "Gujarat", "district": "Ahmedabad", "market": "Ahmedabad", "commodity": "Cotton", "min_price": "5500", "max_price": "6500", "modal_price": "6000"},
    {"state": "Karnataka", "district": "Bangalore", "market": "Bangalore", "commodity": "Onion", "min_price": "1200", "max_price": "1800", "modal_price": "1500"},
    {"state": "Rajasthan", "district": "Jaipur", "market": "Jaipur", "commodity": "Mustard", "min_price": "4500", "max_price": "5200", "modal_price": "4800"},
    {"state": "Madhya Pradesh", "district": "Indore", "market": "Indore", "commodity": "Soybean", "min_price": "3800", "max_price": "4500", "modal_price": "4200"},
    {"state": "Andhra Pradesh", "district": "Guntur", "market": "Guntur", "commodity": "Chilli", "min_price": "8000", "max_price": "12000", "modal_price": "10000"},
    {"state": "Tamil Nadu", "district": "Chennai", "market": "Chennai", "commodity": "Maize", "min_price": "1600", "max_price": "2000", "modal_price": "1800"},
    {"state": "Bihar", "district": "Patna", "market": "Patna", "commodity": "Wheat", "min_price": "1900", "max_price": "2100", "modal_price": "2000"},
    {"state": "Haryana", "district": "Karnal", "market": "Karnal", "commodity": "Rice", "min_price": "2000", "max_price": "2400", "modal_price": "2200"},
  ];
}
