/**
 * Reels: play ao passar o mouse quando <source src="..."> estiver preenchido.
 */
function sourceUrl(video) {
  const s = video?.querySelector("source")?.getAttribute("src");
  return s && s.trim() ? s.trim() : "";
}

document.querySelectorAll(".reel-card").forEach((card) => {
  const video = card.querySelector(".reel-video");
  if (!video || !sourceUrl(video)) return;

  card.addEventListener("mouseenter", () => {
    video.play().catch(() => {});
  });
  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

const fsIconEnter =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
const fsIconExit =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14h6v6"/><path d="M20 10h-6V4"/><path d="M14 10l7-7"/><path d="M3 21l7-7"/></svg>';

function requestFrameFullscreen(frame) {
  if (frame.requestFullscreen) return frame.requestFullscreen();
  if (frame.webkitRequestFullscreen) return frame.webkitRequestFullscreen();
  return Promise.reject(new Error("Fullscreen não suportado"));
}

function exitDocumentFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
}

document.querySelectorAll(".reel-frame--embed").forEach((frame) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "reel-fs-btn";
  btn.setAttribute("aria-label", "Abrir em tela cheia");
  btn.setAttribute("title", "Tela cheia");
  btn.innerHTML = fsIconEnter;
  frame.appendChild(btn);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (document.fullscreenElement === frame || document.webkitFullscreenElement === frame) {
      exitDocumentFullscreen();
    } else {
      requestFrameFullscreen(frame).catch(() => {});
    }
  });
});

function syncFullscreenButtons() {
  const active =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    null;
  document.querySelectorAll(".reel-fs-btn").forEach((btn) => {
    const frame = btn.closest(".reel-frame");
    const isThis = frame && active === frame;
    btn.innerHTML = isThis ? fsIconExit : fsIconEnter;
    btn.setAttribute("aria-label", isThis ? "Sair da tela cheia" : "Abrir em tela cheia");
    btn.setAttribute("title", isThis ? "Sair da tela cheia" : "Tela cheia");
  });
}

document.addEventListener("fullscreenchange", syncFullscreenButtons);
document.addEventListener("webkitfullscreenchange", syncFullscreenButtons);
