/**
 * Reproduz vídeo ao passar o mouse (reels com <source> válido).
 */
document.querySelectorAll(".reel-card").forEach((card) => {
  const video = card.querySelector(".reel-video");
  if (!video || !video.querySelector("source")?.getAttribute("src")) return;

  card.addEventListener("mouseenter", () => {
    video.play().catch(() => {});
  });
  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});
