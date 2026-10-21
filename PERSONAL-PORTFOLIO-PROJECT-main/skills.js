
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("skillSearch");
  const clearButton = document.getElementById("clearSkillSearch");
  const filterButtons = document.querySelectorAll(".skill-filter");
  const cards = document.querySelectorAll(".interactive-skill-card");
  const results = document.getElementById("skillsResults");
  const emptyMessage = document.getElementById("skillsEmpty");

  const detailPanel = document.getElementById("skillDetail");
  const detailTitle = document.getElementById("skillDetailTitle");
  const detailDescription = document.getElementById("skillDetailDescription");
  const detailLevel = document.getElementById("skillDetailLevel");
  const detailProjects = document.getElementById("skillDetailProjects");
  const closeDetail = document.getElementById("closeSkillDetail");

  if (!searchInput || cards.length === 0 || filterButtons.length === 0) {
    console.error("Skills page elements are missing. Check skills.html IDs.");
    return;
  }

  let activeFilter = "all";

  // Animate skill progress bars
  requestAnimationFrame(() => {
    document.querySelectorAll(".skill-progress").forEach((bar) => {
      bar.classList.add("animated");
    });
  });

  // Search and category filters
  function filterSkills() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category || "";
      const name = card.dataset.name || "";
      const text = `${name} ${card.textContent}`.toLowerCase();

      const matchesCategory =
        activeFilter === "all" || category === activeFilter;

      const matchesSearch = text.includes(query);
      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    if (results) {
      results.textContent = `Showing ${visibleCount} of ${cards.length} skills`;
    }

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      filterSkills();
    });
  });

  searchInput.addEventListener("input", filterSkills);

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      activeFilter = "all";

      filterButtons.forEach((button) => {
        const selected = button.dataset.filter === "all";
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });

      filterSkills();
      searchInput.focus();
    });
  }

  // Open a skill card using a click or keyboard
  function openSkillDetails(card) {
    if (
      !detailPanel ||
      !detailTitle ||
      !detailDescription ||
      !detailLevel ||
      !detailProjects
    ) {
      console.error("Skill detail panel elements are missing.");
      return;
    }

    detailTitle.textContent = card.querySelector("h3")?.textContent || "Skill";
    detailDescription.textContent = card.dataset.description || card.querySelector("p")?.textContent || "";
    detailLevel.textContent = card.dataset.level || "Learning";
    detailProjects.replaceChildren();

    const projects = (card.dataset.projects || "No related projects listed yet.")
      .split(",")
      .map((project) => project.trim())
      .filter(Boolean);

    projects.forEach((project) => {
      const item = document.createElement("li");
      item.textContent = project;
      detailProjects.appendChild(item);
    });

    detailPanel.hidden = false;
    detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openSkillDetails(card));

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSkillDetails(card);
      }
    });
  });

  if (closeDetail && detailPanel) {
    closeDetail.addEventListener("click", () => {
      detailPanel.hidden = true;
    });
  }

  // Initial page state
  filterSkills();
});
