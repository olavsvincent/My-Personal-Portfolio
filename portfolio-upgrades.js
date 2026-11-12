
(() => {
  "use strict";

  if (document.getElementById("portfolioUpgradeRoot")) return;

  const root = document.createElement("div");
  root.id = "portfolioUpgradeRoot";

  root.innerHTML = `
    <button class="upgrade-launcher" id="upgradeLauncher"
      type="button" aria-label="Open portfolio control center"
      aria-expanded="false" title="Portfolio Control Center">✦</button>

    <section class="upgrade-panel" id="upgradePanel"
      aria-label="Portfolio control center" hidden>

      <header class="upgrade-header">
        <div>
          <h2 class="upgrade-heading">NEXUS CONTROL</h2>
          <p class="upgrade-subtitle">Portfolio interactive systems</p>
        </div>
        <button class="upgrade-close" id="upgradeClose"
          type="button" aria-label="Close control center">✕</button>
      </header>

      <div class="upgrade-tabs" role="tablist" aria-label="Control center">
        <button class="upgrade-tab" data-view="activity" role="tab"
          aria-selected="true">📡 Activity</button>
        <button class="upgrade-tab" data-view="theme" role="tab"
          aria-selected="false">🎨 Theme</button>
        <button class="upgrade-tab" data-view="ai" role="tab"
          aria-selected="false">🧠 AI Core</button>
      </div>

      <div class="upgrade-view" data-panel="activity">
        <div class="upgrade-section-heading">
          <span>LIVE ACTIVITY</span>
          <span class="upgrade-muted" id="upgradeActivityCount">0 events</span>
        </div>
        <ul class="upgrade-feed" id="upgradeFeed" aria-live="polite"></ul>
        <p class="upgrade-muted" style="margin-top:12px">
          Events shown here are local to this browser session.
        </p>
      </div>

      <div class="upgrade-view" data-panel="theme" hidden>
        <div class="upgrade-section-heading">ACCENT COLOR</div>
        <div class="upgrade-colors">
          <button class="upgrade-color" data-color="#8b5cf6"
            style="--swatch:#8b5cf6" aria-label="Purple theme"
            aria-pressed="true"></button>
          <button class="upgrade-color" data-color="#06b6d4"
            style="--swatch:#06b6d4" aria-label="Cyan theme"
            aria-pressed="false"></button>
          <button class="upgrade-color" data-color="#22c55e"
            style="--swatch:#22c55e" aria-label="Green theme"
            aria-pressed="false"></button>
          <button class="upgrade-color" data-color="#f97316"
            style="--swatch:#f97316" aria-label="Orange theme"
            aria-pressed="false"></button>
          <button class="upgrade-color" data-color="#ec4899"
            style="--swatch:#ec4899" aria-label="Pink theme"
            aria-pressed="false"></button>
        </div>

        <label class="upgrade-setting">
          <span>Light mode</span>
          <input type="checkbox" id="upgradeLightMode">
        </label>

        <label class="upgrade-setting">
          <span>Sound effects</span>
          <input type="checkbox" id="upgradeSoundToggle">
        </label>

        <button class="upgrade-button" id="upgradeResetTheme"
          type="button" style="width:100%">Reset preferences</button>
      </div>

      <div class="upgrade-view" data-panel="ai" hidden>
        <div class="upgrade-core-wrap">
          <button class="upgrade-core" id="upgradeCore"
            type="button" aria-label="Activate animated AI core">
            <span class="upgrade-core-orb">✦</span>
          </button>
        </div>
        <p class="upgrade-ai-status" id="upgradeAIStatus">SYSTEM ONLINE</p>
        <div class="upgrade-ai-response" id="upgradeAIResponse" aria-live="polite">
          Hello! I'm Nexus, your portfolio assistant. Ask me about this website.
        </div>
        <form class="upgrade-ai-form" id="upgradeAIForm">
          <input class="upgrade-ai-input" id="upgradeAIInput"
            placeholder="Try: projects, skills, help..."
            aria-label="Ask the portfolio assistant" maxlength="180"
            autocomplete="off" required>
          <button class="upgrade-button" type="submit">Send</button>
        </form>
        <p class="upgrade-muted" style="margin-top:10px">
          Local demo assistant. No external AI service is connected.
        </p>
      </div>

      <div class="upgrade-view" data-panel="eggs" hidden>
        <div class="upgrade-section-heading">SECRET TERMINAL</div>
        <p class="upgrade-muted">Enter a command to discover hidden features.</p>
        <form class="upgrade-ai-form" id="upgradeEggForm">
          <input class="upgrade-ai-input" id="upgradeEggInput"
            placeholder="Type a secret command..."
            aria-label="Secret command" maxlength="50"
            autocomplete="off" required>
          <button class="upgrade-button" type="submit">Run</button>
        </form>
        <code class="upgrade-command">help</code>
        <code class="upgrade-command">matrix</code>
        <code class="upgrade-command">konami</code>
        <code class="upgrade-command">whoami</code>
        <code class="upgrade-command">coffee</code>
      </div>
    </section>

    <div class="upgrade-toast" id="upgradeToast" role="status"
      aria-live="polite"></div>
  `;

  document.body.appendChild(root);

  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => root.querySelectorAll(selector);

  const storage = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem("nexus_" + key);
        return value === null ? fallback : value;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem("nexus_" + key, value);
      } catch {}
    }
  };

  const launcher = $("#upgradeLauncher");
  const panel = $("#upgradePanel");
  const feed = $("#upgradeFeed");
  const toast = $("#upgradeToast");

  let soundEnabled = storage.get("sound", "false") === "true";
  let toastTimer;
  let audioContext;

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function playSound(kind = "click") {
    if (!soundEnabled) return;

    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;

      audioContext ||= new Audio();
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;

      const frequencies = {
        click: 520,
        open: 660,
        success: 880,
        secret: 1040
      };

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        frequencies[kind] || 520, now
      );
      oscillator.frequency.exponentialRampToValueAtTime(260, now + 0.12);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
    } catch {}
  }

  function logActivity(message) {
    const item = document.createElement("li");
    item.className = "upgrade-feed-item";

    const dot = document.createElement("span");
    dot.className = "upgrade-feed-dot";
    dot.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    const text = document.createElement("p");
    text.className = "upgrade-feed-message";
    text.textContent = message;

    const time = document.createElement("time");
    time.className = "upgrade-feed-time";
    time.dateTime = new Date().toISOString();
    time.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    content.append(text, time);
    item.append(dot, content);
    feed.prepend(item);

    while (feed.children.length > 12) {
      feed.lastElementChild.remove();
    }

    $("#upgradeActivityCount").textContent =
      `${feed.children.length} events`;
  }

  function openPanel(view = "activity") {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    switchView(view);
    playSound("open");
  }

  function closePanel() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  function switchView(view) {
    $$(".upgrade-view").forEach((element) => {
      element.hidden = element.dataset.panel !== view;
    });

    $$(".upgrade-tab").forEach((button) => {
      button.setAttribute(
        "aria-selected",
        String(button.dataset.view === view)
      );
    });
  }

  launcher.addEventListener("click", () => {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  $("#upgradeClose").addEventListener("click", closePanel);

  $$(".upgrade-tab").forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view);
      playSound();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closePanel();

    if (
      event.altKey &&
      event.shiftKey &&
      event.key.toLowerCase() === "x"
    ) {
      event.preventDefault();
      panel.hidden ? openPanel() : closePanel();
    }
  });

  /* THEME CUSTOMIZER */

  function applyAccent(color) {
    const allowed = [
      "#8b5cf6", "#06b6d4", "#22c55e", "#f97316", "#ec4899"
    ];

    if (!allowed.includes(color)) color = "#8b5cf6";

    document.documentElement.style.setProperty(
      "--upgrade-accent", color
    );

    storage.set("accent", color);

    $$(".upgrade-color").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.color === color)
      );
    });
  }

  function applyLightMode(enabled) {
    const existing = document.documentElement.dataset.theme;

    /*
      Only take control of the page theme when this feature
      has an explicit saved preference.
    */
    if (enabled === null) {
      delete document.documentElement.dataset.nexusTheme;
      delete document.documentElement.dataset.nexusLight;
      return;
    }

    document.documentElement.dataset.nexusTheme = enabled
      ? "light"
      : "dark";
    document.documentElement.dataset.nexusLight = String(enabled);

    /*
      Integrates with common portfolio theme variables.
      If your existing website uses a different theme system,
      these rules can be adjusted without changing other features.
    */
    document.documentElement.style.colorScheme =
      enabled ? "light" : "dark";

    $("#upgradeLightMode").checked = enabled;

    if (existing === "light" || existing === "dark") {
      document.documentElement.dataset.theme = enabled
        ? "light"
        : "dark";
    }

    storage.set("light", String(enabled));
  }

  function syncThemeControl() {
    const saved = storage.get("light", "");
    $("#upgradeLightMode").checked = saved === "true";
    applyAccent(storage.get("accent", "#8b5cf6"));

    if (saved !== "") {
      applyLightMode(saved === "true");
    }
  }

  $$(".upgrade-color").forEach((button) => {
    button.addEventListener("click", () => {
      applyAccent(button.dataset.color);
      logActivity("Accent color changed");
      playSound("success");
    });
  });

  $("#upgradeLightMode").addEventListener("change", (event) => {
    applyLightMode(event.target.checked);
    logActivity(`Theme preference set to ${event.target.checked ? "light" : "dark"} mode`);
    playSound("success");
  });

  $("#upgradeSoundToggle").checked = soundEnabled;

  $("#upgradeSoundToggle").addEventListener("change", (event) => {
    soundEnabled = event.target.checked;
    storage.set("sound", String(soundEnabled));
    playSound("success");
    logActivity(`Sound effects ${soundEnabled ? "enabled" : "disabled"}`);
    notify(soundEnabled ? "Sound effects enabled" : "Sound effects disabled");
  });

  $("#upgradeResetTheme").addEventListener("click", () => {
    storage.set("accent", "#8b5cf6");
    storage.set("light", "");
    applyAccent("#8b5cf6");
    applyLightMode(null);
    $("#upgradeLightMode").checked = false;

    const oldTheme = document.documentElement.dataset.theme;
    if (oldTheme === "light" || oldTheme === "dark") {
      document.documentElement.dataset.theme = "dark";
    }

    storage.set("sound", "false");
    soundEnabled = false;
    $("#upgradeSoundToggle").checked = false;

    logActivity("Preferences reset");
    notify("Preferences reset. Check your original theme settings if needed.");
  });

  syncThemeControl();

  /* LOCAL PORTFOLIO ASSISTANT */

  const aiResponse = $("#upgradeAIResponse");
  const aiStatus = $("#upgradeAIStatus");

  function answerAssistant(message) {
    const query = message.toLowerCase().trim();
    aiStatus.textContent = "PROCESSING REQUEST";

    let answer = "";

    if (/\b(hello|hi|hey|greetings)\b/.test(query)) {
      answer = "Hello! Welcome to my portfolio. Explore my projects, skills, and background using the navigation menu.";
    } else if (query.includes("project")) {
      answer = "Visit the Projects page to explore my programming and engineering projects, including their descriptions and available demos.";
    } else if (query.includes("skill")) {
      answer = "Visit the Skills page to see the technologies and tools I am learning and practicing.";
    } else if (query.includes("about") || query.includes("who are you")) {
      answer = "I'm the local portfolio assistant. This portfolio presents its owner's background, learning journey, skills, and projects.";
    } else if (query.includes("contact") || query.includes("email")) {
      answer = "Open the Contact page to find the available contact options.";
    } else if (query.includes("theme") || query.includes("color")) {
      answer = "Open the Theme tab to change the accent color and sound preferences.";
    } else if (query.includes("help") || query.includes("what can you do")) {
      answer = "Try asking about projects, skills, about, contact, or theme. I use preset responses and do not send your messages to an AI service.";
    } else {
      answer = "I don't have a preset answer for that yet. Try asking about projects, skills, about, contact, or help.";
    }

    aiResponse.textContent = answer;
    aiStatus.textContent = "SYSTEM ONLINE";
    logActivity("Portfolio assistant used");
    playSound("success");
  }

  $("#upgradeAIForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const input = $("#upgradeAIInput");
    const message = input.value.trim();

    if (!message) return;

    answerAssistant(message);
    input.value = "";
  });

  $("#upgradeCore").addEventListener("click", () => {
    aiResponse.textContent =
      "Core scan complete. Portfolio systems are active. Choose a tab or ask me a question.";
    logActivity("AI core activated");
    playSound("success");
  });

  /* EASTER EGGS */

  const secrets = {
    help: "Commands: help, matrix, konami, whoami, coffee.",
    whoami: "IDENTITY: curious developer. STATUS: always learning.",
    coffee: "☕ Developer fuel detected. Keep building!",
    matrix: "Wake up, developer... The portfolio is yours to explore.",
    konami: "SECRET UNLOCKED: You found the hidden developer mode!"
  };

  function runSecret(command) {
    const key = command.trim().toLowerCase();

    if (key === "konami") {
      document.body.classList.toggle("nexus-secret-mode");
      notify("Secret mode toggled!");
    } else if (key === "matrix") {
      document.body.classList.toggle("nexus-matrix-mode");
      notify("Reality.exe has been questioned.");
    } else if (secrets[key]) {
      notify(secrets[key]);
    } else {
      notify("Unknown command. Type help.");
      return;
    }

    logActivity(`Secret command discovered: ${key}`);
    playSound("secret");
  }

  $("#upgradeEggForm").addEventListener("submit", (event) => {
    event.preventDefault();
    runSecret($("#upgradeEggInput").value);
    $("#upgradeEggInput").value = "";
  });

  /* SECRET KEYBOARD SEQUENCE: UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A */

  const sequence = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"
  ];
  let sequenceIndex = 0;

  document.addEventListener("keydown", (event) => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target.isContentEditable
    ) return;

    const key = event.key.length === 1
      ? event.key.toLowerCase()
      : event.key;

    if (key === sequence[sequenceIndex]) {
      sequenceIndex++;

      if (sequenceIndex === sequence.length) {
        sequenceIndex = 0;
        openPanel("eggs");
        runSecret("konami");
      }
    } else {
      sequenceIndex = key === sequence[0] ? 1 : 0;
    }
  });

  /* ACTIVITY TRACKING */

  logActivity(`Portfolio loaded: ${document.title || location.pathname}`);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const label = (
      link.innerText ||
      link.getAttribute("aria-label") ||
      link.title ||
      ""
    ).trim().replace(/\s+/g, " ").slice(0, 55);

    if (label) logActivity(`Navigation selected: ${label}`);
  });

  document.addEventListener("click", (event) => {
    const card = event.target.closest(
      ".project-card, .skill-card, [data-project]"
    );

    if (!card || root.contains(card)) return;

    const heading = card.querySelector("h2, h3, h4");
    if (heading) {
      logActivity(`Explored: ${heading.textContent.trim().slice(0, 55)}`);
    }
  });

  /*
    Secret shortcut: Alt + Shift + X
    Opens or closes the control center.
  */

  window.NexusPortfolio = {
    logActivity,
    open: openPanel,
    close: closePanel,
    notify,
    runSecret
  };
})();
