
const loader = document.getElementById("loader");
if (loader) loader.style.display = "block";

let fullData = [];

async function loadPlacements() {
  try {
    const res = await fetch(`${API_BASE}/api/placements`);
    let data = await res.json();

    data = data.filter(d => d.yearOrder >= 2017);

    if (!data.length) {
      if (loader) loader.style.display = "none";
      return;
    }

    fullData = data;
    populateYearFilter(data);
    updateDashboard(data);
  } catch (error) {
    console.error("Error loading placements:", error);
  } finally {
    if (loader) loader.style.display = "none";
  }
}

function getPercentage(d) {
  if (d.percentage !== undefined && d.percentage !== null && d.percentage > 0) return d.percentage;
  if (!d.eligibleStudents || !d.placementsOffered) return 0;
  return Math.round((d.placementsOffered / d.eligibleStudents) * 100);
}

function renderStats(data) {
  const latest = data[data.length - 1];
  if (!latest) return;

  document.getElementById("statPercentage").innerText = getPercentage(latest) + "%";
  document.getElementById("statHighest").innerText = (latest.highestCTC || 0) + " LPA";
  document.getElementById("statAvg").innerText = (latest.avgCTC || 0) + " LPA";
  document.getElementById("statCompanies").innerText = latest.companiesVisited || 0;
}

function renderPlacementChart(data) {
  const ctx = document.getElementById("placementTrend");
  if (!ctx) return;

  if (ctx._chart) ctx._chart.destroy();

  ctx._chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d.batch),
      datasets: [{
        label: "Placements Offered",
        data: data.map(d => d.placementsOffered || 0),
        backgroundColor: "rgba(30, 79, 154, 0.85)",
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderSalaryChart(data) {
  const ctx = document.getElementById("salaryTrend");
  if (!ctx) return;

  if (ctx._chart) ctx._chart.destroy();

  ctx._chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(d => d.batch),
      datasets: [
        {
          label: "Highest CTC (LPA)",
          data: data.map(d => d.highestCTC || 0),
          borderColor: "#C62828",
          backgroundColor: "rgba(198, 40, 40, 0.08)",
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#C62828"
        },
        {
          label: "Avg CTC (LPA)",
          data: data.map(d => d.avgCTC || 0),
          borderColor: "#1e4f9a",
          backgroundColor: "rgba(30, 79, 154, 0.08)",
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#1e4f9a"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderPercentageChart(data) {
  const ctx = document.getElementById("percentageTrend");
  if (!ctx) return;

  if (ctx._chart) ctx._chart.destroy();

  ctx._chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(d => d.batch),
      datasets: [{
        label: "Placement %",
        data: data.map(d => getPercentage(d)),
        borderColor: "#FBC02D",
        backgroundColor: "rgba(251, 192, 45, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#FBC02D"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderTable(data) {
  const tbody = document.querySelector("#placementTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach(d => {
    tbody.innerHTML += `
      <tr>
        <td>${d.batch}</td>
        <td>${d.totalStudents || 0}</td>
        <td>${d.eligibleStudents || 0}</td>
        <td>${d.placementsOffered || 0}</td>
        <td>${d.companiesVisited || 0}</td>
        <td>${d.highestCTC || 0}</td>
        <td>${d.avgCTC || 0}</td>
        <td>${getPercentage(d)}%</td>
      </tr>
    `;
  });
}

function updateDashboard(data) {
  renderStats(data);
  renderPlacementChart(data);
  renderSalaryChart(data);
  renderPercentageChart(data);
  renderTable(data);
}

function populateYearFilter(data) {
  const select = document.getElementById("yearFilter");
  if (!select) return;

  
  select.innerHTML = '<option value="all">All Years</option>';

  data.forEach(d => {
    const option = document.createElement("option");
    option.value = d.batch;
    option.textContent = d.batch;
    select.appendChild(option);
  });
}

function filterByYear() {
  const selected = document.getElementById("yearFilter").value;

  if (selected === "all") {
    updateDashboard(fullData);
  } else {
    const filtered = fullData.filter(d => d.batch === selected);
    updateDashboard(filtered);
  }
}

function downloadCSV() {
  let csv = "Batch,Total Students,Eligible,Offers,Companies,Highest CTC,Avg CTC,Percentage\n";

  fullData.forEach(d => {
    csv += `${d.batch},${d.totalStudents},${d.eligibleStudents},${d.placementsOffered},${d.companiesVisited},${d.highestCTC},${d.avgCTC},${getPercentage(d)}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "placements.csv";
  a.click();

  window.URL.revokeObjectURL(url);
}

loadPlacements();