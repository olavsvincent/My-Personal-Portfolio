/* ==========================================================
   PROJECTS PAGE — extras
   · GitHub "source" link on every project (fills the empty links)
   · Sort (name / most liked) and Grid / List layout
   · Clickable technology chips
   · Shareable links (projects.html#sysvision), Previous / Next and
     Copy-link buttons inside the project preview, ← → keys
   · Friendly placeholder when a project image cannot load
   · Press "/" to jump to the search box
   ========================================================== */
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const Store = window.SiteStore;
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  const $ = (s, r) => (r || document).querySelector(s);
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  function init() {
    const cards = Array.from(grid.querySelectorAll("[data-project]"));
    if (!cards.length) return;
    cards.forEach((c, i) => (c.dataset.ppIndex = String(i)));
    const search = document.getElementById("projectSearch");
    const modal = document.getElementById("projectModal");

    /* project numbers read like file codes: PRJ-01 */
    cards.forEach((c) => {
      const n = $(".project-number", c);
      if (n && /^\d+$/.test(n.textContent.trim())) n.textContent = "PRJ-" + n.textContent.trim();
    });

    /* ---------- 1. GitHub source links ---------- */
    const repo = cfg.githubRepo || "olavsvincent/My-Personal-Portfolio";
    const branch = cfg.githubBranch || "main";
    const FOLDERS = {
      "Student Management System": "Student Management System",
      "Workout Planner": "Workout Planner",
      "Health Monitoring System": "Health Monitoring System",
      "Grade Calculator": "Grade Calculator",
      "Scientific Calculator": "Calculator",
      "Book Management System": "Book Management System",
      SysVision: "SysVision",
    };
    cards.forEach((card) => {
      let link = $("[data-github-link]", card);
      const folder = FOLDERS[card.dataset.name];
      if (!link && folder) {
        // this card was built without a GitHub slot, so add one
        let holder = $(".project-external-links", card);
        if (!holder) {
          holder = el("div", "project-external-links");
          const content = $(".project-content", card) || card;
          content.appendChild(holder);
        }
        link = el("a", "project-github-link", "GitHub ↗");
        link.href = "#";
        link.setAttribute("data-github-link", "");
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.hidden = true;
        holder.appendChild(link);
      }
      if (link && folder && link.getAttribute("href") === "#") {
        link.href = "https://github.com/" + repo + "/tree/" + branch + "/" + encodeURIComponent(folder).replace(/%2F/g, "/");
        link.hidden = false;
      }
    });

    /* ---------- 2. Image fallback ---------- */
    function initials(name) {
      return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
    }
    function fallback(img, wrap, name) {
      if (!wrap || wrap.classList.contains("pp-noimg")) return;
      wrap.classList.add("pp-noimg");
      wrap.dataset.initials = initials(name);
      img.style.visibility = "hidden";
    }
    cards.forEach((card) => {
      const img = $(".project-image img", card);
      const wrap = $(".project-image", card);
      if (!img) return;
      if (img.complete && img.naturalWidth === 0 && img.src) fallback(img, wrap, card.dataset.name);
      img.addEventListener("error", () => fallback(img, wrap, card.dataset.name));
    });
    const modalImg = document.getElementById("modalProjectImage");
    if (modalImg) {
      const mWrap = modalImg.parentNode;
      modalImg.addEventListener("error", () => {
        mWrap.classList.add("pp-noimg");
        mWrap.dataset.initials = initials((document.getElementById("modalProjectTitle") || {}).textContent || "PR");
        modalImg.style.visibility = "hidden";
      });
      modalImg.addEventListener("load", () => {
        mWrap.classList.remove("pp-noimg");
        modalImg.style.visibility = "";
      });
    }

    /* ---------- 3. Controls: chips, sort, layout ---------- */
    const toolbar = $(".project-toolbar");
    const bar = el("section", "pp-bar");
    bar.setAttribute("aria-label", "Project display options");

    // technology chips
    const counts = {};
    cards.forEach((c) => $$all(".tags span", c).forEach((t) => {
      const k = t.textContent.trim();
      if (k) counts[k] = (counts[k] || 0) + 1;
    }));
    function $$all(s, r) { return Array.from((r || document).querySelectorAll(s)); }
    const techs = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b)).slice(0, 14);
    const chipsWrap = el("div", "pp-chips");
    chipsWrap.setAttribute("role", "group");
    chipsWrap.setAttribute("aria-label", "Filter by technology");
    const chipLabel = el("span", "pp-label", "Technologies");
    chipsWrap.append(chipLabel);
    const chipEls = techs.map((t) => {
      const b = el("button", "pp-chip", t);
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => {
        if (!search) return;
        const active = search.value.trim().toLowerCase() === t.toLowerCase();
        search.value = active ? "" : t;
        search.dispatchEvent(new Event("input", { bubbles: true }));
      });
      chipsWrap.append(b);
      return b;
    });
    function syncChips() {
      const v = search ? search.value.trim().toLowerCase() : "";
      chipEls.forEach((b) => b.setAttribute("aria-pressed", String(v !== "" && b.textContent.toLowerCase() === v)));
    }
    if (search) search.addEventListener("input", syncChips);
    ["resetProjectFilters", "emptyResetFilters"].forEach((id) => {
      const b = document.getElementById(id);
      if (b) b.addEventListener("click", () => setTimeout(syncChips, 0));
    });
    syncChips();

    // sort + layout
    const tools = el("div", "pp-tools");
    const sortLabel = el("label", "pp-label", "Sort by");
    sortLabel.setAttribute("for", "ppSort");
    const sortSel = el("select", "pp-select");
    sortSel.id = "ppSort";
    [["default", "Default order"], ["az", "Name A–Z"], ["za", "Name Z–A"], ["liked", "Most liked"]].forEach(([v, t]) => {
      const o = el("option", "", t); o.value = v; sortSel.append(o);
    });
    const layout = el("div", "pp-layout");
    layout.setAttribute("role", "group");
    layout.setAttribute("aria-label", "Layout");
    const bGrid = el("button", "pp-view", "▦ Grid");
    const bList = el("button", "pp-view", "☰ List");
    [bGrid, bList].forEach((b) => (b.type = "button"));
    layout.append(bGrid, bList);
    tools.append(sortLabel, sortSel, layout);
    bar.append(chipsWrap, tools);
    if (toolbar && toolbar.parentNode) toolbar.parentNode.insertBefore(bar, toolbar.nextSibling);

    function setView(v) {
      grid.classList.toggle("pp-list", v === "list");
      bGrid.setAttribute("aria-pressed", String(v !== "list"));
      bList.setAttribute("aria-pressed", String(v === "list"));
      try { localStorage.setItem("ppView", v); } catch (e) {}
    }
    bGrid.addEventListener("click", () => setView("grid"));
    bList.addEventListener("click", () => setView("list"));

    async function applySort(mode) {
      let ordered = cards.slice();
      if (mode === "az") ordered.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
      else if (mode === "za") ordered.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
      else if (mode === "liked" && Store) {
        const likes = await Promise.all(ordered.map((c) => Store.getCount("like-" + slug(c.dataset.name))));
        ordered = ordered.map((c, i) => ({ c, n: likes[i] }))
          .sort((a, b) => b.n - a.n || Number(a.c.dataset.ppIndex) - Number(b.c.dataset.ppIndex))
          .map((x) => x.c);
      } else ordered.sort((a, b) => Number(a.dataset.ppIndex) - Number(b.dataset.ppIndex));
      ordered.forEach((c) => grid.appendChild(c));
      try { localStorage.setItem("ppSort", mode); } catch (e) {}
    }
    sortSel.addEventListener("change", () => applySort(sortSel.value));

    let savedView = "grid", savedSort = "default";
    try { savedView = localStorage.getItem("ppView") || "grid"; savedSort = localStorage.getItem("ppSort") || "default"; } catch (e) {}
    setView(savedView);
    sortSel.value = ["default", "az", "za", "liked"].includes(savedSort) ? savedSort : "default";
    if (sortSel.value !== "default") applySort(sortSel.value);

    /* ---------- 4. Shareable links + Previous / Next ---------- */
    const titleEl = document.getElementById("modalProjectTitle");
    const actions = modal && $(".project-modal-actions", modal);
    const visible = () => cards.filter((c) => !c.hidden);
    const currentCard = () => cards.find((c) => c.dataset.name === (titleEl && titleEl.textContent));
    const isOpen = () => modal && modal.classList.contains("is-open");

    function go(step) {
      const list = visible();
      const cur = currentCard();
      if (!cur || list.length < 2) return;
      const i = list.indexOf(cur);
      const next = list[(i + step + list.length) % list.length];
      const btn = $("[data-preview]", next);
      if (btn) btn.click();
    }

    if (actions) {
      const nav = el("div", "pp-modal-nav");
      const prev = el("button", "pp-nav-btn", "← Previous");
      const copy = el("button", "pp-nav-btn", "🔗 Copy link");
      const next = el("button", "pp-nav-btn", "Next →");
      [prev, copy, next].forEach((b) => (b.type = "button"));
      nav.append(prev, copy, next);
      actions.parentNode.insertBefore(nav, actions.nextSibling);
      prev.addEventListener("click", () => go(-1));
      next.addEventListener("click", () => go(1));
      copy.addEventListener("click", async () => {
        const c = currentCard();
        if (!c) return;
        const url = location.href.split("#")[0] + "#" + slug(c.dataset.name);
        try { await navigator.clipboard.writeText(url); copy.textContent = "✓ Link copied"; }
        catch (e) { window.prompt("Copy this link:", url); }
        setTimeout(() => (copy.textContent = "🔗 Copy link"), 1600);
      });
    }

    if (modal) {
      new MutationObserver(() => {
        if (isOpen()) {
          const c = currentCard();
          if (c) history.replaceState(null, "", "#" + slug(c.dataset.name));
        } else if (location.hash) {
          history.replaceState(null, "", location.pathname + location.search);
        }
      }).observe(modal, { attributes: true, attributeFilter: ["class"] });
      new MutationObserver(() => {
        if (isOpen()) {
          const c = currentCard();
          if (c) history.replaceState(null, "", "#" + slug(c.dataset.name));
        }
      }).observe(titleEl, { childList: true, characterData: true, subtree: true });
    }

    function openFromHash() {
      const h = location.hash.replace(/^#/, "");
      if (!h || isOpen()) return;
      const c = cards.find((x) => slug(x.dataset.name) === h);
      if (!c) return;
      c.hidden = false;
      const btn = $("[data-preview]", c);
      if (btn) setTimeout(() => btn.click(), 150);
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);

    document.addEventListener("keydown", (e) => {
      const t = e.target;
      const typing = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
      if (isOpen()) {
        if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        return;
      }
      if (e.key === "/" && !typing && search) { e.preventDefault(); search.focus(); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
