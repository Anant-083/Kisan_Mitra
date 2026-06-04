window.onload = () => loadMarket("", "");

function searchMarket() {
  const state = document.getElementById("search-state").value;
  const commodity = document.getElementById("search-commodity").value;
  loadMarket(state, commodity);
}

function loadMarket(state, commodity) {
  fetch("/get_market", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, commodity })
  })
  .then(r => r.json())
  .then(data => {
    renderTable(data.data);
    renderChart(data.data);
  })
  .catch(() => {
    document.getElementById("market-body").innerHTML = "<tr><td colspan='7'>Failed to load data</td></tr>";
  });
}

function getTrend(min, max) {
  const diff = max - min;
  if (diff > 1000) return "🟢 High";
  if (diff > 500) return "🟡 Stable";
  return "🔴 Low";
}

function renderTable(records) {
  let html = '';
  records.forEach(r => {
    const trend = getTrend(
      parseFloat(r.min_price || r["Min Price"] || 0),
      parseFloat(r.max_price || r["Max Price"] || 0)
    );
    const trendClass = trend.includes("High") ? "trend-high" : trend.includes("Low") ? "trend-low" : "trend-stable";
    html += `
      <tr class="${trendClass}">
        <td>${r.state || r.State}</td>
        <td>${r.market || r.Market}</td>
        <td>${r.commodity || r.Commodity}</td>
        <td>₹${r.min_price || r["Min Price"]}</td>
        <td>₹${r.max_price || r["Max Price"]}</td>
        <td>₹${r.modal_price || r["Modal Price"]}</td>
        <td>${trend}</td>
      </tr>
    `;
  });
  document.getElementById("market-body").innerHTML = html;
}

function renderChart(records) {
  const labels = records.map(r => r.commodity || r.Commodity);
  const prices = records.map(r => parseFloat(r.modal_price || r["Modal Price"] || 0));

  const ctx = document.getElementById("market-chart").getContext("2d");
  new Chart(ctx, {
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
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } }
    }
  });
} 
