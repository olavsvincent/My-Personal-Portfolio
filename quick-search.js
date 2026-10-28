
(() => {
  const trigger = document.getElementById("quickSearchTrigger");
  const overlay = document.getElementById("quickSearchOverlay");
  const input = document.getElementById("quickSearchInput");
  const results = document.getElementById("quickSearchResults");

  if (!trigger || !overlay || !input || !results) return;

  const destinations = [
    { title: "Home", description: "Homepage and introduction", url: "index.html", keywords: "start hero introduction" },
    { title: "About", description: "Background and education", url: "about.html", keywords: "profile education biography" },
    { title: "Skills", description: "Technical skills and learning", url: "skills.html", keywords: "programming technology" },
    { title: "Projects", description: "Explore all projects", url: "projects.html", keywords: "work portfolio" },
    { title: "Student Management System", description: "Python project details", url: "project-details.html?project=student-management", keywords: "python student records oop" },
    { title: "Workout Planner", description: "Web development project details", url: "project-details.html?project=workout-planner", keywords: "html css javascript exercise" },
    { title: "Health Monitoring System", description: "Computer Engineering project details", url: "project-details.html?project=health-monitoring", keywords: "esp32 sensors heart rate spo2" },
    { title: "Contact", description: "Get in touch", url: "contact.html", keywords: "email message social" },
    { title: "Interactive Terminal", description: "Explore commands on the homepage", url: "index.html#terminalForm", keywords: "command console coding terminal" },
    { title: "Memory Game", description: "Play the matching game", url: "index.html#memory-game", keywords: "game cards match memory" },
    { title: "Programming Quiz", description: "Test your programming knowledge", url: "index.html#programming-quiz", keywords: "quiz questions score html css python" }
  ];

  let activeIndex = 0;
  let filteredDestinations = [];
  let previousFocus = null;

  function openSearch() {
    previousFocus = document.activeElement;
    overlay.classList.add("quick-search-open");
    overlay.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    input.value = "";
    renderResults("");
    input.focus();
  }

  function closeSearch() {
    overlay.classList.remove("quick-search-open");
    overlay.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    } else {
      trigger.focus();
    }
  }

  function navigateTo(destination) {
    if (!destination) return;

    const currentUrl = new URL(window.location.href);
    const destinationUrl = new URL(destination.url, currentUrl);

    // For a section on the current page, scroll directly to it.
    if (
      destinationUrl.pathname === currentUrl.pathname &&
      destinationUrl.search === currentUrl.search &&
      destinationUrl.hash
    ) {
      closeSearch();

      const target = document.querySelector(destinationUrl.hash);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.href = destinationUrl.href;
      }

      return;
    }

    window.location.href = destinationUrl.href;
  }

  function renderResults(query) {
    const normalizedQuery = query.trim().toLowerCase();

    filteredDestinations = destinations.filter((item) => {
      const searchableText =
        `${item.title} ${item.description} ${item.keywords}`.toLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    results.replaceChildren();
    activeIndex = 0;

    if (filteredDestinations.length === 0) {
      const empty = document.createElement("p");
      empty.className = "quick-search-empty";
      empty.textContent = "No results found. Try another search.";
      results.appendChild(empty);
      return;
    }

    filteredDestinations.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quick-search-result";
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", String(index === activeIndex));

      const textContainer = document.createElement("span");
      textContainer.className = "quick-search-result-text";

      const title = document.createElement("strong");
      title.textContent = item.title;

      const description = document.createElement("small");
      description.textContent = item.description;

      const arrow = document.createElement("span");
      arrow.className = "quick-search-arrow";
      arrow.textContent = "↗";
      arrow.setAttribute("aria-hidden", "true");

      textContainer.append(title, description);
      button.append(textContainer, arrow);

      button.addEventListener("mouseenter", () => {
        activeIndex = index;
        updateActiveResult();
      });

      button.addEventListener("click", () => navigateTo(item));

      results.appendChild(button);
    });

    updateActiveResult();
  }

  function updateActiveResult() {
    const buttons = results.querySelectorAll(".quick-search-result");

    buttons.forEach((button, index) => {
      button.setAttribute("aria-selected", String(index === activeIndex));

      if (index === activeIndex) {
        button.scrollIntoView({ block: "nearest" });
      }
    });
  }

  trigger.addEventListener("click", openSearch);

  input.addEventListener("input", () => {
    renderResults(input.value);
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", (event) => {
    const isSearchShortcut =
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k";

    if (isSearchShortcut) {
      event.preventDefault();

      if (overlay.classList.contains("quick-search-open")) {
        closeSearch();
      } else {
        openSearch();
      }

      return;
    }

    if (!overlay.classList.contains("quick-search-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      if (filteredDestinations.length) {
        activeIndex = (activeIndex + 1) % filteredDestinations.length;
        updateActiveResult();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      if (filteredDestinations.length) {
        activeIndex =
          (activeIndex - 1 + filteredDestinations.length) %
          filteredDestinations.length;

        updateActiveResult();
      }
    } else if (event.key === "Enter" && filteredDestinations.length) {
      event.preventDefault();
      navigateTo(filteredDestinations[activeIndex]);
    }
  });
})();
