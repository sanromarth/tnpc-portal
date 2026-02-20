async function getJobs() {
    return apiGet("/api/jobs");
}

async function createJob(jobData) {
    return apiPost("/api/jobs", jobData);
}

async function deleteJob(jobId) {
    return apiDelete(`/api/jobs/${jobId}`);
}

async function getApplications() {
    return apiGet("/api/applications");
}

async function getMyApplications() {
    return apiGet("/api/applications/my");
}

async function applyToJob(jobId) {
    return apiPost("/api/applications", { jobId });
}

async function updateApplicationStatus(appId, status, remarks) {
    return apiPatch(`/api/applications/${appId}`, { status, remarks });
}

async function getDashboardStats() {
    return apiGet("/api/stats");
}

async function getStudentStats() {
    return apiGet("/api/student-stats");
}

async function getTopCorporates() {
    return apiGet("/api/top-corporates");
}

async function addTopCorporate(data) {
    return apiPost("/api/top-corporates", data);
}

async function deleteTopCorporate(id) {
    return apiDelete(`/api/top-corporates/${id}`);
}

async function getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiGet(`/api/students${query ? '?' + query : ''}`);
}

async function updateStudentStatus(studentId, status) {
    return apiPatch(`/api/students/${studentId}/status`, { placementStatus: status });
}

async function exportStudentsCSV() {
    const res = await fetch(`${API_BASE}/api/students/export`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Export failed");
    return res.blob();
}

async function getProfile() {
    return apiGet("/api/profile");
}

async function updateProfile(data) {
    return apiPut("/api/profile", data);
}

async function getPlacements() {
    return apiGet("/api/placements");
}

async function addPlacement(data) {
    return apiPost("/api/placements", data);
}

async function updatePlacement(id, data) {
    return apiPut(`/api/placements/${id}`, data);
}

async function deletePlacement(id) {
    return apiDelete(`/api/placements/${id}`);
}

async function getNotifications() {
    return apiGet("/api/notifications");
}

async function getUnreadNotificationCount() {
    return apiGet("/api/notifications/unread-count");
}

async function postNotification(data) {
    return apiPost("/api/notifications", data);
}

async function markNotificationRead(id) {
    return apiPatch(`/api/notifications/${id}/read`, {});
}

async function markAllNotificationsRead() {
    return apiPatch("/api/notifications/read-all", {});
}

async function deleteNotification(id) {
    return apiDelete(`/api/notifications/${id}`);
}

async function getTrainings() {
    return apiGet("/api/trainings");
}

async function getUpcomingTrainings() {
    return apiGet("/api/trainings/upcoming");
}

async function addTraining(data) {
    return apiPost("/api/trainings", data);
}

async function deleteTraining(id) {
    return apiDelete(`/api/trainings/${id}`);
}

async function getAdminAnalytics() {
    return apiGet("/api/admin/analytics");
}

async function getCertifications() {
    return apiGet("/api/certifications");
}

async function getIBMCertifications() {
    return apiGet("/api/certifications/ibm");
}
