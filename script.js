/**
 * Reels: play ao passar o mouse (desktop) quando <source src="..."> estiver preenchido.
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
