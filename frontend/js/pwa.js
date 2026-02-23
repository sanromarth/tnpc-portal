if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/"
      });
      console.log("[PWA] Service Worker registered:", registration.scope);
    } catch (error) {
      console.warn("[PWA] Service Worker registration failed:", error);
    }
  });
}
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBanner();
});

function showInstallBanner() {
  if (window.matchMedia("(display-mode: standalone)").matches) return;
  if (sessionStorage.getItem("pwa-dismissed")) return;
  const page = window.location.pathname.split("/").pop();
  if (page === "admin-dashboard.html" || page === "student-dashboard.html") return;

  const banner = document.createElement("div");
  banner.id = "pwa-install-banner";
  banner.innerHTML = `
    <div class="pwa-banner">
      <div class="pwa-banner-content">
        <img src="assets/logos/sgcsr-logo.png" alt="TNPC" class="pwa-banner-icon" style="width:44px;height:44px;max-width:44px;max-height:44px;object-fit:cover;border-radius:10px;flex-shrink:0;">
        <div class="pwa-banner-text">
          <strong>Install TNPC Portal</strong>
          <span>Add to home screen for quick access</span>
        </div>
      </div>
      <div class="pwa-banner-actions">
        <button class="pwa-btn-install" onclick="installApp()">Install</button>
        <button class="pwa-btn-dismiss" onclick="dismissBanner()">✕</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
  setTimeout(() => dismissBanner(), 10000);
}

async function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log("[PWA] Install outcome:", outcome);
  deferredPrompt = null;
  dismissBanner();
}

function dismissBanner() {
  const banner = document.getElementById("pwa-install-banner");
  if (banner) {
    banner.style.animation = "slideDown 0.3s ease forwards";
    setTimeout(() => banner.remove(), 300);
  }
  sessionStorage.setItem("pwa-dismissed", "true");
}
window.addEventListener("appinstalled", () => {
  console.log("[PWA] App installed successfully");
  deferredPrompt = null;
  dismissBanner();
});
