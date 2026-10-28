
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "vincentDeveloperAchievementsV1";

  const achievements = [
    {
      id: "first_visit",
      icon: "👋",
      title: "Welcome, Developer",
      description: "Visit your portfolio.",
      xp: 10,
    },
    {
      id: "page_explorer",
      icon: "🧭",
      title: "Explorer",
      description: "Visit 3 different portfolio pages.",
      xp: 25,
    },
    {
      id: "project_viewer",
      icon: "🗂️",
      title: "Project Explorer",
      description: "Explore the Projects page.",
      xp: 20,
    },
    {
      id: "terminal_user",
      icon: "⌨️",
      title: "Terminal Initiate",
      description: "Run a command in the portfolio terminal.",
      xp: 20,
    },
    {
      id: "game_player",
      icon: "🎮",
      title: "Player One",
      description: "Start a portfolio game.",
      xp: 20,
    },
    {
      id: "quiz_finisher",
      icon: "🧠",
      title: "Knowledge Seeker",
      description: "Complete the programming quiz.",
      xp: 30,
    },
    {
      id: "memory_master",
      icon: "🧩",
      title: "Memory Challenger",
      description: "Match all pairs in the memory game.",
      xp: 40,
    },
    {
      id: "number_winner",
      icon: "🎯",
      title: "Lucky Guesser",
      description: "Win the number guessing game.",
      xp: 30,
    },
    {
      id: "contact_explorer",
      icon: "✉️",
      title: "Let's Connect",
      description: "Visit the Contact page.",
      xp: 15,
    },
    {
      id: "skill_explorer",
      icon: "💻",
      title: "Skill Scout",
      description: "Explore the Skills page.",
      xp: 15,
    },
  ];

  const pageName = location.pathname.split("/").pop().toLowerCase();

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

      if (saved && typeof saved === "object") {
        return {
          xp: Number.isFinite(saved.xp) ? Math.max(0, saved.xp) : 0,
          unlocked: Array.isArray(saved.unlocked) ? saved.unlocked : [],
          pages: Array.isArray(saved.pages) ? saved.pages : [],
        };
      }
    } catch (error) {
      console.warn("Could not load achievement progress.", error);
    }

    return { xp: 0, unlocked: [], pages: [] };
  }

  let progress = loadProgress();
  let toastTimer;

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn("Could not save achievement progress.", error);
    }
  }

  // Build the interface without changing existing page HTML.
  const widget = document.createElement("div");
  widget.className = "achievement-widget";

  widget.innerHTML = `
    <button class="achievement-launcher" id="achievementLauncher"
      type="button" aria-expanded="false" aria-controls="achievementPanel">
      <span class="achievement-launcher-icon" aria-hidden="true">🏆</span>
      <span class="achievement-launcher-label">Achievements</span>
      <span class="achievement-level-pill" id="achievementLevelPill">LVL 1</span>
    </button>

    <section class="achievement-panel" id="achievementPanel" hidden
      aria-label="Developer achievements">
      <div class="achievement-panel-header">
        <div>
          <p class="achievement-eyebrow">DEVELOPER PROGRESSION</p>
          <h2>Achievements</h2>
        </div>
        <button class="achievement-close" id="achievementClose"
          type="button" aria-label="Close achievements">&times;</button>
      </div>

      <p class="achievement-total-label">TOTAL EXPERIENCE</p>
      <p class="achievement-total-xp"><span id="achievementXP">0</span> XP</p>
      <p class="achievement-level-text" id="achievementLevelText">Level 1 · Beginner</p>

      <div class="achievement-track" role="progressbar"
        id="achievementProgress" aria-label="Progress to next level"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="achievement-track-fill" id="achievementProgressFill"></div>
      </div>
      <p class="achievement-next-level" id="achievementNextLevel"></p>

      <h3 class="achievement-section-title" id="achievementCount"></h3>
      <div class="achievement-list" id="achievementList"></div>
    </section>
  </div>

  <div class="achievement-toast" id="achievementToast" role="status"
    aria-live="polite" hidden>
    <span class="achievement-toast-icon" id="achievementToastIcon">🏆</span>
    <div>
      <strong id="achievementToastTitle">Achievement unlocked!</strong>
      <p id="achievementToastDescription"></p>
    </div>
  </div>`;

  document.body.appendChild(widget);

  const launcher = document.getElementById("achievementLauncher");
  const panel = document.getElementById("achievementPanel");
  const closeButton = document.getElementById("achievementClose");
  const list = document.getElementById("achievementList");
  const toast = document.getElementById("achievementToast");

  function getLevel(xp) {
    // Level 1 starts at 0 XP; each level requires another 100 XP.
    return Math.floor(xp / 100) + 1;
  }

  function render() {
    const level = getLevel(progress.xp);
    const xpIntoLevel = progress.xp % 100;
    const unlockedSet = new Set(progress.unlocked);

    document.getElementById("achievementXP").textContent = progress.xp;
    document.getElementById("achievementLevelPill").textContent = `LVL ${level}`;
    document.getElementById("achievementLevelText").textContent =
      `Level ${level} · ${level < 3 ? "Beginner" : level < 6 ? "Builder" : "Advanced Developer"}`;

    document.getElementById("achievementProgressFill").style.width =
      `${xpIntoLevel}%`;

    document.getElementById("achievementProgress").setAttribute(
      "aria-valuenow",
      String(xpIntoLevel)
    );

    document.getElementById("achievementNextLevel").textContent =
      `${100 - xpIntoLevel} XP to Level ${level + 1}`;

    document.getElementById("achievementCount").textContent =
      `UNLOCKED ${progress.unlocked.length} / ${achievements.length}`;

    list.replaceChildren();

    achievements.forEach((achievement) => {
      const unlocked = unlockedSet.has(achievement.id);
      const item = document.createElement("article");
      item.className = `achievement-item${unlocked ? " unlocked" : ""}`;

      const icon = document.createElement("div");
      icon.className = "achievement-icon";
      icon.textContent = unlocked ? achievement.icon : "🔒";
      icon.setAttribute("aria-hidden", "true");

      const info = document.createElement("div");
      const title = document.createElement("h4");
      title.textContent = achievement.title;

      const description = document.createElement("p");
      description.textContent = achievement.description;

      info.append(title, description);

      const reward = document.createElement("span");
      reward.className = "achievement-reward";
      reward.textContent = unlocked ? "✓ EARNED" : `+${achievement.xp} XP`;

      item.append(icon, info, reward);
      list.appendChild(item);
    });
  }

  function showToast(achievement) {
    document.getElementById("achievementToastIcon").textContent =
      achievement.icon;
    document.getElementById("achievementToastTitle").textContent =
      `Achievement unlocked: ${achievement.title}`;
    document.getElementById("achievementToastDescription").textContent =
      `+${achievement.xp} XP earned`;

    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 3500);
  }

  function unlockAchievement(id) {
    const achievement = achievements.find((item) => item.id === id);

    if (!achievement || progress.unlocked.includes(id)) return;

    progress.unlocked.push(id);
    progress.xp += achievement.xp;

    saveProgress();
    render();
    showToast(achievement);
  }

  launcher.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    launcher.setAttribute("aria-expanded", String(!panel.hidden));
  });

  closeButton.addEventListener("click", () => {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      panel.hidden = true;
      launcher.setAttribute("aria-expanded", "false");
      launcher.focus();
    }
  });

  // Track unique pages across the portfolio.
  if (pageName && !progress.pages.includes(pageName)) {
    progress.pages.push(pageName);
    saveProgress();
  }

  unlockAchievement("first_visit");

  if (progress.pages.length >= 3) {
    unlockAchievement("page_explorer");
  }

  if (pageName === "projects.html") {
    unlockAchievement("project_viewer");
  }

  if (pageName === "skills.html") {
    unlockAchievement("skill_explorer");
  }

  if (pageName === "contact.html") {
    unlockAchievement("contact_explorer");
  }

  // Homepage terminal.
  const terminalForm = document.getElementById("terminalForm");
  if (terminalForm) {
    terminalForm.addEventListener("submit", () => {
      unlockAchievement("terminal_user");
    });
  }

  // Game selection buttons.
  document.querySelectorAll("[data-open-game]").forEach((button) => {
    button.addEventListener("click", () => {
      unlockAchievement("game_player");
    });
  });

  // Quiz completion. Observe the result panel becoming visible.
  const quizResult = document.getElementById("quizResult");
  if (quizResult) {
    const quizObserver = new MutationObserver(() => {
      if (!quizResult.hidden) {
        unlockAchievement("quiz_finisher");
      }
    });

    quizObserver.observe(quizResult, {
      attributes: true,
      attributeFilter: ["hidden", "class", "style"],
    });
  }

  // Memory game completion.
  const memoryMessage = document.getElementById("memoryMessage");
  if (memoryMessage) {
    const memoryObserver = new MutationObserver(() => {
      const message = memoryMessage.textContent.toLowerCase();

      if (
        message.includes("you won") ||
        message.includes("congratulations") ||
        message.includes("all pairs") ||
        message.includes("completed")
      ) {
        unlockAchievement("memory_master");
      }
    });

    memoryObserver.observe(memoryMessage, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  // Number guessing game win detection.
  const guessMessage = document.getElementById("guessMessage");
  if (guessMessage) {
    const guessObserver = new MutationObserver(() => {
      const message = guessMessage.textContent.toLowerCase();

      if (
        message.includes("correct") ||
        message.includes("you guessed it") ||
        message.includes("you win") ||
        message.includes("congratulations")
      ) {
        unlockAchievement("number_winner");
      }
    });

    guessObserver.observe(guessMessage, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  render();
});
