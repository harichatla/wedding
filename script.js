document.addEventListener("DOMContentLoaded", () => {
  const fadeItems = document.querySelectorAll(".fade-in");
  const galleryImages = document.querySelectorAll(".gallery-card img");

  const revealItem = (element, delay) => {
    window.setTimeout(() => {
      element.classList.add("is-visible");
    }, delay);
  };

  fadeItems.forEach((item, index) => {
    revealItem(item, 160 + index * 120);
  });

  galleryImages.forEach((image, index) => {
    const applyImageShape = () => {
      const card = image.closest(".gallery-card");

      if (!card || !image.naturalWidth || !image.naturalHeight) {
        return;
      }

      const ratio = image.naturalWidth / image.naturalHeight;

      card.classList.remove("is-portrait", "is-landscape", "is-square", "is-featured");

      if (ratio > 1.15) {
        card.classList.add("is-landscape");
      } else if (ratio > 0.9) {
        card.classList.add("is-square");
      } else {
        card.classList.add("is-portrait");
      }

      if (index === galleryImages.length - 1) {
        card.classList.add("is-featured");
      }
    };

    if (image.complete) {
      applyImageShape();
    } else {
      image.addEventListener("load", applyImageShape, { once: true });
    }
  });
});
