/* ==========================================================
   LEADERBOARD — Quiz (by difficulty), Memory game, Coding challenges.
   HUD-style podium for the top three, ranked rows for the rest.
   Shared online if SITE_CONFIG.firebaseDbUrl is set, otherwise it
   shows the best scores saved on this device.
   ========================================================== */
(function () {
  "use strict";

  const Store = window.SiteStore;
  if (!Store) return;
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const $ = (s, r) => (r || document).querySelector(s);
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  const savedName = () => { try { return localStorage.getItem("siteLbName") || ""; } catch (e) { return ""; } };
  const fmt = (s) => Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0");
  const pad2 = (n) => String(n).padStart(2, "0");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LEVELS = {
    easy: { label: "Easy", icon: "🌱", color: "#34d399" },
    medium: { label: "Medium", icon: "⚡", color: "#fbbf24" },
    hard: { label: "Hard", icon: "🔥", color: "#fb7185" },
  };

  /* ---- make old and new entries look the same ---- */
  function normQuiz(e) {
    const level = LEVELS[e.level] ? e.level : "easy"; // the first version of the quiz was the basics set
    let correct = e.correct, total = e.total;
    if ((correct == null || total == null) && typeof e.detail === "string") {
      const m = e.detail.match(/(\d+)\s*\/\s*(\d+)/);
      if (m) { correct = Number(m[1]); total = Number(m[2]); }
    }
    total = total || 10;
    correct = correct == null ? Math.round(((e.score || 0) / 100) * total) : correct;
    const mult = { easy: 10, medium: 20, hard: 30 }[level];
    return Object.assign({}, e, {
      level, correct, total,
      score: e.score != null ? e.score : Math.round((correct / total) * 100),
      points: e.points != null ? e.points : correct * mult,
      seconds: e.seconds != null ? e.seconds : 9999,
    });
  }

  /* ---- boards ---- */
  const BOARDS = {
    quiz: {
      label: "Quiz", icon: "🧠", cta: { text: "Initialize quiz", target: "programming-quiz" },
      load: async (opts) => {
        const levels = opts.level === "all" ? ["easy", "medium", "hard"] : [opts.level];
        const lists = await Promise.all(
          levels.map(async (l) => (await Store.listTop("quiz-" + l, opts.level === "all" ? "points" : "score", 60, "desc")).map((e) => normQuiz(Object.assign({ level: l }, e))))
        );
        let all = [].concat.apply([], lists);
        if (!Store.remote) {
          // scores saved on this device by the first version of the quiz
          const old = Store.listLocalScores("quiz").map(normQuiz).filter((e) => opts.level === "all" || e.level === opts.level);
          all = all.concat(old);
        }
        const by = opts.level === "all"
          ? (a, b) => b.points - a.points || a.seconds - b.seconds
          : (a, b) => b.score - a.score || a.seconds - b.seconds;
        return { rows: bestPerName(all, by), by: by };
      },
      view: (e, opts) =>
        opts.level === "all"
          ? { value: e.points + " pts", sub: e.correct + "/" + e.total + " · " + LEVELS[e.level].label + (e.seconds < 9999 ? " · " + fmt(e.seconds) : ""), pct: Math.min(100, (e.points / 300) * 100), level: e.level }
          : { value: e.score + "%", sub: e.correct + "/" + e.total + (e.seconds < 9999 ? " · " + fmt(e.seconds) : ""), pct: e.score, level: e.level },
      summary: (e) => LEVELS[e.level].icon + " " + LEVELS[e.level].label + " " + e.score + "%",
    },
    memory: {
      label: "Memory", icon: "🧩", cta: { text: "Initialize memory game", target: "game-picker" },
      load: async () => {
        const by = (a, b) => a.seconds - b.seconds || a.moves - b.moves;
        return { rows: bestPerName(await Store.listTop("memory", "seconds", 60, "asc"), by), by: by };
      },
      view: (e, _o, rows) => ({ value: e.time || fmt(e.seconds), sub: e.moves + " moves", pct: Math.max(8, Math.min(100, (rows[0].seconds / e.seconds) * 100)) }),
      summary: (e) => (e.time || fmt(e.seconds)) + " · " + e.moves + " moves",
    },
    challenges: {
      label: "Challenges", icon: "💻", cta: { text: "Initialize challenges", href: "editor.html#challenges" },
      load: async () => {
        const by = (a, b) => b.solved - a.solved || a.t - b.t;
        return { rows: bestPerName(await Store.listTop("challenges", "solved", 60, "desc"), by), by: by };
      },
      view: (e) => ({ value: e.solved + " / 10", sub: "challenges solved", pct: (e.solved / 10) * 100 }),
      summary: (e) => e.solved + " / 10 solved",
    },
  };

  function bestPerName(items, by) {
    const best = {};
    items.forEach((e) => {
      if (!e || !e.name) return;
      const k = String(e.name).toLowerCase();
      if (!best[k] || by(e, best[k]) < 0) best[k] = e;
    });
    return Object.values(best).sort(by).slice(0, 10);
  }

  function hue(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    return h;
  }
  /* hexagon avatar (the wrapper carries the glow, the inner shape is clipped) */
  function avatar(name) {
    const w = el("span", "lb-avw");
    const a = el("span", "lb-av", (name.trim()[0] || "?").toUpperCase());
    const h = hue(name);
    a.style.background = "linear-gradient(135deg, hsl(" + h + " 85% 58%), hsl(" + ((h + 50) % 360) + " 85% 42%))";
    w.style.setProperty("--glow", "hsl(" + h + " 90% 60%)");
    w.setAttribute("aria-hidden", "true");
    w.append(a);
    return w;
  }

  /* ---- drawing a board ---- */
  async function renderBoard(container, board, opts) {
    opts = opts || { level: "all" };
    const def = BOARDS[board];
    container.classList.add("lb-loading");
    const { rows } = await def.load(opts);
    container.classList.remove("lb-loading");
    container.textContent = "";
    const me = savedName().toLowerCase();

    if (!rows.length) {
      const empty = el("div", "lb-empty");
      const radar = el("div", "lb-radar");
      radar.setAttribute("aria-hidden", "true");
      radar.append(el("i"), el("i"), el("i"), el("b"));
      empty.append(radar, el("h3", "", "NO SIGNAL"), el("p", "", "Nobody is on this board yet. Be the first name on it."));
      if (def.cta) {
        const a = el("a", "btn btn-primary lb-cta-btn", def.cta.text + " ▸");
        a.href = def.cta.href || "#" + def.cta.target;
        empty.append(a);
      }
      container.append(empty);
      return;
    }

    const podium = el("div", "lb-podium");
    [1, 0, 2].forEach((idx) => {
      const e = rows[idx];
      const pod = el("div", "lb-pod lb-pod-" + (idx + 1) + (e ? "" : " lb-pod-empty"));
      pod.append(el("span", "lb-crown", idx === 0 ? "♛" : ""));
      if (e) {
        const v = def.view(e, opts, rows);
        if (e.name.toLowerCase() === me) pod.classList.add("lb-me");
        pod.append(avatar(e.name), el("strong", "lb-name", e.name), el("span", "lb-val", v.value), el("small", "lb-sub", v.sub));
        if (e.name.toLowerCase() === me) pod.append(el("span", "lb-you", "YOU"));
      } else {
        const w = el("span", "lb-avw lb-avw-empty"); w.append(el("span", "lb-av", "?")); w.setAttribute("aria-hidden", "true");
        pod.append(w, el("strong", "lb-name", "—"), el("small", "lb-sub", "OPEN SLOT"));
      }
      pod.append(el("div", "lb-step", pad2(idx + 1)));
      podium.append(pod);
    });
    container.append(podium);

    if (rows.length > 3) {
      const list = el("ol", "lb-list");
      list.start = 4;
      rows.slice(3).forEach((e, i) => {
        const v = def.view(e, opts, rows);
        const mine = e.name.toLowerCase() === me;
        const li = el("li", "lb-row" + (mine ? " lb-me" : ""));
        li.append(el("span", "lb-rank", pad2(i + 4)), avatar(e.name));
        const mid = el("div", "lb-mid");
        const nm = el("div", "lb-line");
        nm.append(el("strong", "lb-name", e.name));
        if (mine) nm.append(el("span", "lb-you", "YOU"));
        mid.append(nm);
        const bar = el("div", "lb-bar");
        const fill = el("span");
        fill.style.width = reduce ? v.pct + "%" : "0%";
        if (v.level) fill.style.setProperty("--bar", LEVELS[v.level].color);
        bar.append(fill);
        mid.append(bar, el("small", "lb-sub", v.sub));
        li.append(mid, el("span", "lb-val", v.value));
        list.append(li);
        if (!reduce) requestAnimationFrame(() => requestAnimationFrame(() => (fill.style.width = v.pct + "%")));
      });
      container.append(list);
    }

    const mine = rows.find((e) => e.name.toLowerCase() === me);
    const foot = el("div", "lb-foot");
    foot.append(el("span", "lb-mine", mine ? "YOUR BEST · " + def.summary(mine) : me ? "You're not on this board yet." : "Save a score to see your name here."));
    if (def.cta) {
      const a = el("a", "lb-cta", def.cta.text + " ▸");
      a.href = def.cta.href || "#" + def.cta.target;
      foot.append(a);
    }
    container.append(foot);
  }

  /* ---- "save your score" prompt ---- */
  function promptSave(parent, board, data, onSaved) {
    const old = $(".lb-save", parent);
    if (old) old.remove();
    const box = el("div", "lb-save");
    const text = el("div", "lb-save-text");
    text.append(el("strong", "", "▸ Save your score"), el("span", "", "Add your name to the leaderboard"));
    const form = el("form", "lb-save-form");
    const input = el("input");
    input.type = "text"; input.maxLength = 20; input.placeholder = "Your name";
    input.value = savedName(); input.setAttribute("aria-label", "Your name for the leaderboard");
    const btn = el("button", "btn btn-primary", "Upload ▸");
    btn.type = "submit";
    form.append(input, btn);
    box.append(text, form);
    parent.append(box);
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const name = Store.clean(input.value, 20);
      if (name.length < 2) { input.focus(); return; }
      const lastKey = "siteLbLast:" + board;
      let last = 0;
      try { last = Number(localStorage.getItem(lastKey) || 0); } catch (e) {}
      if (Date.now() - last < 15000) { btn.textContent = "Wait a few seconds…"; setTimeout(() => (btn.textContent = "Upload ▸"), 1600); return; }
      btn.disabled = true;
      btn.textContent = "Uploading…";
      try { localStorage.setItem("siteLbName", name); localStorage.setItem(lastKey, String(Date.now())); } catch (e) {}
      const where = await Store.addScore(board, Object.assign({ name: name }, data));
      box.textContent = "";
      box.classList.add("lb-saved");
      if (Store.remote && where === "local") {
        box.append(el("strong", "", "⚠ Saved on this device only — the shared leaderboard couldn't be reached."));
      } else {
        box.append(el("strong", "", "✔ Score uploaded — you're on the leaderboard."));
        if (page === "index.html") {
          const a = el("a", "lb-cta", "View leaderboard ▾");
          a.href = "#leaderboard";
          box.append(a);
        }
      }
      Store.unlock("leaderboard_star");
      if (onSaved) onSaved();
      window.dispatchEvent(new CustomEvent("leaderboard:updated", { detail: board }));
    });
  }

  /* ---- the section on the home page ---- */
  const state = { board: "quiz", level: "all" };
  function buildSection() {
    const main = $("main");
    if (!main || page !== "index.html") return;
    const section = el("section", "section lb-section");
    section.id = "leaderboard";
    const wrap = el("div", "container");
    const head = el("div", "section-heading");
    head.append(el("p", "eyebrow", "HALL OF FAME"));
    const h2 = el("h2"); h2.append("Leader", el("span", "", "board"));
    head.append(h2);
    wrap.append(head);

    const frame = el("div", "lb-frame hud-frame");
    const card = el("div", "lb-card");
    const bar = el("div", "lb-barhead");
    const scope = el("span", "lb-scope hud-pill");
    const sync = el("span", "lb-sync");
    bar.append(el("span", "lb-bar-title", "// RANKINGS"), el("span", "lb-status", ""));
    const statusBox = $(".lb-status", bar);
    statusBox.append(scope, sync);

    function setScope(state, extra) {
      const map = {
        live: ["● LIVE · EVERYONE", "ok", "Scores from all visitors"],
        local: ["● LOCAL · THIS DEVICE", "warn", "Best scores saved in this browser"],
        offline: ["● OFFLINE · THIS DEVICE", "bad", "The shared leaderboard can't be reached right now"],
      }[state];
      scope.textContent = map[0];
      scope.dataset.state = map[1];
      scope.title = map[2];
    }
    setScope(Store.remote ? "live" : "local");
    function stamp() { const d = new Date(); sync.textContent = "SYNC " + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds()); }
    function checkScope() {
      if (!Store.remote) return;
      Store.ping().then((ok) => setScope(ok ? "live" : "offline"));
    }

    const tabs = el("div", "lb-tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Leaderboards");
    const levels = el("div", "lb-levels");
    levels.setAttribute("role", "group");
    levels.setAttribute("aria-label", "Quiz difficulty");
    const body = el("div", "lb-body");
    body.setAttribute("role", "tabpanel");

    function draw() {
      levels.hidden = state.board !== "quiz";
      tabs.querySelectorAll(".lb-tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.board === state.board)));
      levels.querySelectorAll(".lb-level").forEach((t) => t.setAttribute("aria-pressed", String(t.dataset.level === state.level)));
      renderBoard(body, state.board, { level: state.level }).then(stamp);
    }

    Object.keys(BOARDS).forEach((id) => {
      const b = el("button", "lb-tab");
      b.type = "button"; b.setAttribute("role", "tab"); b.dataset.board = id;
      b.append(el("span", "lb-tab-icon", BOARDS[id].icon), el("span", "lb-tab-text", BOARDS[id].label));
      b.addEventListener("click", () => { state.board = id; draw(); });
      b.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const ids = Object.keys(BOARDS);
        const next = ids[(ids.indexOf(id) + (e.key === "ArrowRight" ? 1 : ids.length - 1)) % ids.length];
        state.board = next; draw();
        const nb = tabs.querySelector('[data-board="' + next + '"]'); if (nb) nb.focus();
      });
      tabs.append(b);
    });
    [["all", "All levels", "◈"]].concat(Object.keys(LEVELS).map((k) => [k, LEVELS[k].label, LEVELS[k].icon])).forEach(([k, label, icon]) => {
      const b = el("button", "lb-level");
      b.type = "button"; b.dataset.level = k;
      b.append(el("span", "", icon), " ", label);
      if (LEVELS[k]) b.style.setProperty("--lv", LEVELS[k].color);
      b.addEventListener("click", () => { state.level = k; draw(); });
      levels.append(b);
    });

    card.append(bar, tabs, levels, body);
    frame.append(card);
    wrap.append(frame);
    section.append(wrap);
    main.appendChild(section);
    draw();
    checkScope();
    window.addEventListener("leaderboard:updated", draw);
    if (Store.remote) {
      // keep the board fresh while visitors are looking at it
      setInterval(() => { if (!document.hidden && section.getBoundingClientRect().top < window.innerHeight * 1.5) { draw(); checkScope(); } }, 45000);
      document.addEventListener("visibilitychange", () => { if (!document.hidden) draw(); });
    }
  }

  /* ---- hooks: quiz and memory game ---- */
  function hookQuiz() {
    const result = $("#quizResult");
    if (!result) return;
    window.addEventListener("quiz:started", () => { const s = $(".lb-save", result); if (s) s.remove(); });
    window.addEventListener("quiz:finished", (e) => {
      const d = e.detail;
      promptSave(result, "quiz-" + d.level, { level: d.level, correct: d.correct, total: d.total, score: d.percent, points: d.points, seconds: d.seconds });
    });
  }

  function hookMemory() {
    const msg = $("#memoryMessage");
    if (!msg) return;
    let offered = false;
    new MutationObserver(() => {
      const t = msg.textContent;
      const m = t.match(/in\s+(\d+)\s+moves and\s+(\d+):(\d+)/i);
      if (!/congratulations/i.test(t) || !m) {
        if (!/congratulations/i.test(t)) { offered = false; const s = $(".lb-save", msg.parentNode); if (s) s.remove(); }
        return;
      }
      if (offered) return;
      offered = true;
      const seconds = Number(m[2]) * 60 + Number(m[3]);
      promptSave(msg.parentNode, "memory", { moves: Number(m[1]), seconds: seconds, time: m[2].padStart(2, "0") + ":" + m[3] });
    }).observe(msg, { childList: true, characterData: true, subtree: true });
  }

  window.SiteLeaderboard = { render: renderBoard, promptSave: promptSave, boards: BOARDS };

  function init() {
    buildSection();
    hookQuiz();
    hookMemory();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
