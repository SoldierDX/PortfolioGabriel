/**
 * Controle do Carrossel 3D de Vídeos do YouTube (Coverflow)
 */

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.querySelector(".carousel-control.prev");
  const nextBtn = document.querySelector(".carousel-control.next");
  const container = document.querySelector(".carousel-container");

  if (slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  /**
   * Pausa a reprodução de todos os vídeos do YouTube incorporados (carrossel e hero)
   */
  function pauseAllVideos() {
    const carousels = document.querySelectorAll(".carousel-slide iframe");
    const featured = document.querySelectorAll(".featured-video-container iframe");
    const iframes = [...carousels, ...featured];
    
    iframes.forEach((iframe) => {
      try {
        // Envia comando para a API do player do YouTube pausar o vídeo
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
          "*"
        );
      } catch (err) {
        console.warn("Não foi possível pausar o vídeo do YouTube:", err);
      }
    });
  }

  /**
   * Atualiza as classes 3D dos slides com base no slide ativo atual
   */
  function updateCarousel() {
    // Primeiro, pausa todos os vídeos que estejam tocando para não sobrepor áudio
    pauseAllVideos();

    slides.forEach((slide, idx) => {
      // Remove todas as classes de posicionamento
      slide.className = "carousel-slide";

      // Calcula a diferença circular para determinar a posição
      let offset = idx - currentIndex;

      // Ajusta para comportamento circular infinito
      if (offset < -2) offset += totalSlides;
      if (offset > 2) offset -= totalSlides;

      // Se ainda estiver fora do intervalo [-2, 2], trata como oculto
      if (offset < -2 || offset > 2) {
        slide.classList.add("hidden");
        return;
      }

      // Aplica classes com base na distância em relação ao ativo
      if (offset === 0) {
        slide.classList.add("active");
      } else if (offset === -1) {
        slide.classList.add("prev");
      } else if (offset === 1) {
        slide.classList.add("next");
      } else if (offset === -2) {
        slide.classList.add("far-prev");
      } else if (offset === 2) {
        slide.classList.add("far-next");
      }
    });

    // Atualiza os indicadores de pontos (dots)
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.add("active"); // remove e adiciona corretamente
        dot.classList.remove("active");
      }
    });
  }

  /**
   * Move para um índice específico de forma segura
   */
  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateCarousel();
  }

  // Eventos das setas de controle
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goToSlide(currentIndex - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goToSlide(currentIndex + 1);
  });

  // Evento de clique nos próprios slides para trazê-los para o centro
  slides.forEach((slide, idx) => {
    // O overlay intercepta o clique em slides inativos
    const overlay = slide.querySelector(".slide-overlay");
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        // Se o slide não for o ativo, muda para ele e previne interação com o iframe
        if (currentIndex !== idx) {
          e.preventDefault();
          e.stopPropagation();
          goToSlide(idx);
        }
      });
    }
  });

  // Evento de clique nos dots indicadores
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      goToSlide(idx);
    });
  });

  // --- Suporte a gestos Swipe (Telas Touch / Celular) ---
  let touchStartX = 0;
  let touchEndX = 0;

  if (container) {
    container.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50; // pixels mínimos para considerar deslize
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Deslizou para a esquerda -> próximo slide
        goToSlide(currentIndex + 1);
      } else {
        // Deslizou para a direita -> slide anterior
        goToSlide(currentIndex - 1);
      }
    }
  }

  // Inicializa o carrossel na carga da página
  updateCarousel();
});

/**
 * Controle das Abas de Vídeos (Longos / Curtos)
 */
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".video-tab");
  const panels = document.querySelectorAll(".video-panel");

  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("aria-controls");

      // Atualiza abas
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Atualiza painéis
      panels.forEach((panel) => {
        if (panel.id === targetId) {
          panel.removeAttribute("hidden");
          panel.classList.add("active");
        } else {
          panel.setAttribute("hidden", "");
          panel.classList.remove("active");
        }
      });
    });
  });
});
