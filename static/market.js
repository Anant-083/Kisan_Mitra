window.onload = () => loadMarket("", "");

function searchMarket() {
  const state = document.getElementById("search-state").value;
  const commodity = document.getElementById("search-commodity").value;
  loadMarket(state, commodity);
}

function loadMarket(state, commodity) {
  document.getElementById("market-body").innerHTML = "<tr><td colspan='7' style='text-align:center;padding:20px'>Loading...</td></tr>";

  fetch("/get_market", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, commodity })
  })
  .then(r => r.json())
  .then(data => {
    console.log("Market data:", data);
    if (data.data && data.data.length > 0) {
      renderTable(data.data);
      renderChart(data.data);
      // Show source indicator
      if (data.source === "fallback") {
        document.querySelector(".page-title p").textContent = "⚠️ Showing cached data (Live API unavailable)";
      } else {
        document.querySelector(".page-title p").textContent = "✅ Live prices across India";
      }
    } else {
      document.getElementById("market-body").innerHTML = "<tr><td colspan='7' style='text-align:center;padding:20px'>No data found</td></tr>";
    }
  })
  .catch(err => {
    console.error("Market error:", err);
    document.getElementById("market-body").innerHTML = "<tr><td colspan='7' style='text-align:center;padding:20px'>❌ Failed to load data</td></tr>";
  });
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
    const minPrice = r.min_price || r["Min Price"] || r["min_price"] || 0;
    const maxPrice = r.max_price || r["Max Price"] || r["max_price"] || 0;
    const modalPrice = r.modal_price || r["Modal Price"] || r["modal_price"] || 0;
    const state = r.state || r.State || "";
    const market = r.market || r.Market || "";
    const commodity = r.commodity || r.Commodity || "";

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
  const labels = records.map(r => r.commodity || r.Commodity || "");
  const prices = records.map(r => parseFloat(r.modal_price || r["Modal Price"] || r["modal_price"] || 0));

  const canvas = document.getElementById("market-chart");
  if (!canvas) return;

  // Destroy existing chart if any
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
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: ctx => `₹${ctx.raw}/quintal`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: val => `₹${val}`
          }
        }
      }
    }
  });
}
