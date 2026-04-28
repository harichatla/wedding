document.addEventListener("DOMContentLoaded", () => {
  const fadeItems = document.querySelectorAll(".fade-in");

  const revealItem = (element, delay) => {
    window.setTimeout(() => {
      element.classList.add("is-visible");
    }, delay);
  };

  fadeItems.forEach((item, index) => {
    revealItem(item, 160 + index * 120);
  });
});
