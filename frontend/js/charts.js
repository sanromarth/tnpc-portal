
const _chartInstances = {};
function safeChart(canvasId, config) {
    if (_chartInstances[canvasId]) {
        _chartInstances[canvasId].destroy();
    }
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    _chartInstances[canvasId] = new Chart(ctx, config);
    return _chartInstances[canvasId];
}

document.addEventListener("DOMContentLoaded", async function () {

    
    let statsData = null;
    try {
        statsData = await getDashboardStats();
    } catch (e) {
        console.warn("Could not load dashboard stats for charts:", e.message);
    }

    
    const statusCtx = document.getElementById("statusChart");
    if (statusCtx) {
        const accepted = statsData ? (statsData.acceptedApplications || 0) : 0;
        const rejected = statsData ? (statsData.rejectedApplications || 0) : 0;
        const pending = statsData ? (statsData.pendingApplications || 0) : 0;

        safeChart("statusChart", {
            type: "doughnut",
            data: {
                labels: ["Accepted", "Rejected", "Pending"],
                datasets: [{
                    data: [accepted, rejected, pending],
                    backgroundColor: [
                        "rgba(46, 125, 50, 0.85)",
                        "rgba(198, 40, 40, 0.85)",
                        "rgba(249, 168, 37, 0.85)"
                    ],
                    borderWidth: 0,
                    spacing: 4
                }]
            },
            options: {
                responsive: true,
                cutout: "68%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: { family: "'Inter', sans-serif", weight: 500 }
                        }
                    }
                }
            }
        });
    }

    
    const yearCtx = document.getElementById("yearPlacementChart");
    if (yearCtx) {
        try {
            const res = await fetch(`${API_BASE}/api/placements`);
            const placements = await res.json();

            const filtered = placements
                .filter(p => p.yearOrder >= 2017 && p.totalStudents > 0)
                .sort((a, b) => a.yearOrder - b.yearOrder);

            safeChart("yearPlacementChart", {
                type: "line",
                data: {
                    labels: filtered.map(p => p.batch),
                    datasets: [{
                        label: "Placements Offered",
                        data: filtered.map(p => p.placementsOffered || 0),
                        borderColor: "#1e4f9a",
                        backgroundColor: "rgba(30, 79, 154, 0.08)",
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: "#1e4f9a",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        borderWidth: 3
                    }, {
                        label: "Eligible Students",
                        data: filtered.map(p => p.eligibleStudents || 0),
                        borderColor: "#C62828",
                        backgroundColor: "rgba(198, 40, 40, 0.05)",
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: "#C62828",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        borderWidth: 2,
                        borderDash: [5, 5]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                usePointStyle: true,
                                font: { family: "'Inter', sans-serif", weight: 500 }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: "rgba(0,0,0,0.04)" },
                            ticks: { font: { family: "'Inter', sans-serif" } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { family: "'Inter', sans-serif" } }
                        }
                    }
                }
            });
        } catch (e) {
            console.warn("Could not load placement trend:", e.message);
        }
    }
});
