/* ==========================================================
   PORTFOLIO FEATURES
   Typing animation · GitHub feed · visitor counter ·
   project likes · guestbook · skills radar · résumé links ·
   Blog link in footer · PWA registration
   Each feature only runs on the page where it belongs.
   ========================================================== */
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const Store = window.SiteStore;
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  const lang = () => (window.SiteI18n && window.SiteI18n.lang) || "en";
  const tr = (s) => {
    if (lang() !== "fil") return s;
    const m = FIL[s];
    return m || s;
  };
  const FIL = {
    "visits": "pagbisita",
    "visit": "pagbisita",
    "Like": "Gusto ko",
    "Liked": "Nagustuhan",
    "No messages yet — be the first to sign!": "Wala pang mensahe — ikaw ang unang lumagda!",
    "Thanks for signing!": "Salamat sa paglagda!",
    "Please wait a moment before posting again.": "Maghintay sandali bago mag-post muli.",
    "Please write a message first.": "Magsulat muna ng mensahe.",
    "Anonymous": "Hindi nagpakilala",
  };

  /* ---------- relative time ---------- */
  function ago(date) {
    const s = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 1000));
    const units = [
      ["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60],
    ];
    for (let i = 0; i < units.length; i++) {
      const v = Math.floor(s / units[i][1]);
      if (v >= 1) return v + " " + units[i][0] + (v > 1 ? "s" : "") + " ago";
    }
    return "just now";
  }

  /* ==========================================================
     1. TYPING ANIMATION (home hero)
     ========================================================== */
  function typing() {
    const target = $(".hero-text h2");
    if (!target || page !== "index.html") return;
    target.setAttribute("data-typing", "");
    const original = target.textContent.trim();
    target.setAttribute("aria-label", original);
    target.textContent = "";
    const text = el("span", "typing-text");
    text.setAttribute("aria-hidden", "true");
    const caret = el("span", "typing-caret");
    caret.setAttribute("aria-hidden", "true");
    target.append(text, caret);
    target.style.minHeight = "1.4em";

    if (reduceMotion) {
      text.textContent = original;
      caret.remove();
      return;
    }
    let p = 0, c = 0, deleting = false, timer;
    function phrases() {
      const set = (cfg.typingPhrases || {})[lang()] || (cfg.typingPhrases || {}).en;
      return set && set.length ? set : [original];
    }
    function tick() {
      const list = phrases();
      if (p >= list.length) p = 0;
      const word = list[p];
      if (!deleting) {
        c++;
        text.textContent = word.slice(0, c);
        if (c === word.length) { deleting = true; return (timer = setTimeout(tick, 1700)); }
        timer = setTimeout(tick, 70);
      } else {
        c--;
        text.textContent = word.slice(0, c);
        if (c === 0) { deleting = false; p = (p + 1) % list.length; return (timer = setTimeout(tick, 350)); }
        timer = setTimeout(tick, 35);
      }
    }
    tick();
    window.addEventListener("site:langchange", () => {
      clearTimeout(timer); c = 0; p = 0; deleting = false; text.textContent = ""; tick();
    });
  }

  /* ==========================================================
     2. RÉSUMÉ BUTTONS
     ========================================================== */
  function resumeLinks() {
    if (page === "resume.html") return;
    const hero = $(".hero-buttons");
    if (hero && !$("[data-resume-btn]", hero)) {
      const a = el("a", "btn btn-outline", "📄 Résumé");
      a.href = cfg.resumeHtml || "resume.html";
      a.setAttribute("data-resume-btn", "");
      hero.appendChild(a);
    }
    const footer = $(".footer-content");
    if (footer && !$(".footer-links", footer)) {
      const links = el("p", "footer-links");
      [["Résumé", cfg.resumeHtml || "resume.html"], ["Blog", "blog.html"]].forEach(([t, h], i) => {
        if (i) links.append(" · ");
        const a = el("a", "", t);
        a.href = h;
        links.append(a);
      });
      footer.appendChild(links);
    }
  }

  /* ==========================================================
     3. VISITOR COUNTER (footer)
     ========================================================== */
  async function visitCounter() {
    const footer = $(".footer-content");
    if (!footer || !Store) return;
    const box = el("p", "site-visits");
    const num = el("strong", "", "…");
    const label = el("span", "", tr("visits"));
    box.append("👁 ", num, " ", label);
    box.title = Store.remote ? "Total visits to this site" : "Visits from this browser";
    footer.appendChild(box);
    let count;
    try {
      if (sessionStorage.getItem("siteCounted") === "1") count = await Store.getCount("visits");
      else {
        count = await Store.increment("visits");
        sessionStorage.setItem("siteCounted", "1");
      }
    } catch (e) {
      count = await Store.getCount("visits");
    }
    num.textContent = Number(count).toLocaleString();
    const word = () => tr(Number(count) === 1 ? "visit" : "visits");
    label.textContent = word();
    window.addEventListener("site:langchange", () => (label.textContent = word()));
  }

  /* ==========================================================
     4. PROJECT LIKES (projects page)
     ========================================================== */
  function likes() {
    if (!Store) return;
    $$("[data-project]").forEach((card) => {
      const actions = $(".project-actions", card);
      if (!actions || $(".like-btn", actions)) return;
      const name = card.getAttribute("data-name") || $("h3", card).textContent;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const lsKey = "siteLiked:" + slug;
      let liked = false;
      try { liked = localStorage.getItem(lsKey) === "1"; } catch (e) {}

      const btn = el("button", "like-btn");
      btn.type = "button";
      const icon = el("span", "", liked ? "👍" : "👍");
      const count = el("span", "like-count", "0");
      btn.append(icon, " ", count);
      btn.setAttribute("aria-pressed", String(liked));
      btn.setAttribute("aria-label", "Like " + name);
      btn.title = "Like this project";
      actions.appendChild(btn);

      Store.getCount("like-" + slug).then((n) => (count.textContent = n));

      btn.addEventListener("click", async () => {
        liked = !liked;
        btn.setAttribute("aria-pressed", String(liked));
        btn.disabled = true;
        try { localStorage.setItem(lsKey, liked ? "1" : "0"); } catch (e) {}
        const n = await Store.increment("like-" + slug, liked ? 1 : -1);
        count.textContent = n;
        btn.disabled = false;
      });
    });
  }

  /* ==========================================================
     5. GUESTBOOK (contact page)
     ========================================================== */
  function guestbook() {
    if (page !== "contact.html" || !Store) return;
    const main = $("main");
    if (!main) return;

    const section = el("section", "section fx-guestbook");
    section.id = "guestbook";
    const wrap = el("div", "container");
    const head = el("div", "section-heading");
    head.append(el("p", "eyebrow", "LEAVE A MARK"));
    const h2 = el("h2");
    h2.append("Sign the ", el("span", "", "Guestbook"));
    head.append(h2);
    head.append(
      el(
        "p",
        "heading-description",
        Store.remote
          ? "Say hello! Your message appears for everyone who visits."
          : "Say hello! Messages are saved in this browser only until the site is connected to online storage."
      )
    );
    wrap.append(head);

    const card = el("div", "gb-card");
    const form = el("form", "gb-form");
    form.setAttribute("novalidate", "");
    const name = el("input");
    name.type = "text"; name.maxLength = 40; name.placeholder = "Your name (optional)";
    name.setAttribute("aria-label", "Your name (optional)"); name.autocomplete = "nickname";
    const msg = el("textarea");
    msg.rows = 3; msg.maxLength = 200; msg.placeholder = "Leave a short message…";
    msg.setAttribute("aria-label", "Guestbook message");
    const trap = el("input"); // honeypot
    trap.type = "text"; trap.tabIndex = -1; trap.autocomplete = "off";
    trap.className = "gb-trap"; trap.setAttribute("aria-hidden", "true"); trap.name = "website";
    const row = el("div", "gb-row");
    const submit = el("button", "btn btn-primary", "Post message");
    submit.type = "submit";
    const counter = el("small", "gb-counter", "0 / 200");
    const status = el("p", "gb-status");
    status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    row.append(counter, submit);
    form.append(name, msg, trap, row, status);
    const list = el("ul", "gb-list");
    list.setAttribute("aria-label", "Guestbook messages");
    card.append(form, list);
    wrap.append(card);
    section.append(wrap);

    const quick = $(".quick-search-trigger", main);
    if (quick) main.insertBefore(section, quick);
    else main.appendChild(section);

    msg.addEventListener("input", () => (counter.textContent = msg.value.length + " / 200"));

    async function render() {
      const items = await Store.listEntries("guestbook", 20);
      list.textContent = "";
      if (!items.length) {
        list.append(el("li", "gb-empty", tr("No messages yet — be the first to sign!")));
        return;
      }
      items.forEach((it) => {
        const li = el("li", "gb-item");
        const top = el("div", "gb-top");
        top.append(el("strong", "", Store.clean(it.n, 40) || tr("Anonymous")), el("small", "", ago(it.t)));
        li.append(top, el("p", "", Store.clean(it.m, 200)));
        list.append(li);
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.textContent = "";
      if (trap.value) return; // bot
      const text = Store.clean(msg.value, 200);
      if (text.length < 2) { status.textContent = tr("Please write a message first."); return; }
      let last = 0;
      try { last = Number(localStorage.getItem("siteGuestbookLast") || 0); } catch (x) {}
      if (Date.now() - last < 30000) { status.textContent = tr("Please wait a moment before posting again."); return; }
      submit.disabled = true;
      const where = await Store.addEntry("guestbook", { n: Store.clean(name.value, 40), m: text });
      try { localStorage.setItem("siteGuestbookLast", String(Date.now())); } catch (x) {}
      msg.value = ""; counter.textContent = "0 / 200";
      status.textContent = Store.remote && where === "local"
        ? "Saved on this device only — the shared guestbook couldn’t be reached."
        : tr("Thanks for signing!");
      submit.disabled = false;
      Store.unlock("guestbook_signer");
      render();
    });

    render();
    window.addEventListener("site:langchange", render);
  }

  /* ==========================================================
     6. SKILLS RADAR (skills page)
     ========================================================== */
  function radar() {
    if (page !== "skills.html") return;
    const cards = $$(".skill-card");
    const skills = cards
      .map((c) => {
        const h = $("h3", c);
        const bar = $(".skill-progress", c);
        const w = bar ? parseFloat((bar.style.getPropertyValue("--skill-width") || "").replace("%", "")) : NaN;
        return h && !isNaN(w) ? { name: h.textContent.trim(), value: w } : null;
      })
      .filter(Boolean);
    if (skills.length < 3) return;
    const anchor = $("#skills");
    if (!anchor) return;

    const section = el("section", "section fx-radar");
    section.id = "skills-radar";
    const wrap = el("div", "container");
    const head = el("div", "section-heading");
    head.append(el("p", "eyebrow", "AT A GLANCE"));
    const h2 = el("h2");
    h2.append("Skills ", el("span", "", "Overview"));
    head.append(h2);
    wrap.append(head);

    const NS = "http://www.w3.org/2000/svg";
    const size = 420, cx = size / 2, cy = size / 2, R = 140;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("class", "radar-svg");
    svg.setAttribute("role", "img");
    svg.setAttribute(
      "aria-label",
      "Radar chart of skill levels: " + skills.map((s) => s.name + " " + s.value + "%").join(", ")
    );
    const n = skills.length;
    const pt = (i, f) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f];
    };
    function add(tag, attrs, parent) {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k]));
      (parent || svg).appendChild(e);
      return e;
    }
    [0.25, 0.5, 0.75, 1].forEach((f) => {
      add("polygon", {
        points: skills.map((_, i) => pt(i, f).join(",")).join(" "),
        class: "radar-ring",
      });
    });
    skills.forEach((s, i) => {
      const [x, y] = pt(i, 1);
      add("line", { x1: cx, y1: cy, x2: x, y2: y, class: "radar-axis" });
      const [lx, ly] = pt(i, 1.2);
      const t = add("text", {
        x: lx, y: ly, class: "radar-label",
        "text-anchor": Math.abs(lx - cx) < 8 ? "middle" : lx > cx ? "start" : "end",
        "dominant-baseline": "middle",
      });
      t.textContent = s.name;
    });
    const poly = add("polygon", {
      points: skills.map((s, i) => pt(i, s.value / 100).join(",")).join(" "),
      class: "radar-shape",
    });
    const dots = skills.map((s, i) => {
      const [x, y] = pt(i, s.value / 100);
      const d = add("circle", { cx: x, cy: y, r: 5, class: "radar-dot" });
      const tt = document.createElementNS(NS, "title");
      tt.textContent = s.name + ": " + s.value + "%";
      d.appendChild(tt);
      return d;
    });

    const legend = el("ul", "radar-legend");
    skills
      .slice()
      .sort((a, b) => b.value - a.value)
      .forEach((s) => {
        const li = el("li");
        li.append(el("span", "", s.name), el("strong", "", s.value + "%"));
        legend.append(li);
      });

    const body = el("div", "radar-body");
    body.append(svg, legend);
    wrap.append(body);
    section.append(wrap);
    anchor.parentNode.insertBefore(section, anchor);

    if (!reduceMotion) {
      poly.classList.add("radar-hidden");
      dots.forEach((d) => d.classList.add("radar-hidden"));
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          poly.classList.remove("radar-hidden");
          dots.forEach((d) => d.classList.remove("radar-hidden"));
          io.disconnect();
        }
      }, { threshold: 0.3 });
      io.observe(svg);
    }
  }

  /* ==========================================================
     7. GITHUB FEED (home page)
     ========================================================== */
  const LANG_COLORS = {
    JavaScript: "#f1e05a", Python: "#3572A5", HTML: "#e34c26", CSS: "#563d7c",
    TypeScript: "#3178c6", Java: "#b07219", "C++": "#f34b7d", C: "#555555", Shell: "#89e051",
  };
  async function ghJson(url, key) {
    try {
      const cached = JSON.parse(sessionStorage.getItem(key) || "null");
      if (cached && Date.now() - cached.t < 600000) return cached.d;
    } catch (e) {}
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error("GitHub " + res.status);
    const d = await res.json();
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
    return d;
  }

  function githubFeed() {
    const user = cfg.githubUser;
    const dash = $("#developer-dashboard");
    if (!user || !dash || page !== "index.html") return;

    const section = el("section", "section fx-github");
    section.id = "github-feed";
    const wrap = el("div", "container");
    const head = el("div", "section-heading");
    head.append(el("p", "eyebrow", "OPEN SOURCE LIFE"));
    const h2 = el("h2");
    h2.append("GitHub ", el("span", "", "Activity"));
    head.append(h2);
    wrap.append(head);
    const body = el("div", "gh-body", "Loading…");
    wrap.append(body);
    section.append(wrap);
    dash.parentNode.insertBefore(section, dash.nextSibling);

    (async () => {
      try {
        const [profile, repos, events] = await Promise.all([
          ghJson("https://api.github.com/users/" + user, "gh-profile"),
          ghJson("https://api.github.com/users/" + user + "/repos?per_page=100&sort=pushed", "gh-repos"),
          ghJson("https://api.github.com/users/" + user + "/events/public?per_page=30", "gh-events").catch(() => []),
        ]);
        body.textContent = "";

        const top = el("div", "gh-profile");
        const avatar = el("img", "gh-avatar");
        avatar.src = profile.avatar_url; avatar.alt = ""; avatar.width = 64; avatar.height = 64;
        const info = el("div", "gh-info");
        const nm = el("a", "gh-name", profile.name || profile.login);
        nm.href = profile.html_url; nm.target = "_blank"; nm.rel = "noopener noreferrer";
        info.append(nm, el("p", "gh-login", "@" + profile.login));
        const stats = el("div", "gh-stats");
        [["Public repositories", profile.public_repos], ["Followers", profile.followers]].forEach(([l, v]) => {
          const s = el("div", "gh-stat");
          s.append(el("strong", "", String(v)), el("span", "", l));
          stats.append(s);
        });
        top.append(avatar, info, stats);

        const cols = el("div", "gh-cols");
        const left = el("div");
        left.append(el("h3", "gh-h", "Latest repositories"));
        const grid = el("div", "gh-repos");
        repos
          .filter((r) => !r.fork)
          .slice(0, 6)
          .forEach((r) => {
            const a = el("a", "gh-repo");
            a.href = r.html_url; a.target = "_blank"; a.rel = "noopener noreferrer";
            a.append(el("strong", "", r.name));
            a.append(el("p", "", r.description || "No description yet."));
            const meta = el("div", "gh-meta");
            if (r.language) {
              const dot = el("span", "gh-dot");
              dot.style.background = LANG_COLORS[r.language] || "#8b5cf6";
              const l = el("span", "", r.language);
              meta.append(dot, l);
            }
            meta.append(el("span", "", "★ " + r.stargazers_count), el("span", "", "Updated " + ago(r.pushed_at || r.updated_at)));
            a.append(meta);
            grid.append(a);
          });
        if (!grid.children.length) grid.append(el("p", "gh-empty", "No public repositories to show yet."));
        left.append(grid);

        const right = el("div");
        right.append(el("h3", "gh-h", "Recent activity"));
        const feed = el("ul", "gh-feed");
        (Array.isArray(events) ? events : [])
          .filter((e) => e.type === "PushEvent" && e.payload && e.payload.commits)
          .slice(0, 5)
          .forEach((e) => {
            const li = el("li");
            const c = e.payload.commits.length;
            const msg = e.payload.commits[e.payload.commits.length - 1].message.split("\n")[0].slice(0, 70);
            li.append(
              el("strong", "", "Pushed " + c + " commit" + (c > 1 ? "s" : "") + " to " + e.repo.name.split("/").pop()),
              el("p", "", msg),
              el("small", "", ago(e.created_at))
            );
            feed.append(li);
          });
        if (!feed.children.length) feed.append(el("li", "gh-empty", "No recent public pushes."));
        right.append(feed);
        cols.append(left, right);

        const more = el("a", "btn btn-outline gh-more", "View on GitHub");
        more.href = profile.html_url; more.target = "_blank"; more.rel = "noopener noreferrer";
        body.append(top, cols, more);
        if (window.SiteI18n) window.SiteI18n.apply(body);
      } catch (err) {
        body.textContent = "";
        const p = el("p", "gh-empty", "Couldn't load GitHub right now (you may be offline or rate-limited). ");
        const a = el("a", "", "Open my GitHub profile →");
        a.href = "https://github.com/" + user; a.target = "_blank"; a.rel = "noopener noreferrer";
        p.append(a);
        body.append(p);
      }
    })();
  }

  /* ==========================================================
     8. PWA
     ========================================================== */
  function pwa() {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol !== "https:" && location.hostname !== "localhost") return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  /* ---------- run ---------- */
  function init() {
    typing();
    resumeLinks();
    visitCounter();
    likes();
    guestbook();
    radar();
    githubFeed();
  }
  pwa();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
