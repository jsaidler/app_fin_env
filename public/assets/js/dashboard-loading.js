(function dashboardLoadingBoot() {
  function getApp() {
    return document.querySelector("ion-app");
  }

  function begin() {
    var app = getApp();
    if (!app) return;
    app.classList.add("is-booting");
    app.classList.remove("is-boot-exiting");
  }

  function finishWithSlide(delayMs, durationMs) {
    var app = getApp();
    if (!app) return;
    var delay = Number.isFinite(delayMs) ? delayMs : 500;
    var duration = Number.isFinite(durationMs) ? durationMs : 420;
    window.setTimeout(function () {
      var target = getApp();
      if (!target) return;
      target.classList.add("is-boot-exiting");
      window.setTimeout(function () {
        var finalApp = getApp();
        if (!finalApp) return;
        finalApp.classList.remove("is-boot-exiting");
        finalApp.classList.remove("is-booting");
      }, duration);
    }, delay);
  }

  window.__dashboardLoading = {
    begin: begin,
    finishWithSlide: finishWithSlide,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", begin, { once: true });
  } else {
    begin();
  }
})();

