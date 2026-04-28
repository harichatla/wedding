document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const revealItems = document.querySelectorAll(".reveal, .footer");
  const countdownRoot = document.querySelector(".countdown");
  const blessingButton = document.querySelector("[data-blessing-button]");
  const blessingText = document.querySelector("[data-blessing-text]");
  const galleryButtons = document.querySelectorAll(".gallery__item");
  const galleryCarousel = document.querySelector("[data-gallery-carousel]");
  const celebrateButton = document.querySelector("[data-celebrate-button]");
  const celebrateToast = document.querySelector("[data-celebrate-toast]");
  const fireworksCanvas = document.querySelector(".fireworks-canvas");
  const hero = document.querySelector(".hero");
  const scrollCue = document.querySelector(".hero__scroll-cue");
  const detailsSection = document.querySelector("#details");
  const sectionLinks = document.querySelectorAll("[data-section-link]");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox__image");
  const lightboxCaption = document.querySelector(".lightbox__caption");
  const lightboxCloseButtons = document.querySelectorAll(".lightbox__close, .lightbox__backdrop");
  const themeStorageKey = "wedding-theme";
  const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = (theme, persist = false) => {
    document.body.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    if (themeToggle && themeLabel && themeIcon) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";
      themeIcon.textContent = isDark ? "☀️" : "🌙";
    }

    if (persist) {
      window.localStorage.setItem(themeStorageKey, theme);
    }
  };

  const savedTheme = window.localStorage.getItem(themeStorageKey);
  applyTheme(savedTheme || (themeMediaQuery.matches ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme, true);
  });

  themeMediaQuery.addEventListener("change", (event) => {
    if (!window.localStorage.getItem(themeStorageKey)) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  if (blessingButton && blessingText) {
    const blessings = [
      "May your life together be filled with love, laughter, and peace.",
      "Wishing you endless joy as you begin this beautiful journey together.",
      "May your home always be bright with happiness and harmony.",
      "May every day of your marriage bring new reasons to smile.",
      "Wishing you a lifetime of togetherness, trust, and celebration.",
      "May your hearts stay forever connected in love and understanding.",
      "May this new chapter be full of blessings, warmth, and sweet memories."
    ];
    let blessingIndex = 0;

    blessingButton.addEventListener("click", () => {
      blessingIndex = (blessingIndex + 1) % blessings.length;
      blessingText.classList.add("is-changing");

      window.setTimeout(() => {
        blessingText.textContent = blessings[blessingIndex];
        blessingText.classList.remove("is-changing");
      }, 180);
    });
  }

  if (countdownRoot) {
    const target = new Date(countdownRoot.dataset.target).getTime();
    const days = countdownRoot.querySelector('[data-unit="days"]');
    const hours = countdownRoot.querySelector('[data-unit="hours"]');
    const minutes = countdownRoot.querySelector('[data-unit="minutes"]');
    const seconds = countdownRoot.querySelector('[data-unit="seconds"]');

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(target - now, 0);

      const totalSeconds = Math.floor(diff / 1000);
      const dayValue = Math.floor(totalSeconds / 86400);
      const hourValue = Math.floor((totalSeconds % 86400) / 3600);
      const minuteValue = Math.floor((totalSeconds % 3600) / 60);
      const secondValue = totalSeconds % 60;

      days.textContent = String(dayValue).padStart(2, "0");
      hours.textContent = String(hourValue).padStart(2, "0");
      minutes.textContent = String(minuteValue).padStart(2, "0");
      seconds.textContent = String(secondValue).padStart(2, "0");
    };

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  if (scrollCue) {
    const hideScrollCue = () => {
      if (window.scrollY > 40) {
        scrollCue.classList.add("is-hidden");
      } else {
        scrollCue.classList.remove("is-hidden");
      }
    };

    window.addEventListener("scroll", hideScrollCue, { passive: true });
    hideScrollCue();
  }

  if (scrollCue && detailsSection) {
    const detailsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scrollCue.classList.add("is-hidden");
          }
        });
      },
      { threshold: 0.1 }
    );

    detailsObserver.observe(detailsSection);
  }

  const trackedSections = ["home", "countdown", "details", "family", "blessings", "gallery"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (trackedSections.length && sectionLinks.length) {
    const setActiveSection = (id) => {
      sectionLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.sectionLink === id);
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -35% 0px",
        threshold: [0.2, 0.4, 0.65]
      }
    );

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  if (galleryCarousel) {
    const galleryTrack = galleryCarousel.querySelector(".gallery-carousel__track");
    const gallerySlides = Array.from(galleryCarousel.querySelectorAll(".gallery__item"));
    const galleryDots = Array.from(galleryCarousel.querySelectorAll(".gallery-carousel__dot"));
    const prevButton = galleryCarousel.querySelector("[data-gallery-prev]");
    const nextButton = galleryCarousel.querySelector("[data-gallery-next]");
    let currentSlide = 0;
    let autoSlideIntervalId = 0;

    const renderGallerySlide = () => {
      galleryTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      galleryDots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === currentSlide);
      });
    };

    prevButton?.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + gallerySlides.length) % gallerySlides.length;
      renderGallerySlide();
    });

    nextButton?.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % gallerySlides.length;
      renderGallerySlide();
    });

    galleryDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        renderGallerySlide();
      });
    });

    const restartAutoSlide = () => {
      window.clearInterval(autoSlideIntervalId);
      autoSlideIntervalId = window.setInterval(() => {
        currentSlide = (currentSlide + 1) % gallerySlides.length;
        renderGallerySlide();
      }, 3200);
    };

    let touchStartX = 0;
    let touchEndX = 0;

    galleryTrack.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );

    galleryTrack.addEventListener(
      "touchend",
      (event) => {
        touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) < 40) {
          return;
        }

        if (deltaX < 0) {
          currentSlide = (currentSlide + 1) % gallerySlides.length;
        } else {
          currentSlide = (currentSlide - 1 + gallerySlides.length) % gallerySlides.length;
        }

        renderGallerySlide();
        restartAutoSlide();
      },
      { passive: true }
    );

    renderGallerySlide();
    restartAutoSlide();
  }

  let triggerCelebration = () => {};

  if (fireworksCanvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const context = fireworksCanvas.getContext("2d");
    const particles = [];
    const rockets = [];
    let animationFrameId = 0;
    let deviceScale = Math.min(window.devicePixelRatio || 1, 2);
    let celebrationIntervalId = 0;
    let megaCelebrationIntervalId = 0;
    let lastScrollBurstAt = 0;
    let lastScrollY = window.scrollY;

    const resizeCanvas = () => {
      fireworksCanvas.width = Math.floor(window.innerWidth * deviceScale);
      fireworksCanvas.height = Math.floor(window.innerHeight * deviceScale);
      fireworksCanvas.style.width = `${window.innerWidth}px`;
      fireworksCanvas.style.height = `${window.innerHeight}px`;
      context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
    };

    const createBurst = (x, y, palette) => {
      const count = window.innerWidth < 640 ? 28 : 42;

      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count;
        const speed = 1.8 + Math.random() * 4.8;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.008 + Math.random() * 0.009,
          size: 2.4 + Math.random() * 3.6,
          color: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    };

    const createMegaBurst = (x, y, palette) => {
      const count = window.innerWidth < 640 ? 84 : 140;

      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count;
        const speed = 2.8 + Math.random() * 7.2;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.006 + Math.random() * 0.006,
          size: 2.8 + Math.random() * 4.8,
          color: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    };

    const launchRocket = (startX, startY, targetX, targetY, palette, isMega = false) => {
      rockets.push({
        x: startX,
        y: startY,
        startX,
        startY,
        targetX,
        targetY,
        vx: (targetX - startX) * 0.035,
        vy: (targetY - startY) * 0.035,
        life: 1,
        trailColor: palette[Math.floor(Math.random() * palette.length)],
        burstPalette: palette,
        isMega
      });
    };

    const palettes = [
      ["#ff7eb6", "#ffd166", "#ffffff"],
      ["#7b2ff7", "#ff7eb6", "#ffe29a"],
      ["#ffffff", "#f4b6ff", "#ff9ecd"]
    ];

    const renderFireworks = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let index = rockets.length - 1; index >= 0; index -= 1) {
        const rocket = rockets[index];

        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.life -= 0.012;

        context.globalAlpha = Math.max(rocket.life, 0.35);
        context.strokeStyle = rocket.trailColor;
        context.lineWidth = rocket.isMega ? 6.5 : 3.2;
        context.shadowBlur = rocket.isMega ? 30 : 18;
        context.shadowColor = rocket.trailColor;
        context.beginPath();
        context.moveTo(rocket.startX, rocket.startY);
        context.lineTo(rocket.x, rocket.y);
        context.stroke();

        context.fillStyle = rocket.isMega ? "#fff6d6" : "#ffffff";
        context.beginPath();
        context.arc(rocket.x, rocket.y, rocket.isMega ? 5.2 : 2.8, 0, Math.PI * 2);
        context.fill();

        const dx = rocket.targetX - rocket.x;
        const dy = rocket.targetY - rocket.y;
        const reachedTarget = Math.hypot(dx, dy) < 18;

        if (reachedTarget || rocket.life <= 0) {
          if (rocket.isMega) {
            createMegaBurst(rocket.x, rocket.y, rocket.burstPalette);
          } else {
            createBurst(rocket.x, rocket.y, rocket.burstPalette);
          }
          rockets.splice(index, 1);
        }
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.015;
        particle.vx *= 0.992;
        particle.vy *= 0.992;
        particle.life -= particle.decay;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        context.globalAlpha = particle.life;
        context.fillStyle = particle.color;
        context.shadowBlur = 18;
        context.shadowColor = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      animationFrameId = window.requestAnimationFrame(renderFireworks);
    };

    const launchCelebration = (biasY = 0) => {
      const directBursts = Array.from({ length: window.innerWidth < 640 ? 1 : 2 }, () => [
        window.innerWidth * (0.16 + Math.random() * 0.68),
        window.innerHeight * (0.18 + Math.random() * 0.52)
      ]);

      const rocketBursts = window.innerWidth < 640
        ? [
            [
              [window.innerWidth * 0.18, window.innerHeight * 1.02],
              [window.innerWidth * 0.26, window.innerHeight * (0.76 - biasY * 0.12)]
            ],
            [
              [window.innerWidth * 0.82, window.innerHeight * 1.02],
              [window.innerWidth * 0.74, window.innerHeight * (0.22 + biasY)]
            ]
          ]
        : [
            [
              [window.innerWidth * 0.12, window.innerHeight * 1.02],
              [window.innerWidth * 0.22, window.innerHeight * (0.82 - biasY * 0.15)]
            ],
            [
              [window.innerWidth * 0.48, window.innerHeight * 0.7],
              [window.innerWidth * 0.54, window.innerHeight * (0.22 + biasY * 0.24)]
            ],
            [
              [window.innerWidth * 0.88, window.innerHeight * 1.02],
              [window.innerWidth * 0.78, window.innerHeight * (0.72 - biasY * 0.18)]
            ]
          ];

      rocketBursts.forEach(([start, target], index) => {
        window.setTimeout(() => {
          launchRocket(start[0], start[1], target[0], target[1], palettes[index % palettes.length]);
        }, index * 180);
      });

      directBursts.forEach(([x, y], index) => {
        window.setTimeout(() => {
          createBurst(x, y, palettes[(index + rocketBursts.length) % palettes.length]);
        }, (index + rocketBursts.length) * 180);
      });
    };

    const launchMegaCelebration = () => {
      const startX = window.innerWidth * (0.45 + Math.random() * 0.1);
      const targetX = window.innerWidth * (0.38 + Math.random() * 0.24);
      const targetY = window.innerHeight * (window.innerWidth < 640 ? 0.2 : 0.16);
      const palette = ["#ffffff", "#ffd166", "#ff7eb6", "#7b2ff7", "#ffe29a"];

      launchRocket(startX, window.innerHeight * 1.05, targetX, targetY, palette, true);
    };

    triggerCelebration = () => {
      launchCelebration(Math.random() * 0.12);
      launchMegaCelebration();
    };

    resizeCanvas();
    launchCelebration();
    renderFireworks();
    celebrationIntervalId = window.setInterval(() => {
      const randomBias = Math.random() * 0.12;
      launchCelebration(randomBias);
    }, 3600);
    megaCelebrationIntervalId = window.setInterval(() => {
      launchMegaCelebration();
    }, 12000);
    window.setTimeout(() => {
      launchMegaCelebration();
    }, 3200);

    window.addEventListener("resize", () => {
      deviceScale = Math.min(window.devicePixelRatio || 1, 2);
      resizeCanvas();
    });

    hero?.addEventListener("pointerdown", (event) => {
      createBurst(event.clientX, event.clientY, palettes[Math.floor(Math.random() * palettes.length)]);
    });

    window.addEventListener(
      "scroll",
      () => {
        const now = Date.now();

        if (now - lastScrollBurstAt < 700) {
          lastScrollY = window.scrollY;
          return;
        }

        const deltaY = window.scrollY - lastScrollY;

        if (Math.abs(deltaY) < 24) {
          lastScrollY = window.scrollY;
          return;
        }

        const x = deltaY > 0
          ? window.innerWidth * (0.68 + Math.random() * 0.18)
          : window.innerWidth * (0.14 + Math.random() * 0.18);
        const y = deltaY > 0
          ? window.innerHeight * (0.68 + Math.random() * 0.18)
          : window.innerHeight * (0.26 + Math.random() * 0.22);

        createBurst(x, y, palettes[Math.floor(Math.random() * palettes.length)]);
        lastScrollBurstAt = now;
        lastScrollY = window.scrollY;
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.clearInterval(celebrationIntervalId);
        window.clearInterval(megaCelebrationIntervalId);
        celebrationIntervalId = 0;
        megaCelebrationIntervalId = 0;
      } else if (!celebrationIntervalId) {
        celebrationIntervalId = window.setInterval(() => {
          const randomBias = Math.random() * 0.12;
          launchCelebration(randomBias);
        }, 3600);
        megaCelebrationIntervalId = window.setInterval(() => {
          launchMegaCelebration();
        }, 12000);
      }
    });
  }

  if (celebrateButton) {
    let toastTimer = 0;

    celebrateButton.addEventListener("click", () => {
      triggerCelebration();

      if (celebrateToast) {
        celebrateToast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => {
          celebrateToast.classList.remove("is-visible");
        }, 1800);
      }
    });
  }

  const openLightbox = (src, caption, alt) => {
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = caption;
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    lightboxCaption.textContent = "";
    document.body.style.overflow = "";
  };

  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");

      openLightbox(button.dataset.image, button.dataset.caption || "", image?.alt || "");
    });
  });

  lightboxCloseButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});
