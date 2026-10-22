
document.addEventListener("DOMContentLoaded", () => {
  // 1. Update footer year
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // 2. Mobile navigation menu
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      navLinks.classList.toggle("active", !isExpanded);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("active");
      });
    });
  }

  // 3. Project gallery images
  const galleries = {
    student: [
      "images/studentmanagementsystem.jpg",
      "images/studentmanagementsystem2.jpg",
      "images/studentmanagementsystem3.jpg",
      "images/studentmanagementsystem4.jpg",
      "images/studentmanagementsystem5.jpg",
      "images/studentmanagementsystem6.jpg",
      "images/studentmanagementsystem7.jpg"
    ],

    workout: [
      "images/wp1.jpg",
      "images/wp2.jpg",
    ],

    health: [
      "images/hms1.jpg",
      "images/hms2.jpg",
      "images/hms3.jpg",
      "images/hms4.jpg",
    ],

    grade: [
      "images/gc.jpg",
    ],

    scientific: [
      "images/calc1.jpg",
      "images/calc2.jpg",
      "images/calc3.jpg",
    ],

    book: [
      "images/bms1.jpg",
      "images/bms2.jpg",
    ],

    sysvision: [
  "images/sv.jpg",
  "images/sv2.jpg",
    ],


  };

  // 4. Initialize galleries on project detail pages
  document.querySelectorAll(".project-gallery").forEach((gallery) => {
    const projectName = gallery.dataset.projectGallery;
    const images = galleries[projectName];

    if (!images || images.length === 0) {
      console.warn("Gallery images not found:", projectName);
      return;
    }

    const mainImage =
      gallery.querySelector(".gallery-main-image") ||
      gallery.querySelector("#mainImage");

    const thumbnailsContainer =
      gallery.querySelector("[data-gallery-thumbnails]") ||
      gallery.querySelector("#imageThumbnails");

    const counter =
      gallery.querySelector("[data-gallery-counter]") ||
      gallery.querySelector("#imageCounter");

    const previousButton =
      gallery.querySelector("[data-gallery-prev]") ||
      gallery.querySelector("#prevImage");

    const nextButton =
      gallery.querySelector("[data-gallery-next]") ||
      gallery.querySelector("#nextImage");

    if (
      !mainImage ||
      !thumbnailsContainer ||
      !counter ||
      !previousButton ||
      !nextButton
    ) {
      console.error("Missing gallery elements:", projectName);
      return;
    }

    let currentIndex = 0;

    function showImage(index) {
      currentIndex = (index + images.length) % images.length;

      mainImage.src = images[currentIndex];
      mainImage.alt =
        `${projectName} project screenshot ${currentIndex + 1}`;

      counter.textContent =
        `${currentIndex + 1} / ${images.length}`;

      thumbnailsContainer
        .querySelectorAll(".gallery-thumbnail")
        .forEach((thumbnail, i) => {
          const active = i === currentIndex;

          thumbnail.classList.toggle("active", active);
          thumbnail.setAttribute("aria-pressed", String(active));
        });
    }

    thumbnailsContainer.replaceChildren();

    images.forEach((imagePath, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-thumbnail";
      button.setAttribute(
        "aria-label",
        `View photo ${index + 1} of ${images.length}`
      );
      button.setAttribute("aria-pressed", "false");

      const img = document.createElement("img");
      img.src = imagePath;
      img.alt = "";
      img.loading = "lazy";

      button.appendChild(img);
      button.addEventListener("click", () => showImage(index));

      thumbnailsContainer.appendChild(button);
    });

    previousButton.addEventListener("click", () => {
      showImage(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
      showImage(currentIndex + 1);
    });

    gallery.addEventListener("keydown", (event) => {
      if (
        event.target.matches(
          "input, textarea, select, [contenteditable='true']"
        )
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(currentIndex + 1);
      }
    });

    showImage(0);
  });
});