(function () {
  "use strict";

  const posts = (window.BLOG_POSTS || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const list = document.getElementById("blogList");
  const tagsBox = document.getElementById("blogTags");
  const search = document.getElementById("blogSearch");
  if (!list) return;

  const note = document.getElementById("blogSampleNote");
  if (note && window.SAMPLE_POSTS) note.hidden = false;

  let activeTag = "";
  const open = new Set();

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function words(post) {
    return post.body.map((b) => b.p || b.h || (b.ul || []).join(" ")).join(" ").split(/\s+/).length;
  }
  function fmtDate(d) {
    const dt = new Date(d + "T00:00:00");
    return isNaN(dt) ? d : dt.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  function renderBody(post) {
    const wrap = el("div", "post-body");
    post.body.forEach((b) => {
      if (b.h) wrap.append(el("h3", "", b.h));
      else if (b.p) wrap.append(el("p", "", b.p));
      else if (b.ul) {
        const ul = el("ul");
        b.ul.forEach((i) => ul.append(el("li", "", i)));
        wrap.append(ul);
      }
    });
    return wrap;
  }

  function render() {
    const q = (search.value || "").trim().toLowerCase();
    list.textContent = "";
    const shown = posts.filter((p) => {
      const hay = (p.title + " " + p.excerpt + " " + p.tags.join(" ") + " " + p.body.map((b) => b.p || b.h || (b.ul || []).join(" ")).join(" ")).toLowerCase();
      return (!activeTag || p.tags.indexOf(activeTag) !== -1) && (!q || hay.indexOf(q) !== -1);
    });
    if (!shown.length) {
      list.append(el("p", "blog-empty", "No posts match your search."));
      return;
    }
    shown.forEach((p) => {
      const card = el("article", "post-card");
      card.id = "post-" + p.id;
      const meta = el("div", "post-meta");
      meta.append(el("span", "", fmtDate(p.date)), el("span", "", Math.max(1, Math.round(words(p) / 200)) + " min read"));
      card.append(meta, el("h2", "", p.title), el("p", "post-excerpt", p.excerpt));
      const tags = el("div", "post-tags");
      p.tags.forEach((t) => tags.append(el("span", "", t)));
      card.append(tags);

      const actions = el("div", "post-actions");
      const toggle = el("button", "post-link", open.has(p.id) ? "Show less" : "Read more");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", String(open.has(p.id)));
      const copy = el("button", "post-link", "🔗 Copy link");
      copy.type = "button";
      actions.append(toggle, copy);
      card.append(actions);

      let body = null;
      function show() {
        body = renderBody(p);
        card.insertBefore(body, actions);
        toggle.textContent = "Show less";
        toggle.setAttribute("aria-expanded", "true");
        open.add(p.id);
        if (window.SiteStore) window.SiteStore.unlock("blog_reader");
        if (window.SiteI18n) window.SiteI18n.apply(card);
      }
      function hide() {
        if (body) body.remove();
        body = null;
        toggle.textContent = "Read more";
        toggle.setAttribute("aria-expanded", "false");
        open.delete(p.id);
        if (window.SiteI18n && window.SiteI18n.lang === "fil") window.SiteI18n.apply(card);
      }
      toggle.addEventListener("click", () => (body ? hide() : show()));
      copy.addEventListener("click", async () => {
        const url = location.href.split("#")[0] + "#post-" + p.id;
        try { await navigator.clipboard.writeText(url); copy.textContent = "✓ Copied"; }
        catch (e) { window.prompt("Copy this link:", url); }
        setTimeout(() => (copy.textContent = "🔗 Copy link"), 1500);
      });
      if (open.has(p.id)) show();
      list.append(card);
    });
  }

  const allTags = Array.from(new Set(posts.reduce((a, p) => a.concat(p.tags), []))).sort();
  ["All posts"].concat(allTags).forEach((t, i) => {
    const b = el("button", "blog-tag", t);
    b.type = "button";
    b.setAttribute("aria-pressed", String(i === 0));
    b.addEventListener("click", () => {
      activeTag = i === 0 ? "" : t;
      Array.from(tagsBox.children).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
      render();
    });
    tagsBox.append(b);
  });
  search.addEventListener("input", render);

  const hash = location.hash.match(/^#post-(.+)$/);
  if (hash && posts.some((p) => p.id === hash[1])) open.add(hash[1]);
  render();
  if (hash) {
    const target = document.getElementById("post-" + hash[1]);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }
})();
