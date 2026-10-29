/* ==========================================================
   PER-PAGE THEME CUSTOMIZER
   - Every page remembers its OWN accent color + light/dark mode.
   - Edit PAGE_DEFAULTS below to give a page a starting theme.
   - Visitors open the 🎨 button in the navbar to change it.
   ========================================================== */
(function () {
  "use strict";

  /* Optional starting theme per page (file name -> preset id).
     Leave a page out to keep the original site look.
     Example: "about.html": "ocean", "contact.html": "rose" */
  const PAGE_DEFAULTS = {
    // "index.html": "violet",
    // "about.html": "ocean",
    // "skills.html": "emerald",
    // "projects.html": "sunset",
    // "contact.html": "rose",
    // "editor.html": "teal",
  };

  const PRESETS = [
    { id: "violet",  name: "Violet",  a: "#8b5cf6", b: "#38bdf8" },
    { id: "ocean",   name: "Ocean",   a: "#2563eb", b: "#22d3ee" },
    { id: "emerald", name: "Emerald", a: "#10b981", b: "#a3e635" },
    { id: "sunset",  name: "Sunset",  a: "#f97316", b: "#facc15" },
    { id: "rose",    name: "Rose",    a: "#ec4899", b: "#fb7185" },
    { id: "crimson", name: "Crimson", a: "#e11d48", b: "#f97316" },
    { id: "teal",    name: "Teal",    a: "#14b8a6", b: "#60a5fa" },
    { id: "gold",    name: "Gold",    a: "#d4a017", b: "#f59e0b" },
  ];

  const PREFIX = "pageTheme:";
  const page =
    (location.pathname.split("/").pop() || "index.html").toLowerCase() ||
    "index.html";
  const KEY = PREFIX + page;

  const PAGE_NAMES = {
    "index.html": "Home",
    "about.html": "About",
    "skills.html": "Skills",
    "projects.html": "Projects",
    "contact.html": "Contact",
    "editor.html": "IDE",
  };
  const pageLabel =
    PAGE_NAMES[page] ||
    page.replace(/\.html$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  /* ---------- storage helpers ---------- */
  function read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  function write(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* theme still applies for this visit */
    }
  }

  /* ---------- color helpers ---------- */
  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  }
  function lighten(hex, amount) {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
  }
  function shiftHue(hex, deg) {
    let [r, g, b] = hexToRgb(hex).map((v) => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    h = (h + deg + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let rgb;
    if (h < 60) rgb = [c, x, 0];
    else if (h < 120) rgb = [x, c, 0];
    else if (h < 180) rgb = [0, c, x];
    else if (h < 240) rgb = [0, x, c];
    else if (h < 300) rgb = [x, 0, c];
    else rgb = [c, 0, x];
    return rgbToHex((rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255);
  }

  /* ---------- state ---------- */
  function defaultState() {
    return { accent: PAGE_DEFAULTS[page] || null, custom: null, mode: "auto" };
  }
  let state = Object.assign(defaultState(), read(KEY) || {});

  function resolveColors() {
    if (state.custom) {
      return { a: state.custom, b: shiftHue(lighten(state.custom, 0.1), 40) };
    }
    const preset = PRESETS.find((p) => p.id === state.accent);
    return preset ? { a: preset.a, b: preset.b } : null;
  }

  /* ---------- apply ---------- */
  function applyAccent() {
    const body = document.body;
    const colors = resolveColors();
    // "violet" is the original look, so treat it as no override at all
    const isOriginal = !state.custom && state.accent === "violet";
    if (!colors || isOriginal) {
      body.classList.remove("tc-active");
      ["--tc-accent", "--tc-accent-2", "--tc-rgb"].forEach((v) => body.style.removeProperty(v));
      return;
    }
    body.style.setProperty("--tc-accent", colors.a);
    body.style.setProperty("--tc-accent-2", colors.b);
    body.style.setProperty("--tc-rgb", hexToRgb(colors.a).join(", "));
    body.classList.add("tc-active");
  }

  function syncToggleIcon() {
    const icon = document.getElementById("themeIcon");
    const btn = document.getElementById("themeToggle");
    const isDark = document.body.classList.contains("dark-mode");
    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (btn) {
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  function applyMode() {
    if (state.mode === "dark") document.body.classList.add("dark-mode");
    else if (state.mode === "light") document.body.classList.remove("dark-mode");
    // "auto" leaves whatever the site-wide toggle decided
    syncToggleIcon();
  }

  function applyAll() {
    applyAccent();
    applyMode();
    refreshPanel();
  }

  function save() {
    const isDefault =
      !state.custom && state.mode === "auto" && state.accent === (PAGE_DEFAULTS[page] || null);
    write(KEY, isDefault ? null : state);
  }

  /* ---------- UI ---------- */
  let panel, trigger, toast;

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function build() {
    trigger = el("button", "tc-trigger", "🎨");
    trigger.type = "button";
    trigger.setAttribute("aria-label", "Customize theme for this page");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.title = "Customize theme for this page";

    const existingToggle = document.getElementById("themeToggle");
    if (existingToggle && existingToggle.parentNode) {
      existingToggle.parentNode.insertBefore(trigger, existingToggle.nextSibling);
    } else {
      trigger.classList.add("tc-floating");
      document.body.appendChild(trigger);
    }

    panel = el("div", "tc-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Page theme settings");

    const head = el("div", "tc-head");
    const titles = el("div");
    titles.appendChild(el("h2", "tc-title", "Customize theme"));
    titles.appendChild(el("p", "tc-page", "Applies to: " + pageLabel + " page only"));
    const close = el("button", "tc-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close theme settings");
    close.addEventListener("click", closePanel);
    head.append(titles, close);
    panel.appendChild(head);

    /* Accent presets */
    panel.appendChild(el("span", "tc-label", "Accent color"));
    const swatches = el("div", "tc-swatches");
    PRESETS.forEach((p) => {
      const wrap = el("span", "tc-swatch-wrap");
      const b = el("button", "tc-swatch", p.name);
      b.type = "button";
      b.dataset.preset = p.id;
      b.style.background = "linear-gradient(135deg, " + p.a + ", " + p.b + ")";
      b.style.color = p.a;
      b.setAttribute("aria-label", p.name + " theme");
      b.addEventListener("click", () => {
        state.accent = p.id;
        state.custom = null;
        save();
        applyAll();
        say(p.name + " applied to " + pageLabel);
      });
      wrap.append(b, el("span", "tc-swatch-name", p.name));
      swatches.appendChild(wrap);
    });
    panel.appendChild(swatches);

    /* Custom color */
    panel.appendChild(el("span", "tc-label", "Custom color"));
    const custom = el("div", "tc-custom");
    const picker = document.createElement("input");
    picker.type = "color";
    picker.id = "tcCustomColor";
    picker.value = "#8b5cf6";
    picker.setAttribute("aria-label", "Pick a custom accent color");
    picker.addEventListener("input", () => {
      state.custom = picker.value;
      state.accent = null;
      applyAll();
    });
    picker.addEventListener("change", () => {
      save();
      say("Custom color saved for " + pageLabel);
    });
    custom.append(picker, el("span", "", "Pick any color you like"));
    panel.appendChild(custom);

    /* Mode */
    panel.appendChild(el("span", "tc-label", "Appearance"));
    const modes = el("div", "tc-modes");
    [["auto", "Site"], ["light", "☀️ Light"], ["dark", "🌙 Dark"]].forEach(([id, label]) => {
      const b = el("button", "tc-mode", label);
      b.type = "button";
      b.dataset.mode = id;
      b.addEventListener("click", () => {
        state.mode = id;
        if (id === "auto") {
          // fall back to the site-wide choice
          let saved = null;
          try { saved = localStorage.getItem("portfolioTheme"); } catch (e) {}
          const dark = saved
            ? saved === "dark"
            : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
          document.body.classList.toggle("dark-mode", Boolean(dark));
        }
        save();
        applyAll();
        say(id === "auto" ? "Using the site-wide mode" : (id === "dark" ? "Dark" : "Light") + " mode for " + pageLabel);
      });
      modes.appendChild(b);
    });
    panel.appendChild(modes);

    /* Actions */
    const actions = el("div", "tc-actions");
    const reset = el("button", "tc-btn", "Reset page");
    reset.type = "button";
    reset.addEventListener("click", () => {
      state = defaultState();
      write(KEY, null);
      let saved = null;
      try { saved = localStorage.getItem("portfolioTheme"); } catch (e) {}
      const dark = saved
        ? saved === "dark"
        : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.body.classList.toggle("dark-mode", Boolean(dark));
      applyAll();
      say("This page was reset");
    });
    const all = el("button", "tc-btn tc-primary", "Use on all pages");
    all.type = "button";
    all.addEventListener("click", () => {
      try {
        Object.keys(localStorage)
          .filter((k) => k.indexOf(PREFIX) === 0)
          .forEach((k) => localStorage.removeItem(k));
      } catch (e) {}
      // Copy this page's look to the known pages
      const pages = ["index.html", "about.html", "skills.html", "projects.html", "contact.html", "editor.html"];
      pages.forEach((p) => write(PREFIX + p, state));
      write(KEY, state);
      say("Copied to all main pages");
    });
    actions.append(reset, all);
    panel.appendChild(actions);

    toast = el("p", "tc-toast");
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    panel.appendChild(toast);

    document.body.appendChild(panel);

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.contains("tc-open") ? closePanel() : openPanel();
    });
    panel.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", closePanel);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("tc-open")) {
        closePanel();
        trigger.focus();
      }
    });
  }

  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    clearTimeout(say.t);
    say.t = setTimeout(() => (toast.textContent = ""), 2200);
  }
  function openPanel() {
    panel.classList.add("tc-open");
    trigger.setAttribute("aria-expanded", "true");
  }
  function closePanel() {
    if (!panel) return;
    panel.classList.remove("tc-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function refreshPanel() {
    if (!panel) return;
    panel.querySelectorAll(".tc-swatch").forEach((b) => {
      b.setAttribute("aria-pressed", String(!state.custom && state.accent === b.dataset.preset));
    });
    panel.querySelectorAll(".tc-mode").forEach((b) => {
      b.setAttribute("aria-pressed", String(state.mode === b.dataset.mode));
    });
    const picker = panel.querySelector("#tcCustomColor");
    if (picker) {
      const c = resolveColors();
      if (state.custom) picker.value = state.custom;
      else if (c) picker.value = c.a;
    }
  }

  /* ---------- init ---------- */
  function init() {
    build();
    applyAll();

    // If this page has its own mode, keep the navbar toggle in step with it
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        // script.js already flipped the body class by the time this runs
        if (state.mode !== "auto") {
          state.mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
          save();
        }
        refreshPanel();
      });
    }
  }

  // Wait for DOMContentLoaded so script.js (which sets the site-wide
  // light/dark mode) runs first and this page's own theme wins.
  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
