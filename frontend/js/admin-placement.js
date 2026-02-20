
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
  showToast("Unauthorized. Please login as admin.", "error");
  window.location.href = "login.html";
}

document.getElementById("placementForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    batch: document.getElementById("batch").value,
    yearOrder: Number(document.getElementById("yearOrder").value),
    totalStudents: Number(document.getElementById("totalStudents").value),
    eligibleStudents: Number(document.getElementById("eligibleStudents").value),
    placementsOffered: Number(document.getElementById("placementsOffered").value),
    distinctOffers: Number(document.getElementById("distinctOffers").value),
    companiesVisited: Number(document.getElementById("companiesVisited").value),
    highestCTC: Number(document.getElementById("highestCTC").value),
    avgCTC: Number(document.getElementById("avgCTC").value),
    percentage: Number(document.getElementById("percentage").value)
  };

  try {
    await apiPost("/api/placements", formData);
    showToast("Placement data added successfully!", "success");
    document.getElementById("placementForm").reset();
  } catch (err) {
    showToast(err.message || "Error adding placement", "error");
  }
});