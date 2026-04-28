document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal, .footer");
  const countdownRoot = document.querySelector(".countdown");
  const galleryButtons = document.querySelectorAll(".gallery__item");
  const galleryCarousel = document.querySelector("[data-gallery-carousel]");
  const scrollCue = document.querySelector(".hero__scroll-cue");
  const detailsSection = document.querySelector("#details");
  const sectionLinks = document.querySelectorAll("[data-section-link]");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox__image");
  const lightboxCaption = document.querySelector(".lightbox__caption");
  const lightboxCloseButtons = document.querySelectorAll(".lightbox__close, .lightbox__backdrop");

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

  const trackedSections = ["home", "countdown", "details", "family", "gallery"]
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
      },
      { passive: true }
    );

    renderGallerySlide();
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
