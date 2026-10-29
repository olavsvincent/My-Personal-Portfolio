
(() => {
  "use strict";

  const STORAGE_KEY = "olavario-custom-cursor-v1";

  const defaults = {
    enabled: true,
    color: "#38bdf8",
    size: 28,
    glow: true,
    glowAmount: 14,
    trail: true,
    animation: "smooth"
  };

  let settings = { ...defaults };
  let cursor;
  let arrow;
  let panel;
  let launcher;
  let lastTrail = 0;
  let pointerX = -100;
  let pointerY = -100;
  let visible = false;

  const finePointer = window.matchMedia(
    "(pointer: fine) and (hover: hover)"
  );

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

      settings = {
        ...defaults,
        ...saved
      };
    } catch {
      settings = { ...defaults };
    }

    if (!/^#[0-9a-f]{6}$/i.test(settings.color)) {
      settings.color = defaults.color;
    }

    settings.size = Math.max(16, Math.min(48, Number(settings.size) || 28));
    settings.glowAmount = Math.max(
      0,
      Math.min(30, Number(settings.glowAmount) || 0)
    );

    if (!["smooth", "pulse", "none"].includes(settings.animation)) {
      settings.animation = "smooth";
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // The cursor still works if storage is unavailable.
    }
  }

  function createCursor() {
    cursor = document.createElement("div");
    cursor.className = "cc-cursor";
    cursor.setAttribute("aria-hidden", "true");

    arrow = document.createElement("div");
    arrow.className = "cc-cursor-arrow";
    cursor.appendChild(arrow);

    document.body.appendChild(cursor);
  }

  function createPanel() {
    launcher = document.createElement("button");
    launcher.className = "cc-settings-toggle";
    launcher.type = "button";
    launcher.textContent = "↗";
    launcher.title = "Customize mouse cursor";
    launcher.setAttribute("aria-label", "Customize mouse cursor");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "ccSettingsPanel");

    panel = document.createElement("section");
    panel.className = "cc-settings-panel";
    panel.id = "ccSettingsPanel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "Cursor customization");

    panel.innerHTML = `
      <div class="cc-settings-header">
        <h3>CURSOR SETTINGS</h3>
        <button class="cc-settings-close" type="button"
          aria-label="Close settings">&times;</button>
      </div>

      <label class="cc-setting-row">
        <span>Enable custom cursor</span>
        <input id="ccEnabled" type="checkbox">
      </label>

      <label class="cc-setting">
        <span class="cc-setting-label">Arrow color</span>
        <input id="ccColor" type="color">
      </label>

      <label class="cc-setting">
        <span class="cc-setting-label">
          <span>Arrow size</span>
          <output id="ccSizeValue"></output>
        </span>
        <input id="ccSize" type="range" min="16" max="48" step="1">
      </label>

      <label class="cc-setting-row">
        <span>Glow effect</span>
        <input id="ccGlow" type="checkbox">
      </label>

      <label class="cc-setting">
        <span class="cc-setting-label">
          <span>Glow intensity</span>
          <output id="ccGlowValue"></output>
        </span>
        <input id="ccGlowAmount" type="range" min="0" max="30" step="1">
      </label>

      <label class="cc-setting-row">
        <span>Cursor trail</span>
        <input id="ccTrail" type="checkbox">
      </label>

      <label class="cc-setting">
        <span class="cc-setting-label">Animation</span>
        <select id="ccAnimation">
          <option value="smooth">Smooth</option>
          <option value="pulse">Pulse</option>
          <option value="none">None</option>
        </select>
      </label>

      <div class="cc-settings-actions">
        <button id="ccReset" type="button">Reset defaults</button>
      </div>

      <p class="cc-settings-note">
        Your preferences are saved in this browser.
        Touchscreen devices use their normal cursor behavior.
      </p>
    `;

    document.body.append(launcher, panel);

    launcher.addEventListener("click", () => {
      const open = panel.hidden;
      panel.hidden = !open;
      launcher.setAttribute("aria-expanded", String(open));
    });

    panel.querySelector(".cc-settings-close").addEventListener("click", closePanel);

    panel.addEventListener("click", event => {
      event.stopPropagation();
    });

    document.addEventListener("click", event => {
      if (!panel.hidden &&
          !panel.contains(event.target) &&
          !launcher.contains(event.target)) {
        closePanel();
      }
    });

    panel.querySelector("#ccEnabled").addEventListener("change", event => {
      settings.enabled = event.target.checked;
      updateSettings();
    });

    panel.querySelector("#ccColor").addEventListener("input", event => {
      settings.color = event.target.value;
      updateSettings();
    });

    panel.querySelector("#ccSize").addEventListener("input", event => {
      settings.size = Number(event.target.value);
      updateSettings();
    });

    panel.querySelector("#ccGlow").addEventListener("change", event => {
      settings.glow = event.target.checked;
      updateSettings();
    });

    panel.querySelector("#ccGlowAmount").addEventListener("input", event => {
      settings.glowAmount = Number(event.target.value);
      updateSettings();
    });

    panel.querySelector("#ccTrail").addEventListener("change", event => {
      settings.trail = event.target.checked;
      updateSettings();
    });

    panel.querySelector("#ccAnimation").addEventListener("change", event => {
      settings.animation = event.target.value;
      updateSettings();
    });

    panel.querySelector("#ccReset").addEventListener("click", () => {
      settings = { ...defaults };
      updateSettings();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closePanel();
    });
  }

  function closePanel() {
    if (!panel) return;
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
  }

  function syncControls() {
    panel.querySelector("#ccEnabled").checked = settings.enabled;
    panel.querySelector("#ccColor").value = settings.color;
    panel.querySelector("#ccSize").value = settings.size;
    panel.querySelector("#ccSizeValue").textContent = `${settings.size}px`;
    panel.querySelector("#ccGlow").checked = settings.glow;
    panel.querySelector("#ccGlowAmount").value = settings.glowAmount;
    panel.querySelector("#ccGlowValue").textContent =
      `${settings.glowAmount}px`;
    panel.querySelector("#ccTrail").checked = settings.trail;
    panel.querySelector("#ccAnimation").value = settings.animation;
  }

  function updateSettings() {
    document.documentElement.style.setProperty("--cc-color", settings.color);
    document.documentElement.style.setProperty("--cc-size", `${settings.size}px`);
    document.documentElement.style.setProperty(
      "--cc-glow",
      `${settings.glowAmount}px`
    );

    document.documentElement.style.setProperty(
      "--cc-glow-opacity",
      settings.glow ? "0.75" : "0"
    );

    document.documentElement.classList.toggle(
      "cc-enabled",
      Boolean(settings.enabled && finePointer.matches)
    );

    cursor.classList.toggle(
      "cc-no-glow",
      !settings.glow || settings.glowAmount === 0
    );

    cursor.classList.toggle("cc-pulse", settings.animation === "pulse");
    cursor.classList.toggle("cc-no-animation", settings.animation === "none");

    launcher.style.display = finePointer.matches ? "grid" : "none";

    if (!settings.enabled || !finePointer.matches) {
      cursor.classList.remove("cc-visible");
      visible = false;
    } else if (visible) {
      cursor.classList.add("cc-visible");
    }

    syncControls();
    saveSettings();
  }

  function moveCursor(event) {
    if (!finePointer.matches || !settings.enabled) return;

    pointerX = event.clientX;
    pointerY = event.clientY;

    cursor.style.transform =
      `translate3d(${pointerX}px, ${pointerY}px, 0)`;

    if (!visible) {
      cursor.classList.add("cc-visible");
      visible = true;
    }

    const target = event.target;
    const interactive = target instanceof Element &&
      target.closest(
        "a, button, [role='button'], input[type='submit'], input[type='button']"
      );

    cursor.classList.toggle("cc-hover", Boolean(interactive));

    if (settings.trail) {
      const now = performance.now();

      if (now - lastTrail > 35) {
        createTrailDot(pointerX, pointerY);
        lastTrail = now;
      }
    }
  }

  function createTrailDot(x, y) {
    const dot = document.createElement("span");
    dot.className = "cc-trail-dot";
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    document.body.appendChild(dot);

    window.setTimeout(() => dot.remove(), 500);
  }

  function handlePointerDown() {
    if (settings.enabled && finePointer.matches) {
      cursor.classList.add("cc-click");
    }
  }

  function handlePointerUp() {
    cursor.classList.remove("cc-click");
  }

  function handlePointerLeave() {
    cursor.classList.remove("cc-visible");
    visible = false;
  }

  function handlePointerEnter() {
    if (settings.enabled && finePointer.matches && visible) {
      cursor.classList.add("cc-visible");
    }
  }

  function init() {
    loadSettings();
    createCursor();
    createPanel();
    updateSettings();

    document.addEventListener("pointermove", moveCursor, { passive: true });
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("pointerenter", handlePointerEnter);

    if (finePointer.addEventListener) {
      finePointer.addEventListener("change", updateSettings);
    } else {
      finePointer.addListener(updateSettings);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
