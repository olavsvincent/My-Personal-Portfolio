document.addEventListener("DOMContentLoaded", () => {
  /* ========================================
     1. FOOTER YEAR
  ======================================== */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ========================================
     2. MOBILE NAVIGATION
  ======================================== */

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open", "active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = !navLinks.classList.contains("open");

      navLinks.classList.toggle("open", isOpen);
      navLinks.classList.toggle("active", isOpen);
      menuToggle.classList.toggle("active", isOpen);

      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        !menuToggle.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) {
        closeMenu();
      }
    });
  }

  /* ========================================
     3. ACTIVE NAVIGATION LINK
  ======================================== */

  const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "index.html";

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const linkUrl = new URL(link.href, window.location.href);
    const linkPage =
      linkUrl.pathname.split("/").pop().toLowerCase() || "index.html";

    const samePage = linkPage === currentPage;
    const hasHash = Boolean(linkUrl.hash);
    const sameSection = linkUrl.hash === window.location.hash;

    if (samePage && (!hasHash || sameSection)) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  /* ========================================
     4. DARK MODE AND LIGHT MODE
  ======================================== */

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function updateThemeButton() {
    const isDark = document.body.classList.contains("dark-mode");

    if (themeIcon) {
      themeIcon.textContent = isDark ? "☀️" : "🌙";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );

      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  }

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("portfolioTheme");
  } catch (error) {
    // Continue without saved preferences if storage is unavailable.
  }

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
  } else {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    document.body.classList.toggle("dark-mode", Boolean(prefersDark));
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const isDark = document.body.classList.contains("dark-mode");

      try {
        localStorage.setItem("portfolioTheme", isDark ? "dark" : "light");
      } catch (error) {
        // The theme still works for the current page.
      }

      updateThemeButton();
    });
  }

  /* ========================================
     5. PROJECT MODAL AND IMAGE GALLERY
  ======================================== */

  const modal = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalClose");
  const modalBack = document.getElementById("modalBack");

  const modalType = document.getElementById("modalType");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalDescription = document.getElementById("modalDescription");
  const modalTags = document.getElementById("modalTags");
  const githubLink = document.getElementById("githubLink");

  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");
  const modalCounter = document.getElementById("modalCounter");
  const modalThumbnails = document.getElementById("modalThumbnails");

  let currentProject = null;
  let currentImageIndex = 0;
  let previousFocus = null;

  const projects = [
    {
      type: "COLLEGE PROJECT",
      title: "Student Management System",
      description:
        "A Python application for adding, viewing, and managing student records through a simple command-line interface.",
      technologies: ["Python", "OOP", "CLI"],
      github: "https://github.com/olavsvincent/student_management_system",
      images: [
        "images/student-system-1.jpg",
        "images/student-system-2.jpg",
        "images/student-system-3.jpg",
        "images/student-system-4.jpg",
        "images/student-system-5.jpg",
      ],
    },
    {
      type: "WEB PROJECT",
      title: "Workout Planner",
      description:
        "A responsive workout planning website concept that helps users organize exercise routines according to their goals, experience, and available equipment.",
      technologies: ["HTML", "CSS", "JavaScript"],
      github: "https://github.com/olavsvincent/workout-planner",
      images: ["images/wp1.jpg", "images/wp2.jpg"],
    },
    {
      type: "ENGINEERING PROJECT",
      title: "Health Monitoring System",
      description:
        "A proposed IoT health monitoring system focused on measuring heart rate and blood oxygen saturation, with real-time monitoring and emergency alerts.",
      technologies: ["ESP32", "IoT", "Web"],
      github: "https://github.com/olavsvincent/health_monitoring_system",
      images: [
        "images/health-monitoring-1.jpg",
        "images/health-monitoring-2.jpg",
        "images/health-monitoring-3.jpg",
        "images/health-monitoring-4.jpg",
        "images/health-monitoring-5.jpg",
      ],
    },
    {
      type: "PROGRAMMING PROJECT",
      title: "Grade Calculator",
      description:
        "A calculator that accepts student scores, calculates grades or averages, and displays results according to the grading rules used in the program.",
      technologies: ["Python", "Calculations", "Logic"],
      github: "",
      images: [
        "images/grade-calculator-1.jpg",
        "images/grade-calculator-2.jpg",
        "images/grade-calculator-3.jpg",
        "images/grade-calculator-4.jpg",
        "images/grade-calculator-5.jpg",
      ],
    },
    {
      type: "ENGINEERING PROJECT",
      title: "SysVision",
      description:
        "A system monitoring application built to present system information through a web-based interface.",
      technologies: ["Python", "Flask", "HTML", "CSS", "JavaScript"],
      github: "YOUR_SYSVISION_GITHUB_URL",
      images: ["images/sv.jpg", "images/sv2.jpg"],
    },
    {
      type: "PROGRAMMING PROJECT",
      title: "Scientific Calculator",
      description:
        "A scientific calculator for arithmetic and advanced mathematical operations, including trigonometry, logarithms, square roots, and exponents.",
      technologies: ["Python", "Mathematics", "Logic"],
      github: "https://github.com/olavsvincent/scientific_calculator",
      images: [
        "images/scientific-calculator-1.jpg",
        "images/scientific-calculator-2.jpg",
        "images/scientific-calculator-3.jpg",
        "images/scientific-calculator-4.jpg",
        "images/scientific-calculator-5.jpg",
      ],
    },
    {
      type: "PROGRAMMING PROJECT",
      title: "Book Management System",
      description:
        "A system concept for organizing book records, tracking available copies, and recording borrowed and returned books.",
      technologies: ["JavaScript", "Records", "Data"],
      github: "",
      images: [
        "images/book-management-1.jpg",
        "images/book-management-2.jpg",
        "images/book-management-3.jpg",
        "images/book-management-4.jpg",
        "images/book-management-5.jpg",
      ],
    },
  ];

  function showGalleryImage(index) {
    if (!currentProject || !modalImage) return;

    const images = currentProject.images || [];

    if (images.length === 0) {
      modalImage.removeAttribute("src");
      modalImage.alt = "No project images available";

      if (modalCounter) {
        modalCounter.textContent = "No images";
      }

      if (modalThumbnails) {
        modalThumbnails.replaceChildren();
      }

      if (modalPrev) modalPrev.disabled = true;
      if (modalNext) modalNext.disabled = true;

      return;
    }

    currentImageIndex =
      ((index % images.length) + images.length) % images.length;

    modalImage.src = images[currentImageIndex];
    modalImage.alt = `${currentProject.title}, photo ${currentImageIndex + 1}`;

    if (modalCounter) {
      modalCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    }

    if (modalThumbnails) {
      modalThumbnails.replaceChildren();

      images.forEach((image, imageIndex) => {
        const thumbnail = document.createElement("button");

        thumbnail.type = "button";
        thumbnail.className = "gallery-thumbnail";
        thumbnail.setAttribute("aria-label", `View photo ${imageIndex + 1}`);

        const isActive = imageIndex === currentImageIndex;

        thumbnail.classList.toggle("active", isActive);
        thumbnail.setAttribute("aria-pressed", String(isActive));

        const thumbnailImage = document.createElement("img");
        thumbnailImage.src = image;
        thumbnailImage.alt = "";
        thumbnailImage.loading = "lazy";

        thumbnail.appendChild(thumbnailImage);

        thumbnail.addEventListener("click", () => {
          showGalleryImage(imageIndex);
        });

        modalThumbnails.appendChild(thumbnail);
      });
    }

    if (modalPrev) {
      modalPrev.disabled = images.length <= 1;
    }

    if (modalNext) {
      modalNext.disabled = images.length <= 1;
    }
  }

  function openProject(index) {
    if (!modal) return;

    const project = projects[index];

    if (!project) return;

    currentProject = project;
    currentImageIndex = 0;
    previousFocus = document.activeElement;

    if (modalType) modalType.textContent = project.type;
    if (modalTitle) modalTitle.textContent = project.title;

    if (modalDescription) {
      modalDescription.textContent = project.description;
    }

    if (modalTags) {
      modalTags.replaceChildren();

      project.technologies.forEach((technology) => {
        const tag = document.createElement("span");
        tag.textContent = technology;
        modalTags.appendChild(tag);
      });
    }

    if (githubLink) {
      if (project.github) {
        githubLink.href = project.github;
        githubLink.style.display = "inline-flex";
        githubLink.removeAttribute("aria-disabled");
        githubLink.tabIndex = 0;
      } else {
        githubLink.removeAttribute("href");
        githubLink.style.display = "none";
        githubLink.setAttribute("aria-disabled", "true");
        githubLink.tabIndex = -1;
      }
    }

    showGalleryImage(0);

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (modalClose) {
      modalClose.focus();
    }
  }

  function closeProject() {
    if (!modal || !modal.classList.contains("show")) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  document.querySelectorAll(".view-project").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.project);

      if (Number.isInteger(index)) {
        openProject(index);
      }
    });
  });

  if (modalPrev) {
    modalPrev.addEventListener("click", () => {
      showGalleryImage(currentImageIndex - 1);
    });
  }

  if (modalNext) {
    modalNext.addEventListener("click", () => {
      showGalleryImage(currentImageIndex + 1);
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeProject);
  }

  if (modalBack) {
    modalBack.addEventListener("click", closeProject);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeProject();
      }
    });
  }

  /* ========================================
     6. CONTACT FORM
  ======================================== */

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");

      if (!nameInput || !emailInput || !messageInput) return;

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = "Please complete all fields before sending.";
        }

        return;
      }

      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      // Replace this with your actual email address.
      const recipient = "your-email@example.com";

      if (recipient === "your-email@example.com") {
        if (formStatus) {
          formStatus.textContent =
            "Please configure your email address in script.js first.";
        }

        return;
      }

      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);

      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      );

      if (formStatus) {
        formStatus.textContent =
          "Opening your email application. Send the message there to complete delivery.";
      }

      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    });
  }

  /* ========================================
     7. PORTFOLIO TERMINAL
  ======================================== */

  const terminalForm = document.getElementById("terminalForm");
  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");

  if (terminalForm && terminalInput && terminalOutput) {
    const commands = [
      "help",
      "about",
      "skills",
      "projects",
      "contact",
      "whoami",
      "clear",
    ];

    function addTerminalLine(text, className = "") {
      const line = document.createElement("p");
      line.textContent = text;

      if (className) {
        line.className = className;
      }

      terminalOutput.appendChild(line);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function addCommandLine(command) {
      addTerminalLine(
        `visitor@portfolio:~$ ${command}`,
        "terminal-command-line",
      );
    }

    function runCommand(rawCommand) {
      const command = rawCommand.trim().toLowerCase();

      if (!command) return;

      if (command === "clear") {
        terminalOutput.replaceChildren();
        return;
      }

      addCommandLine(rawCommand.trim());

      switch (command) {
        case "help":
          addTerminalLine("Available commands:", "terminal-success");
          commands.forEach((item) => addTerminalLine(`  ${item}`));
          addTerminalLine("Type a command to explore the portfolio.");
          break;

        case "about":
          addTerminalLine("ABOUT ME", "terminal-success");
          addTerminalLine("Name: Shane Vincent Olavario");
          addTerminalLine(
            "Course: Bachelor of Science in Computer Engineering",
          );
          addTerminalLine("Year Level: First-Year College Student");
          addTerminalLine(
            "Interests: Technology, computers, programming, and problem-solving.",
          );
          addTerminalLine("Goal: Keep learning and build useful projects.");
          break;

        case "skills":
          addTerminalLine("SKILLS I'M DEVELOPING", "terminal-success");
          addTerminalLine("HTML - Building web page structures.");
          addTerminalLine("CSS - Styling responsive websites.");
          addTerminalLine("JavaScript - Creating interactive features.");
          addTerminalLine("Python - Practicing programming fundamentals.");
          addTerminalLine("Database Management - Learning to organize data.");
          addTerminalLine("Git and GitHub - Learning version control.");
          addTerminalLine("Visit skills.html to explore my skills.");
          break;

        case "projects":
          addTerminalLine("MY PROJECTS", "terminal-success");
          addTerminalLine("1. Student Management System");
          addTerminalLine("2. Workout Planner");
          addTerminalLine("3. Health Monitoring System");
          addTerminalLine("4. Grade Calculator");
          addTerminalLine("5. Scientific Calculator");
          addTerminalLine("6. Book Management System");
          addTerminalLine("Open projects.html to view project details.");
          break;

        case "contact":
          addTerminalLine("CONTACT", "terminal-success");
          addTerminalLine("Want to connect or discuss a project?");
          addTerminalLine("Open contact.html to find my contact information.");
          break;

        case "whoami":
          addTerminalLine("visitor");
          addTerminalLine("Welcome to Shane Vincent Olavario's portfolio.");
          break;

        default:
          addTerminalLine(
            `Command not found: ${rawCommand.trim()}`,
            "terminal-error",
          );
          addTerminalLine("Type 'help' to see available commands.");
      }
    }

    terminalForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const command = terminalInput.value.trim();

      if (!command) return;

      runCommand(command);
      terminalInput.value = "";
      terminalInput.focus();
    });

    document.querySelectorAll(".terminal-command").forEach((button) => {
      button.addEventListener("click", () => {
        const command = button.dataset.command;

        if (!command) return;

        runCommand(command);
        terminalInput.focus();
      });
    });
  }

  /* ========================================
     8. KEYBOARD SHORTCUTS
  ======================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeProject();
    }

    if (!modal || !modal.classList.contains("show")) return;

    if (event.key === "ArrowRight") {
      showGalleryImage(currentImageIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      showGalleryImage(currentImageIndex - 1);
    }
  });
});

// =============================================
// PROJECT PAGE FEATURES
// Search, filters, favorites, statistics, modal
// =============================================

(() => {
  "use strict";

  // Run only on the Projects page.
  const projectsGrid = document.getElementById("projectsGrid");

  if (!projectsGrid) {
    return;
  }

  // ---------------------------------------------
  // 1. GET HTML ELEMENTS
  // ---------------------------------------------

  const projects = Array.from(projectsGrid.querySelectorAll("[data-project]"));

  const searchInput = document.getElementById("projectSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const statusFilter = document.getElementById("statusFilter");

  const resetButton = document.getElementById("resetProjectFilters");
  const emptyResetButton = document.getElementById("emptyResetFilters");
  const favoritesFilterButton = document.getElementById("favoritesFilter");

  const resultCount = document.getElementById("projectResultCount");
  const emptyState = document.getElementById("projectEmptyState");

  const modal = document.getElementById("projectModal");
  const modalContent = modal.querySelector(".project-modal-content");
  const closeModalButton = document.getElementById("closeProjectModal");

  const modalImage = document.getElementById("modalProjectImage");
  const modalCategory = document.getElementById("modalProjectCategory");
  const modalTitle = document.getElementById("modalProjectTitle");
  const modalStatus = document.getElementById("modalProjectStatus");
  const modalDescription = document.getElementById("modalProjectDescription");
  const modalFeatures = document.getElementById("modalProjectFeatures");
  const modalTechnologies = document.getElementById("modalProjectTechnologies");
  const modalLearning = document.getElementById("modalProjectLearning");

  const modalProjectPage = document.getElementById("modalProjectPage");
  const modalDemo = document.getElementById("modalProjectDemo");
  const modalGithub = document.getElementById("modalProjectGithub");

  const statNumbers = document.querySelectorAll("[data-stat]");

  // ---------------------------------------------
  // 2. LOCAL STORAGE SETTINGS
  // ---------------------------------------------

  const FAVORITES_KEY = "vincentPortfolioFavorites";
  const FILTERS_KEY = "vincentPortfolioProjectFilters";

  // Use try/catch in case browser storage is unavailable.
  function readStorage(key, fallback) {
    try {
      const saved = localStorage.getItem(key);

      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Unable to save portfolio settings.");
    }
  }

  // Use project names as stable favorite identifiers.
  let favorites = readStorage(FAVORITES_KEY, []);

  if (!Array.isArray(favorites)) {
    favorites = [];
  }

  let favoritesOnly = false;
  let lastFocusedElement = null;

  // ---------------------------------------------
  // 3. RESTORE SAVED FILTERS
  // ---------------------------------------------

  const savedFilters = readStorage(FILTERS_KEY, {});

  if (savedFilters && typeof savedFilters === "object") {
    if (typeof savedFilters.search === "string") {
      searchInput.value = savedFilters.search;
    }

    const validCategories = ["all", "web", "python", "engineering"];

    const validStatuses = ["all", "completed", "progress", "concept"];

    if (validCategories.includes(savedFilters.category)) {
      categoryFilter.value = savedFilters.category;
    }

    if (validStatuses.includes(savedFilters.status)) {
      statusFilter.value = savedFilters.status;
    }

    favoritesOnly = savedFilters.favoritesOnly === true;
  }

  // ---------------------------------------------
  // 4. SAVE CURRENT FILTERS
  // ---------------------------------------------

  function saveFilters() {
    writeStorage(FILTERS_KEY, {
      search: searchInput.value,
      category: categoryFilter.value,
      status: statusFilter.value,
      favoritesOnly: favoritesOnly,
    });
  }

  // ---------------------------------------------
  // 5. FAVORITES
  // ---------------------------------------------

  function saveFavorites() {
    writeStorage(FAVORITES_KEY, favorites);
  }

  function updateFavoriteButtons() {
    projects.forEach((project) => {
      const name = project.dataset.name;
      const button = project.querySelector("[data-favorite]");

      if (!button) {
        return;
      }

      const isFavorite = favorites.includes(name);

      button.setAttribute("aria-pressed", String(isFavorite));

      button.innerHTML = isFavorite ? "♥" : "♡";

      button.setAttribute(
        "aria-label",
        `${isFavorite ? "Remove" : "Add"} ${name} ${
          isFavorite ? "from" : "to"
        } favorites`,
      );
    });

    favoritesFilterButton.setAttribute("aria-pressed", String(favoritesOnly));

    favoritesFilterButton.innerHTML = favoritesOnly
      ? '<span aria-hidden="true">♥</span> Showing Favorites'
      : '<span aria-hidden="true">♡</span> Favorites Only';

    updateStatistics();
  }

  projects.forEach((project) => {
    const favoriteButton = project.querySelector("[data-favorite]");

    favoriteButton.addEventListener("click", () => {
      const name = project.dataset.name;

      if (favorites.includes(name)) {
        favorites = favorites.filter((item) => item !== name);
      } else {
        favorites.push(name);
      }

      saveFavorites();
      updateFavoriteButtons();
      filterProjects();
    });
  });

  favoritesFilterButton.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;

    saveFilters();
    updateFavoriteButtons();
    filterProjects();
  });

  // ---------------------------------------------
  // 6. PROJECT SEARCH AND FILTERING
  // ---------------------------------------------

  function filterProjects() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedStatus = statusFilter.value;

    let visibleCount = 0;

    projects.forEach((project) => {
      const name = project.dataset.name.toLowerCase();
      const description = project.dataset.description.toLowerCase();
      const technologies = project.dataset.technologies.toLowerCase();
      const category = project.dataset.category;
      const status = project.dataset.status;

      const matchesSearch =
        name.includes(searchTerm) ||
        description.includes(searchTerm) ||
        technologies.includes(searchTerm);

      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || status === selectedStatus;

      const matchesFavorite =
        !favoritesOnly || favorites.includes(project.dataset.name);

      const isVisible =
        matchesSearch && matchesCategory && matchesStatus && matchesFavorite;

      project.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    resultCount.textContent = `Showing ${visibleCount} of ${projects.length} projects`;

    emptyState.hidden = visibleCount !== 0;

    saveFilters();
  }

  searchInput.addEventListener("input", filterProjects);
  categoryFilter.addEventListener("change", filterProjects);
  statusFilter.addEventListener("change", filterProjects);

  function resetFilters() {
    searchInput.value = "";
    categoryFilter.value = "all";
    statusFilter.value = "all";
    favoritesOnly = false;

    saveFilters();
    updateFavoriteButtons();
    filterProjects();
  }

  resetButton.addEventListener("click", resetFilters);
  emptyResetButton.addEventListener("click", resetFilters);

  // ---------------------------------------------
  // 7. ANIMATED PROJECT STATISTICS
  // ---------------------------------------------

  function getStatistics() {
    const technologySet = new Set();

    projects.forEach((project) => {
      const tags = project.querySelectorAll(".tags span");

      tags.forEach((tag) => {
        technologySet.add(tag.textContent.trim().toLowerCase());
      });
    });

    return {
      projects: projects.length,

      technologies: technologySet.size,

      completed: projects.filter(
        (project) => project.dataset.status === "completed",
      ).length,

      favorites: favorites.length,
    };
  }

  function animateNumber(element, target) {
    const duration = 800;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out animation.
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentNumber = Math.round(target * easedProgress);

      element.textContent = currentNumber;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }

    requestAnimationFrame(updateNumber);
  }

  function updateStatistics() {
    const stats = getStatistics();

    statNumbers.forEach((element) => {
      const statName = element.dataset.stat;
      const target = stats[statName] ?? 0;

      element.dataset.target = target;

      // Update directly when the page is already loaded.
      if (element.dataset.animated === "true") {
        element.textContent = target;
      }
    });
  }

  function initializeStatistics() {
    const stats = getStatistics();

    statNumbers.forEach((element) => {
      const target = stats[element.dataset.stat] ?? 0;

      element.dataset.target = target;
      element.dataset.animated = "true";

      animateNumber(element, target);
    });
  }

  // ---------------------------------------------
  // 8. PROJECT DETAILS MODAL
  // ---------------------------------------------

  function createTechnologyTags(project) {
    modalTechnologies.replaceChildren();

    const tags = project.querySelectorAll(".tags span");

    tags.forEach((tag) => {
      const technology = document.createElement("span");

      technology.textContent = tag.textContent.trim();

      modalTechnologies.appendChild(technology);
    });
  }

  function createFeatureList(project) {
    modalFeatures.replaceChildren();

    const features = (project.dataset.features || "")
      .split("|")
      .filter((feature) => feature.trim() !== "");

    features.forEach((feature) => {
      const item = document.createElement("li");

      item.textContent = feature.trim();

      modalFeatures.appendChild(item);
    });
  }

  function configureModalLink(modalLink, cardLink) {
    const url = cardLink.getAttribute("href");

    if (!url || url === "#") {
      modalLink.hidden = true;
      modalLink.removeAttribute("href");
      return;
    }

    modalLink.href = url;
    modalLink.hidden = false;
  }

  function openProjectModal(project, triggerButton) {
    lastFocusedElement = triggerButton;

    modalImage.src = project.dataset.image;
    modalImage.alt = project.dataset.imageAlt || project.dataset.name;

    modalCategory.textContent =
      project.querySelector(".project-type").textContent;

    modalTitle.textContent = project.dataset.name;
    modalDescription.textContent = project.dataset.description;
    modalLearning.textContent = project.dataset.learning;

    // Update the status badge.
    const status = project.dataset.status;

    const statusNames = {
      completed: "Completed",
      progress: "In Progress",
      concept: "Concept",
    };

    modalStatus.className = "project-status";

    modalStatus.classList.add(
      status === "completed"
        ? "status-completed"
        : status === "progress"
          ? "status-progress"
          : "status-concept",
    );

    modalStatus.textContent = statusNames[status] || "Concept";

    createFeatureList(project);
    createTechnologyTags(project);

    const projectPage = project.querySelector(".view-project");
    const demoLink = project.querySelector("[data-demo-link]");
    const githubLink = project.querySelector("[data-github-link]");

    if (projectPage) {
      configureModalLink(modalProjectPage, projectPage);
    }

    if (demoLink) {
      configureModalLink(modalDemo, demoLink);
    } else if (modalDemo) {
      modalDemo.hidden = true;
      modalDemo.removeAttribute("href");
    }

    if (githubLink) {
      configureModalLink(modalGithub, githubLink);
    } else if (modalGithub) {
      modalGithub.hidden = true;
      modalGithub.removeAttribute("href");
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("project-modal-open");

    closeModalButton.focus();
  }

  function closeProjectModal() {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("project-modal-open");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  projects.forEach((project) => {
    const previewButton = project.querySelector("[data-preview]");

    if (!previewButton) return;

    previewButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openProjectModal(project, previewButton);
    });
  });

  closeModalButton.addEventListener("click", closeProjectModal);

  // Close by clicking outside the modal content.
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeProjectModal();
    }
  });

  // Close with Escape and keep keyboard focus in the dialog.
  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeProjectModal();
    }

    if (event.key === "Tab") {
      const focusableElements = modalContent.querySelectorAll(
        "a[href]:not([hidden]), button:not([disabled]):not([hidden])",
      );

      if (!focusableElements.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  // ---------------------------------------------
  // 9. INITIALIZE THE PROJECT PAGE
  // ---------------------------------------------

  updateFavoriteButtons();
  filterProjects();
  initializeStatistics();
})();

// =====================================
// WALKING PET FEATURE
// =====================================

(function () {
  "use strict";

  // Prevent duplicate pets
  if (document.getElementById("walkingPet")) return;

  const pets = [
    {
      emoji: "🐱",
      name: "Cat",
      messages: [
        "Meow! Welcome to my human's portfolio! 🐾",
        "I inspect code by sitting on the keyboard.",
        "Have you tried turning it off and on again?",
        "Purr-gramming is hard work!",
        "Don't forget to take a break!",
      ],
    },
    {
      emoji: "🐶",
      name: "Dog",
      messages: [
        "Woof! Nice to meet you!",
        "I give this portfolio 10/10 bones!",
        "Who's a good developer? You are!",
        "Let's fetch some bugs!",
        "Keep chasing your dreams!",
      ],
    },
    {
      emoji: "🐥",
      name: "Duck",
      messages: [
        "Quack! Welcome to the website!",
        "Just waddling through the internet.",
        "Debugging? More like duck-bugging!",
        "You look like you need a quack break!",
        "Quack happens. Keep going!",
      ],
    },
  ];

  let currentPet = 0;
  let currentMessage = 0;

  const pet = document.createElement("div");
  pet.id = "walkingPet";
  pet.className = "walking-pet";

  pet.innerHTML = `
    <div class="pet-speech" id="petSpeech" role="status"
         aria-live="polite"></div>
    <button type="button" id="petButton"
      aria-label="Walking cat. Click to change pet">
      🐱
    </button>
  `;

  document.body.appendChild(pet);

  const petButton = document.getElementById("petButton");
  const petSpeech = document.getElementById("petSpeech");

  let speechTimeout;

  function showMessage(message) {
    petSpeech.textContent = message;
    petSpeech.classList.add("show");

    clearTimeout(speechTimeout);

    speechTimeout = setTimeout(() => {
      petSpeech.classList.remove("show");
    }, 3500);
  }

  petButton.addEventListener("click", function () {
    currentPet = (currentPet + 1) % pets.length;
    currentMessage = 0;

    const selectedPet = pets[currentPet];

    petButton.textContent = selectedPet.emoji;
    petButton.setAttribute(
      "aria-label",
      `Walking ${selectedPet.name.toLowerCase()}. Click to change pet`,
    );

    showMessage(selectedPet.messages[currentMessage]);
  });

  // Occasionally show a message when the visitor clicks the pet.
  petButton.addEventListener("dblclick", function (event) {
    event.preventDefault();

    const selectedPet = pets[currentPet];

    currentMessage = (currentMessage + 1) % selectedPet.messages.length;

    showMessage(selectedPet.messages[currentMessage]);
  });
})();

// Always start at the top when the page loads
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
});

/* ==========================================
   FUTURISTIC DASHBOARD + UI EFFECTS
   Shane Vincent Olavario Portfolio
   ========================================== */

(function initPortfolioEnhancements() {
  "use strict";

  function startEnhancements() {
    // Prevent duplicate initialization if this script is initialized again.
    if (document.documentElement.dataset.portfolioEnhancements === "ready") {
      return;
    }

    document.documentElement.dataset.portfolioEnhancements = "ready";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* ======================================
       1. LIVE DASHBOARD
       ====================================== */

    const clock = document.getElementById("devClock");
    const date = document.getElementById("devDate");
    const greeting = document.getElementById("devGreeting");
    const sessionTime = document.getElementById("devSessionTime");
    const sessionProgress = document.getElementById("devSessionProgress");
    const sessionProgressFill = document.getElementById(
      "devSessionProgressFill",
    );
    const lastUpdated = document.getElementById("devLastUpdated");

    const sessionStartedAt = Date.now();

    function padNumber(value) {
      return String(value).padStart(2, "0");
    }

    function formatDuration(totalSeconds) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return [padNumber(hours), padNumber(minutes), padNumber(seconds)].join(
        ":",
      );
    }

    function updateDashboard() {
      const now = new Date();
      const hour = now.getHours();

      if (clock) {
        clock.textContent = now.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      }

      if (date) {
        date.textContent = now.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }

      if (greeting) {
        let message = "Good evening";

        if (hour >= 5 && hour < 12) {
          message = "Good morning";
        } else if (hour >= 12 && hour < 18) {
          message = "Good afternoon";
        }

        greeting.replaceChildren();

        const greetingText = document.createTextNode(message + ", ");
        const name = document.createElement("span");
        name.textContent = "Developer.";

        greeting.append(greetingText, name);
      }

      const elapsedSeconds = Math.floor((Date.now() - sessionStartedAt) / 1000);

      if (sessionTime) {
        sessionTime.textContent = formatDuration(elapsedSeconds);
      }

      if (sessionProgress) {
        const referenceSeconds = 3600;
        const progress = Math.min(
          100,
          (elapsedSeconds / referenceSeconds) * 100,
        );

        sessionProgress.setAttribute(
          "aria-valuenow",
          String(Math.min(elapsedSeconds, referenceSeconds)),
        );

        sessionProgress.setAttribute(
          "aria-valuetext",
          formatDuration(elapsedSeconds) + " elapsed",
        );

        if (sessionProgressFill) {
          sessionProgressFill.style.width = progress + "%";
        }
      }

      if (lastUpdated) {
        lastUpdated.textContent =
          "LAST SYNC " +
          now.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
      }
    }

    updateDashboard();

    // Keep the dashboard current, even if the user returns to the tab.
    window.setInterval(updateDashboard, 1000);

    /* ======================================
       2. SCROLL READING PROGRESS
       ====================================== */

    const progressBar = document.getElementById("fxReadingProgress");
    const progressFill = document.getElementById("fxReadingProgressFill");

    let scrollUpdatePending = false;

    function updateScrollEffects() {
      scrollUpdatePending = false;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const percentage =
        scrollableHeight > 0
          ? Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100))
          : 0;

      if (progressFill) {
        progressFill.style.width = percentage + "%";
      }

      if (progressBar) {
        progressBar.setAttribute(
          "aria-valuenow",
          String(Math.round(percentage)),
        );

        progressBar.setAttribute(
          "aria-valuetext",
          Math.round(percentage) + "% of page scrolled",
        );
      }

      /* ====================================
         3. BACK-TO-TOP BUTTON
         ==================================== */

      const backToTop = document.getElementById("fxBackToTop");

      if (backToTop) {
        const shouldShow = scrollTop > 400;

        backToTop.classList.toggle("is-visible", shouldShow);
        backToTop.tabIndex = shouldShow ? 0 : -1;
        backToTop.setAttribute("aria-hidden", String(!shouldShow));
      }
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!scrollUpdatePending) {
          scrollUpdatePending = true;
          window.requestAnimationFrame(updateScrollEffects);
        }
      },
      { passive: true },
    );

    window.addEventListener("resize", updateScrollEffects, {
      passive: true,
    });

    updateScrollEffects();

    const backToTop = document.getElementById("fxBackToTop");

    if (backToTop) {
      backToTop.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });
      });
    }

    /* ======================================
       4. SCROLL REVEAL ANIMATIONS
       ====================================== */

    const revealSelectors = [
      ".hero-text",
      ".hero-card",
      ".section-heading",
      ".terminal-window",
      ".game-picker-card",
      ".dev-widget",
      ".quiz-panel",
      ".quiz-result",
      ".memory-game-panel",
      ".guess-panel",
    ];

    const revealElements = document.querySelectorAll(
      revealSelectors.join(", "),
    );

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      // Never leave content hidden if animations are disabled
      // or IntersectionObserver is unsupported.
      revealElements.forEach(function (element) {
        element.classList.add("fx-revealed");
      });
    } else {
      const revealObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("fx-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -35px 0px",
        },
      );

      revealElements.forEach(function (element) {
        // Do not animate sections that are initially hidden,
        // such as the memory and number games.
        if (
          element.closest("[hidden]") ||
          element.classList.contains("fx-revealed")
        ) {
          return;
        }

        element.classList.add("fx-reveal");
        revealObserver.observe(element);
      });
    }

    /* ======================================
       5. SUBTLE CURSOR GLOW
       Desktop mouse/trackpad only.
       ====================================== */

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (finePointer.matches && !reducedMotion.matches) {
      const glow = document.createElement("div");

      glow.className = "fx-cursor-glow";
      glow.setAttribute("aria-hidden", "true");

      document.body.appendChild(glow);

      let cursorFrame = null;
      let cursorX = 0;
      let cursorY = 0;

      document.addEventListener(
        "pointermove",
        function (event) {
          if (event.pointerType !== "mouse") {
            return;
          }

          cursorX = event.clientX;
          cursorY = event.clientY;

          if (cursorFrame !== null) {
            return;
          }

          cursorFrame = window.requestAnimationFrame(function () {
            glow.style.left = cursorX + "px";
            glow.style.top = cursorY + "px";
            glow.style.opacity = "1";
            cursorFrame = null;
          });
        },
        { passive: true },
      );

      document.addEventListener("pointerleave", function () {
        glow.style.opacity = "0";
      });
    }

    /* ======================================
       6. ACCESSIBILITY PREFERENCE CHANGES
       ====================================== */

    function handleMotionPreferenceChange(event) {
      if (!event.matches) {
        return;
      }

      document.querySelectorAll(".fx-reveal").forEach(function (element) {
        element.classList.add("fx-revealed");
      });

      const glow = document.querySelector(".fx-cursor-glow");

      if (glow) {
        glow.remove();
      }
    }

    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", handleMotionPreferenceChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startEnhancements, {
      once: true,
    });
  } else {
    startEnhancements();
  }
})();

/* Scroll Progress Bar */
document.addEventListener("DOMContentLoaded", () => {
  let progressBar = document.getElementById("scroll-progress");

  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.id = "scroll-progress";
    document.body.prepend(progressBar);
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true
  });

  window.addEventListener("resize", updateScrollProgress);

  updateScrollProgress();
});