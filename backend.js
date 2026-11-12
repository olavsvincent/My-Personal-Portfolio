/* ==========================================================
   SiteStore — storage layer for the visitor counter, likes,
   guestbook and leaderboards.
   - With SITE_CONFIG.firebaseDbUrl set: shared online data for
     every visitor (Firebase Realtime Database REST API, no SDK).
   - Without it: data lives in this browser's localStorage.
   Writes report where they ended up ("remote" or "local") so the
   page can tell the visitor honestly.
   ========================================================== */
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const base = (cfg.firebaseDbUrl || "").replace(/\/+$/, "");
  const remote = /^https:\/\//.test(base) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(base);
  const LS = "siteStore:";

  function lsGet(key, fallback) {
    try {
      const raw = localStorage.getItem(LS + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function lsSet(key, value) {
    try {
      localStorage.setItem(LS + key, JSON.stringify(value));
    } catch (e) {}
  }

  async function rest(path, options, timeout) {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeout || 8000) : null;
    try {
      // ".json" must come before any query string:  scores/quiz-easy.json?orderBy="score"
      const cut = path.indexOf("?");
      const url = base + "/" + (cut === -1 ? path : path.slice(0, cut)) + ".json" + (cut === -1 ? "" : path.slice(cut));
      const res = await fetch(url, Object.assign({}, options, ctrl ? { signal: ctrl.signal } : {}));
      if (!res.ok) throw new Error("Storage request failed (" + res.status + ")");
      return await res.json();
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function clean(s, max) {
    return String(s == null ? "" : s)
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);
  }

  const SiteStore = {
    remote: remote,
    clean: clean,

    /* Is the shared database reachable right now? */
    async ping() {
      if (!remote) return false;
      try {
        await rest("counters/visits", null, 4000);
        return true;
      } catch (e) {
        return false;
      }
    },

    /* ---- counters ---- */
    async getCount(name) {
      if (remote) {
        try {
          return Number(await rest("counters/" + name)) || 0;
        } catch (e) {}
      }
      return Number(lsGet("counter:" + name, 0)) || 0;
    },
    async increment(name, by) {
      by = by || 1;
      if (remote) {
        try {
          await rest("counters/" + name, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ".sv": { increment: by } }),
          });
          return this.getCount(name);
        } catch (e) {}
      }
      const next = (Number(lsGet("counter:" + name, 0)) || 0) + by;
      lsSet("counter:" + name, Math.max(0, next));
      return Math.max(0, next);
    },

    /* ---- lists (guestbook) — resolves to "remote" or "local" ---- */
    async addEntry(list, entry) {
      entry = Object.assign({}, entry, { t: Date.now() });
      if (remote) {
        try {
          await rest("lists/" + list, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          });
          return "remote";
        } catch (e) {}
      }
      const items = lsGet("list:" + list, []);
      items.push(entry);
      lsSet("list:" + list, items.slice(-200));
      return "local";
    },
    async listEntries(list, limit) {
      limit = limit || 20;
      let items = null;
      if (remote) {
        try {
          const data = await rest("lists/" + list + '?orderBy="t"&limitToLast=' + limit);
          items = data ? Object.values(data) : [];
        } catch (e) {}
      }
      if (!items) items = lsGet("list:" + list, []);
      return items.sort((a, b) => (b.t || 0) - (a.t || 0)).slice(0, limit);
    },

    /* ---- scores (leaderboards) ---- */
    async addScore(board, entry) {
      entry = Object.assign({}, entry, { t: Date.now() });
      if (remote) {
        try {
          await rest("scores/" + board, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          });
          return "remote";
        } catch (e) {}
      }
      const items = lsGet("scores:" + board, []);
      items.push(entry);
      lsSet("scores:" + board, items.slice(-100));
      return "local";
    },
    /* Best entries of a board. field = what to rank by, dir = "desc" (biggest first) or "asc" */
    async listTop(board, field, n, dir) {
      n = n || 50;
      dir = dir || "desc";
      const sorter = (a, b) => (dir === "asc" ? (a[field] || 0) - (b[field] || 0) : (b[field] || 0) - (a[field] || 0));
      if (remote) {
        try {
          const q = '?orderBy="' + field + '"&' + (dir === "asc" ? "limitToFirst=" : "limitToLast=") + n;
          const data = await rest("scores/" + board + q);
          return (data ? Object.values(data) : []).sort(sorter);
        } catch (e) {}
      }
      return lsGet("scores:" + board, []).slice().sort(sorter).slice(0, n);
    },
    /* everything saved on this device for a board (used for older saved scores) */
    listLocalScores(board) {
      return lsGet("scores:" + board, []);
    },
    async listScores(board) {
      if (remote) {
        try {
          const data = await rest("scores/" + board + '?orderBy="$key"&limitToLast=100');
          return data ? Object.values(data) : [];
        } catch (e) {}
      }
      return lsGet("scores:" + board, []);
    },

    /* ---- achievements bridge (works from any page) ---- */
    unlock(id) {
      try {
        const key = "portfolioPendingUnlocks";
        const q = JSON.parse(localStorage.getItem(key) || "[]");
        if (q.indexOf(id) === -1) q.push(id);
        localStorage.setItem(key, JSON.stringify(q));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent("portfolio:unlock", { detail: id }));
    },
  };

  window.SiteStore = SiteStore;
})();
