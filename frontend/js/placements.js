
const loader = document.getElementById("loader");
if (loader) loader.style.display = "block";

// Detect touch devices to disable chart interactions that cause page shaking
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

const chartTouchOptions = isTouchDevice ? {
  animation: { duration: 0 },
  hover: { mode: null },
  interaction: { mode: null },
  events: [],
  plugins: { tooltip: { enabled: false } }
} : {};

let fullData = [];

async function loadPlacements() {
  try {
    const res = await fetch(`${API_BASE}/api/placements`);

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    let data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format from server");
    }

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
    const tbody = document.querySelector("#placementTable tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#c62828; padding:20px;">
        ⚠️ Failed to load placement data. ${error.message}
      </td></tr>`;
    }
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
      maintainAspectRatio: true,
      animation: { duration: 600 },
      hover: { mode: null },
      interaction: { mode: 'nearest', intersect: true },
      onHover: null,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true, mode: 'nearest', intersect: true }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } }
      },
      ...chartTouchOptions
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
      maintainAspectRatio: true,
      animation: { duration: 600 },
      hover: { mode: null },
      interaction: { mode: 'nearest', intersect: true },
      onHover: null,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { enabled: true, mode: 'nearest', intersect: true }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } }
      },
      ...chartTouchOptions
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
      maintainAspectRatio: true,
      animation: { duration: 600 },
      hover: { mode: null },
      interaction: { mode: 'nearest', intersect: true },
      onHover: null,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { enabled: true, mode: 'nearest', intersect: true }
      },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: "rgba(0,0,0,0.04)" } },
        x: { grid: { display: false } }
      },
      ...chartTouchOptions
    }
  });
}

function renderTable(data) {
  const tbody = document.querySelector("#placementTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach(d => {
    const tr = document.createElement("tr");
    const cells = [
      d.batch,
      d.totalStudents || 0,
      d.eligibleStudents || 0,
      d.placementsOffered || 0,
      d.companiesVisited || 0,
      d.highestCTC || 0,
      d.avgCTC || 0,
      getPercentage(d) + "%"
    ];
    cells.forEach(val => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
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