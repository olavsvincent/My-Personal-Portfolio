/* ==========================================================
   PROJECT LAB
   An interactive engineering workspace for the portfolio:
   live preview (with device frames), a source viewer that reads
   the real files, architecture maps whose nodes jump to the
   code, metrics counted from the files, GitHub activity,
   a command palette and keyboard shortcuts.
   ========================================================== */
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const Store = window.SiteStore;
  const REPO = cfg.githubRepo || "olavsvincent/My-Personal-Portfolio";
  const BRANCH = cfg.githubBranch || "main";
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  const pad = (n, w) => String(n).padStart(w || 2, "0");
  const fmtBytes = (b) => (b < 1024 ? b + " B" : (b / 1024).toFixed(1) + " KB");
  function ago(date) {
    const s = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 1000));
    const u = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [n, v] of u) if (s >= v) { const k = Math.floor(s / v); return k + " " + n + (k > 1 ? "s" : "") + " ago"; }
    return "just now";
  }
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ---------- languages ---------- */
  const LANGS = {
    html: { n: "HTML", c: "#f97316" }, css: { n: "CSS", c: "#38bdf8" }, js: { n: "JavaScript", c: "#facc15" },
    py: { n: "Python", c: "#34d399" }, md: { n: "Markdown", c: "#a78bfa" }, txt: { n: "Text", c: "#94a3b8" },
  };
  const langOf = (path) => ({ html: "html", css: "css", js: "js", py: "py", md: "md" })[path.split(".").pop().toLowerCase()] || "txt";

  /* ---------- the modules (descriptions come from the portfolio; structure comes from the real code) ---------- */
  const WEB_RUN = (folder) => ({ steps: ["Open " + folder + "/index.html in any modern browser."], note: "No build step and no dependencies." });
  const MODULES = [
    {
      key: "calculator", n: "01", title: "Scientific Calculator", folder: "Calculator", kind: "WEB", color: "#38bdf8",
      stack: ["HTML", "CSS", "JavaScript"], demo: "Calculator/index.html",
      blurb: "Arithmetic, trigonometry, logarithms, roots and exponents, evaluated by a hand-written expression parser instead of eval().",
      features: ["Perform arithmetic operations", "Calculate trigonometric functions", "Calculate logarithms and square roots", "Support exponent calculations"],
      highlights: ["Hand-written recursive-descent parser. There is no eval() and no new Function() anywhere.", "Memory registers (clear, recall, add) and a calculation history panel.", "Works from the on-screen keypad and from the keyboard, with degree and radian modes."],
      learned: "I am developing my understanding of JavaScript functions, mathematical expressions, event handling, and calculator interface design.",
      files: ["index.html", "script.js", "style.css"], run: WEB_RUN("Calculator"),
      arch: [
        { t: "Keypad and keyboard", s: "append()", file: "script.js", find: "function\\s+append\\b" },
        { t: "Expression state", s: "updateExpression()", file: "script.js", find: "function\\s+updateExpression" },
        { t: "Tokenizer", s: "tokenize()", file: "script.js", find: "function\\s+tokenize" },
        { t: "Recursive-descent parser", s: "addSub → multiplyDivide → unary → power → postfix → primary", file: "script.js", find: "function\\s+addSub" },
        { t: "Evaluate", s: "evaluate()", file: "script.js", find: "function\\s+evaluate" },
        { t: "Result, history and memory", s: "memoryAdd() · history panel", file: "script.js", find: "function\\s+memoryAdd" },
      ],
    },
    {
      key: "grade", n: "02", title: "Grade Calculator", folder: "Grade Calculator", kind: "WEB", color: "#34d399",
      stack: ["HTML", "CSS", "JavaScript"], demo: "Grade Calculator/index.html",
      blurb: "Enter subjects and scores, get a validated average with a remark for every grade, saved between visits.",
      features: ["Enter scores", "Calculate the average", "Display results immediately", "Validate numeric inputs"],
      highlights: ["Every grade is validated (0–100) and gets a remark; invalid values are flagged instead of crashing.", "Subjects persist in localStorage, so the data survives a page reload.", "One-click CSV export of the grade sheet."],
      learned: "I practiced JavaScript calculations, handling form inputs, validating values, and displaying results on a webpage.",
      files: ["index.html", "script.js", "style.css"], run: WEB_RUN("Grade Calculator"),
      arch: [
        { t: "Subject form", s: "validField()", file: "script.js", find: "function\\s+validField" },
        { t: "Add a subject", s: "addSubject()", file: "script.js", find: "function\\s+addSubject" },
        { t: "Persist", s: "saveSubjects() → localStorage", file: "script.js", find: "function\\s+saveSubjects" },
        { t: "Render the table", s: "renderSubjects()", file: "script.js", find: "function\\s+renderSubjects" },
        { t: "Summary and remarks", s: "updateSummary() · getRemark()", file: "script.js", find: "function\\s+updateSummary" },
        { t: "CSV export", s: "exportGrades button", file: "script.js", find: "exportGrades" },
      ],
    },
    {
      key: "books", n: "03", title: "Book Management System", folder: "Book Management System", kind: "WEB", color: "#fbbf24",
      stack: ["HTML", "CSS", "JavaScript"], demo: "Book Management System/index.html",
      blurb: "A book collection manager that tracks availability and records borrowed and returned books.",
      features: ["Add book records", "View the book collection", "Track book availability", "Record borrowed and returned books"],
      highlights: ["Records persist in localStorage under a versioned key (bookvault_books_v1).", "Search and filter the collection; toggle a book between available and borrowed.", "Table cells are built with DOM methods rather than HTML strings."],
      learned: "This concept gives me a chance to practice data organization, JavaScript arrays, form handling, and basic record management.",
      files: ["index.html", "script.js", "style.css"], run: WEB_RUN("Book Management System"),
      arch: [
        { t: "Book form", s: "openForm() / closeForm()", file: "script.js", find: "function\\s+openForm" },
        { t: "Load records", s: "loadBooks() ← localStorage", file: "script.js", find: "function\\s+loadBooks" },
        { t: "Save records", s: "saveBooks() → localStorage", file: "script.js", find: "function\\s+saveBooks" },
        { t: "Render", s: "renderBooks() · createCell…()", file: "script.js", find: "function\\s+renderBooks" },
        { t: "Actions", s: "toggleStatus() · deleteBook()", file: "script.js", find: "function\\s+toggleStatus" },
      ],
    },
    {
      key: "health", n: "04", title: "Health Monitoring System", folder: "Health Monitoring System", kind: "WEB · IOT", color: "#fb7185",
      stack: ["HTML", "CSS", "JavaScript", "Canvas"], demo: "Health Monitoring System/index.html",
      blurb: "A dashboard concept for heart rate and blood-oxygen monitoring with live charts, configurable limits and alerts.",
      features: ["Monitor heart rate", "Monitor blood oxygen saturation", "Display readings on a dashboard", "Provide an emergency alert concept"],
      highlights: ["Readings are simulated (an ESP32 sensor is the intended source), and the page says so.", "Charts are drawn from scratch on a canvas. No charting library is used.", "Alert limits are configurable, readings keep a history, and the history exports to CSV."],
      learned: "This project concept helps me explore embedded systems, sensor integration, web dashboards, and communication between hardware and software.",
      files: ["index.html", "script.js", "style.css"], run: WEB_RUN("Health Monitoring System"),
      arch: [
        { t: "Start monitoring", s: "startMonitoring() · setInterval", file: "script.js", find: "function\\s+startMonitoring" },
        { t: "Reading source", s: "generateReading()", file: "script.js", sim: true, find: "function\\s+generateReading" },
        { t: "Classify", s: "processReading() · getReadingStatus()", file: "script.js", find: "function\\s+getReadingStatus" },
        { t: "Alerts", s: "handleAlerts() → addAlert()", file: "script.js", find: "function\\s+handleAlerts" },
        { t: "Charts on canvas", s: "drawChart()", file: "script.js", find: "function\\s+drawChart" },
        { t: "History and export", s: "renderHistory() · escapeCSV()", file: "script.js", find: "escapeCSV" },
      ],
    },
    {
      key: "workout", n: "05", title: "Workout Planner", folder: "Workout Planner", kind: "WEB", color: "#a78bfa",
      stack: ["HTML", "CSS", "JavaScript", "Responsive"], demo: "Workout Planner/index.html",
      blurb: "Plan a week of training around your goal and the equipment you have, then track a session.",
      features: ["Organize workout routines", "Display exercise information", "Support responsive layouts", "Plan workouts around fitness goals"],
      highlights: ["The weekly plan is generated from the chosen goal and available equipment.", "A session view with number inputs and a live progress indicator.", "Fully responsive layout."],
      learned: "I practiced responsive web design, JavaScript interactions, and organizing page content with HTML and CSS.",
      files: ["index.html", "script.js", "style.css"], run: WEB_RUN("Workout Planner"),
      arch: [
        { t: "Goal and equipment", s: "getEquipment() · getSettingKey()", file: "script.js", find: "function\\s+getEquipment" },
        { t: "Pick the exercises", s: "getDayPlan() · getExerciseList()", file: "script.js", find: "function\\s+getDayPlan" },
        { t: "Weekly view", s: "renderWeek()", file: "script.js", find: "function\\s+renderWeek" },
        { t: "Session view", s: "renderSession() · createNumberInput()", file: "script.js", find: "function\\s+renderSession" },
        { t: "Progress", s: "updateProgress() · updateSummary()", file: "script.js", find: "function\\s+updateProgress" },
      ],
    },
    {
      key: "students", n: "06", title: "Student Management System", folder: "Student Management System", kind: "PYTHON", color: "#2dd4bf",
      stack: ["Python", "CLI", "JSON"], demo: null, demoKind: "students",
      blurb: "A menu-driven Python application with full record management: add, view, search, update, delete, count, filter and export.",
      features: ["Add student records", "View saved student records", "Check duplicate student IDs", "Organize student information"],
      highlights: ["17 functions covering add, view, search, update, delete, count, filter and export.", "Persists to a JSON file and validates the schema on load, so a damaged file cannot crash the program.", "Guards against duplicate student IDs and asks for confirmation before deleting."],
      learned: "I practiced Python classes, lists, dictionaries, input validation, and organizing a menu-driven program.",
      files: ["student_management_system.py"],
      run: { steps: ["python student_management_system.py"], note: "Needs Python 3. Records are saved next to the script as JSON." },
      arch: [
        { t: "Menu loop", s: "main()", file: "student_management_system.py", find: "def\\s+main\\(" },
        { t: "Safe input", s: "get_input()", file: "student_management_system.py", find: "def\\s+get_input\\(" },
        { t: "Add with duplicate-ID guard", s: "add_student()", file: "student_management_system.py", find: "def\\s+add_student\\(" },
        { t: "Load and validate JSON", s: "load_students()", file: "student_management_system.py", find: "def\\s+load_students\\(" },
        { t: "Save to disk", s: "save_students()", file: "student_management_system.py", find: "def\\s+save_students\\(" },
        { t: "Export a backup", s: "export_students()", file: "student_management_system.py", find: "def\\s+export_students\\(" },
      ],
    },
    {
      key: "sysvision", n: "07", title: "SysVision", folder: "SysVision", kind: "FULL-STACK", color: "#f472b6",
      stack: ["Python", "Flask", "psutil", "Chart.js", "JavaScript"], demo: null, demoKind: "sysvision",
      blurb: "A local performance dashboard: a Flask service reads real CPU, RAM, disk and uptime, and the browser charts it live.",
      features: ["Visualize computer performance", "Monitor CPU and memory resource usage", "Display simulated hardware sensor readings", "View diagnostics and system alerts", "Present performance data using charts"],
      highlights: ["Real readings (CPU, RAM, disk, uptime) come from psutil through a small JSON API.", "GPU temperature, CPU temperature and fan speed are simulated, and the UI labels them as simulated.", "The service binds to 127.0.0.1 only, so it is not exposed to the network."],
      learned: "This project explores dashboard design, Python Flask integration, JavaScript data visualization, and presenting system monitoring information through a web interface.",
      files: ["app.py", "static/app.js", "templates/index.html", "static/style.css", "requirements.txt", "README.md"],
      run: {
        steps: ["py -m venv .venv", ".\\.venv\\Scripts\\Activate.ps1", "python -m pip install -r requirements.txt", "python app.py"],
        note: "Then open http://127.0.0.1:5000. Keep the terminal running. Needs Python 3.10+.",
      },
      arch: [
        { t: "Browser dashboard", s: "refreshLive()", file: "static/app.js", find: "function\\s+refreshLive" },
        { t: "Polling request", s: 'fetch("/api/stats")', file: "static/app.js", find: "fetch\\(\\s*\"/api/stats\"" },
        { t: "Flask route", s: "@app.route('/api/stats')", file: "app.py", find: "@app\\.route\\(\"/api/stats\"\\)" },
        { t: "Read the machine", s: "get_system_stats() · psutil", file: "app.py", find: "def\\s+get_system_stats" },
        { t: "Render live stats and chart", s: "renderLiveStats() · Chart.js", file: "static/app.js", find: "function\\s+renderLiveStats" },
        { t: "Simulated sensors", s: "renderSimulation()", file: "static/app.js", sim: true, find: "function\\s+renderSimulation" },
      ],
    },
  ];
  MODULES.forEach((m) => {
    m.fileList = m.files.map((p) => ({ path: p, url: encodeURI(m.folder + "/" + p), lang: langOf(p) }));
  });

  /* ---------- syntax highlighting (small, dependency-free) ---------- */
  const KW = {
    js: /\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|async|await|try|catch|finally|throw|typeof|instanceof|in|of|this|import|export|default|from|delete|void|null|undefined|true|false)\b/y,
    py: /\b(?:def|class|return|if|elif|else|for|while|break|continue|pass|import|from|as|try|except|finally|raise|with|lambda|global|nonlocal|in|is|not|and|or|None|True|False|yield|async|await)\b/y,
  };
  const PY_BUILTIN = /\b(?:print|len|int|str|float|input|open|range|isinstance|dict|list|set|tuple|enumerate|sorted|sum|min|max|abs|round|any|all|zip|map|filter)\b/y;
  const RULES = {
    js: [["c", /\/\/[^\n]*|\/\*[\s\S]*?\*\//y], ["s", /`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y], ["n", /\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b/iy], ["k", KW.js], ["f", /[A-Za-z_$][\w$]*(?=\s*\()/y], ["o", /[{}()[\];,.<>+\-*\/%=&|^!?:~]+/y]],
    py: [["c", /#[^\n]*/y], ["s", /[rRfFbB]{0,2}(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')/y], ["a", /@[\w.]+/y], ["n", /\b\d+(?:\.\d+)?\b/y], ["k", KW.py], ["p", PY_BUILTIN], ["f", /(?<=\b(?:def|class)\s+)\w+/y], ["f", /[A-Za-z_]\w*(?=\()/y], ["o", /[{}()[\];,.<>+\-*\/%=&|^!?:~]+/y]],
    css: [["c", /\/\*[\s\S]*?\*\//y], ["s", /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y], ["k", /@[\w-]+/y], ["n", /#[\da-f]{3,8}\b|-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|ms|deg|fr)?\b/iy], ["a", /--[\w-]+/y], ["p", /[\w-]+(?=\s*:\s*[^;{}]*[;}])/y], ["o", /[{}()[\];,:>+~*]+/y]],
    md: [["h", /^#{1,6}[^\n]*/my], ["s", /`[^`\n]+`/y], ["k", /\*\*[^*\n]+\*\*/y], ["f", /\[[^\]\n]+\]\([^)\n]+\)/y]],
    txt: [],
  };

  /* turn source text into an array of lines, each an array of [class, text] pieces */
  function tokenize(code, lang) {
    const lines = [[]];
    const push = (cls, text) => {
      const parts = text.split("\n");
      parts.forEach((p, i) => {
        if (i > 0) lines.push([]);
        if (p) lines[lines.length - 1].push([cls, p]);
      });
    };
    function run(src, l) {
      const rules = RULES[l] || [];
      let i = 0, plain = "";
      const flush = () => { if (plain) { push("", plain); plain = ""; } };
      while (i < src.length) {
        let hit = null;
        for (const [cls, rx] of rules) {
          rx.lastIndex = i;
          const m = rx.exec(src);
          if (m && m.index === i && m[0].length) { hit = [cls, m[0]]; break; }
        }
        if (hit) { flush(); push(hit[0], hit[1]); i += hit[1].length; }
        else { plain += src[i]; i++; }
      }
      flush();
    }
    if (lang !== "html") { run(code, lang); return lines; }

    // HTML: tags, attributes, strings, comments, plus embedded <script> / <style>
    let i = 0, inTag = false, plain = "";
    const flush = () => { if (plain) { push("", plain); plain = ""; } };
    while (i < code.length) {
      let m;
      if (!inTag) {
        const open = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[A-Za-z][^\s>\/]*/iy;
        open.lastIndex = i;
        m = open.exec(code);
        if (m && m.index === i) {
          flush();
          if (m[0].startsWith("<!--")) push("c", m[0]); else if (/^<!DOCTYPE/i.test(m[0])) push("c", m[0]); else { push("k", m[0]); inTag = true; }
          i += m[0].length;
          continue;
        }
        plain += code[i]; i++;
      } else {
        const tagTok = /\s+|[A-Za-z_:@][\w:.@-]*(?=\s*=)|"[^"]*"|'[^']*'|\/?>|[=\/]|[^\s>"'=\/]+/y;
        tagTok.lastIndex = i;
        m = tagTok.exec(code);
        if (!m || m.index !== i) { plain += code[i]; i++; continue; }
        flush();
        const t = m[0];
        if (/^\s+$/.test(t)) push("", t);
        else if (t === ">" || t === "/>") {
          push("k", t); inTag = false; i += t.length;
          const before = code.slice(0, i);
          const last = before.lastIndexOf("<");
          const name = (before.slice(last).match(/^<([A-Za-z]+)/) || [])[1];
          if (name && /^(script|style)$/i.test(name) && t === ">") {
            const end = code.toLowerCase().indexOf("</" + name.toLowerCase(), i);
            const stop = end === -1 ? code.length : end;
            run(code.slice(i, stop), name.toLowerCase() === "script" ? "js" : "css");
            i = stop;
          }
          continue;
        }
        else if (t[0] === '"' || t[0] === "'") push("s", t);
        else if (t === "=" || t === "/") push("o", t);
        else if (/^[A-Za-z_:@][\w:.@-]*$/.test(t) && /^\s*=/.test(code.slice(i + t.length, i + t.length + 6))) push("a", t);
        else push("", t);
        i += t.length;
        continue;
      }
    }
    flush();
    return lines;
  }

  /* ==========================================================
     DATA: fetching files and counting them
     ========================================================== */
  const state = { key: null, tab: "preview", file: 0, device: "desktop" };
  const texts = new Map();   // url -> text | null
  const stats = new Map();   // module key -> { files, lines, bytes }
  let indexed = false;

  async function fetchText(url) {
    if (texts.has(url)) return texts.get(url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("bad status");
      const t = (await res.text()).replace(/\r\n?/g, "\n");
      texts.set(url, t);
      return t;
    } catch (e) {
      texts.set(url, null);
      return null;
    }
  }
  const countLines = (t) => (t.endsWith("\n") ? t.slice(0, -1) : t).split("\n").length;
  const enc = new TextEncoder();

  /* ==========================================================
     BOOT TERMINAL + INDEXING (the numbers are real)
     ========================================================== */
  const TOTAL_FILES = MODULES.reduce((n, m) => n + m.fileList.length, 0);
  let idxLine = null;

  function addBootLine(parts) {
    const pre = $("#boot");
    const line = el("span");
    parts.forEach(([cls, text]) => line.append(cls ? Object.assign(el("span", cls), { textContent: text }) : document.createTextNode(text)));
    pre.append(line, document.createTextNode("\n"));
    return line;
  }
  function bootSequence() {
    const pre = $("#boot");
    pre.textContent = "";
    const steps = [
      () => addBootLine([["dim", "$ "], ["acc", "boot project-lab --verbose"]]),
      () => addBootLine([["ok", "[ OK ] "], ["", "mounting " + MODULES.length + " modules"]]),
      () => { idxLine = addBootLine([["acc", "[ .. ] "], ["", "indexing sources  "], ["acc", "0/" + TOTAL_FILES]]); },
    ];
    return new Promise((resolve) => {
      let i = 0;
      const next = () => {
        if (i >= steps.length) return resolve();
        steps[i++]();
        if (reduce) next(); else setTimeout(next, 280);
      };
      next();
    });
  }
  function setIndexProgress(done) {
    $("#idxText").textContent = "INDEXING SOURCES " + done + "/" + TOTAL_FILES;
    $("#idxBar").style.width = (done / TOTAL_FILES) * 100 + "%";
    if (idxLine) idxLine.lastChild.textContent = done + "/" + TOTAL_FILES;
  }

  async function indexAll() {
    const jobs = [];
    MODULES.forEach((m) => m.fileList.forEach((f) => jobs.push({ m, f })));
    const per = new Map(MODULES.map((m) => [m.key, []]));
    let done = 0, next = 0;
    async function worker() {
      while (next < jobs.length) {
        const { m, f } = jobs[next++];
        const t = await fetchText(f.url);
        if (t != null) per.get(m.key).push({ path: f.path, lang: f.lang, lines: countLines(t), bytes: enc.encode(t).length });
        else per.get(m.key).push({ path: f.path, lang: f.lang, lines: 0, bytes: 0, missing: true });
        setIndexProgress(++done);
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]);
    MODULES.forEach((m) => {
      const files = m.fileList.map((f) => per.get(m.key).find((x) => x.path === f.path));
      const lines = files.reduce((n, f) => n + f.lines, 0);
      const bytes = files.reduce((n, f) => n + f.bytes, 0);
      stats.set(m.key, { files, lines, bytes });
    });
    indexed = true;
  }

  function countUp(node, to, ms) {
    if (reduce || to < 2) { node.textContent = to.toLocaleString(); return; }
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      node.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString();
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function showMetrics() {
    const all = [...stats.values()];
    const files = all.reduce((n, s) => n + s.files.filter((f) => !f.missing).length, 0);
    const lines = all.reduce((n, s) => n + s.lines, 0);
    const byLang = {};
    all.forEach((s) => s.files.forEach((f) => { byLang[f.lang] = (byLang[f.lang] || 0) + f.lines; }));
    const langs = Object.keys(byLang).filter((k) => byLang[k] > 0 && k !== "txt").sort((a, b) => byLang[b] - byLang[a]);
    const codeLangs = langs.filter((k) => k !== "md");
    const vals = { modules: MODULES.length, files, lines, langs: codeLangs.length };
    $$("#metrics .metric").forEach((tile) => {
      tile.classList.remove("loading");
      countUp($("b", tile), vals[tile.dataset.m], 1100);
    });
    const bar = $("#langBar"), legend = $("#langLegend");
    const mixTotal = langs.reduce((n, k) => n + byLang[k], 0);
    bar.textContent = ""; legend.textContent = "";
    langs.forEach((k) => {
      const seg = el("span");
      seg.style.color = LANGS[k].c; seg.style.background = LANGS[k].c; seg.title = LANGS[k].n + ": " + byLang[k] + " lines";
      bar.append(seg);
      requestAnimationFrame(() => requestAnimationFrame(() => (seg.style.width = (byLang[k] / mixTotal) * 100 + "%")));
      const li = el("li");
      const dot = el("i"); dot.style.background = LANGS[k].c;
      li.append(dot, LANGS[k].n + "  " + Math.round((byLang[k] / mixTotal) * 100) + "%  (" + byLang[k].toLocaleString() + ")");
      legend.append(li);
    });
    $("#langTotal").textContent = lines.toLocaleString() + " LINES · " + files + " FILES";
    bar.setAttribute("aria-label", "Language mix: " + langs.map((k) => LANGS[k].n + " " + Math.round((byLang[k] / mixTotal) * 100) + "%").join(", "));

    // per-module bars in the directory
    const max = Math.max.apply(null, all.map((s) => s.lines));
    MODULES.forEach((m) => {
      const s = stats.get(m.key);
      const btn = $('.module[data-key="' + m.key + '"]');
      if (!btn) return;
      $(".loc i", btn).style.width = (s.lines / max) * 100 + "%";
      $("small", btn).textContent = m.stack.slice(0, 3).join(" · ") + "  |  " + s.lines.toLocaleString() + " LOC";
    });

    if (idxLine) {
      idxLine.firstChild.textContent = "[ OK ] ";
      idxLine.firstChild.className = "ok";
      idxLine.lastChild.textContent = TOTAL_FILES + "/" + TOTAL_FILES + "  done";
    }
    addBootLine([["ok", "[ OK ] "], ["", lines.toLocaleString() + " lines · " + codeLangs.length + " languages · " + files + " files"]]);
    const last = addBootLine([["ok", "[ OK ] "], ["", "lab online. Pick a module "], ["acc", "▸"]]);
    last.append(Object.assign(el("span", "caret"), {}));
    if (state.tab === "details" || state.tab === "source") renderTab(state.tab, true);
  }

  /* ==========================================================
     DIRECTORY
     ========================================================== */
  function buildDirectory() {
    const ul = $("#modules");
    ul.textContent = "";
    MODULES.forEach((m) => {
      const li = el("li");
      li.setAttribute("role", "presentation");
      const b = el("button", "module");
      b.type = "button"; b.dataset.key = m.key; b.setAttribute("role", "option"); b.setAttribute("aria-selected", "false");
      b.style.setProperty("--lv", m.color);
      const mid = el("span");
      mid.append(el("b", "", m.title), el("small", "", m.stack.slice(0, 3).join(" · ")));
      b.append(el("span", "num", m.n), mid, el("span", "kind", m.kind));
      const loc = el("span", "loc"); loc.append(el("i"));
      b.append(loc);
      b.addEventListener("click", () => select(m.key));
      li.append(b);
      ul.append(li);
    });
    $("#modFilter").addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      let shown = 0;
      MODULES.forEach((m) => {
        const hay = (m.title + " " + m.stack.join(" ") + " " + m.kind + " " + m.folder).toLowerCase();
        const on = !q || hay.indexOf(q) !== -1;
        $('.module[data-key="' + m.key + '"]').parentNode.hidden = !on;
        if (on) shown++;
      });
      $("#modCount").textContent = pad(shown);
    });
  }

  /* ==========================================================
     SELECTION, TABS, URL
     ========================================================== */
  const TABS = ["preview", "source", "arch", "details"];
  const current = () => MODULES.find((m) => m.key === state.key);
  const rendered = {}; // tab -> module key it was rendered for

  function syncUrl() {
    const u = new URL(location.href);
    u.searchParams.set("app", state.key);
    u.searchParams.set("tab", state.tab);
    if (state.tab === "source" && state.file) u.searchParams.set("file", String(state.file)); else u.searchParams.delete("file");
    history.replaceState(null, "", u);
  }

  function select(key, opts) {
    opts = opts || {};
    const m = MODULES.find((x) => x.key === key) || MODULES[0];
    const changed = state.key !== m.key;
    state.key = m.key;
    if (changed) { state.file = 0; TABS.forEach((t) => (rendered[t] = null)); }
    if (opts.tab) state.tab = opts.tab;
    if (opts.file != null) state.file = opts.file;
    $$(".module").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.key === m.key)));
    $("#wsTag").textContent = "MODULE " + m.n + " // " + m.kind;
    $("#wsTitle").textContent = m.title;
    $("#wsDesc").textContent = m.blurb;
    const stack = $("#wsStack"); stack.textContent = "";
    m.stack.forEach((s) => stack.append(el("span", "", s)));
    $("#workspace").style.setProperty("--a", m.color);
    setTab(state.tab, opts);
    if (changed && Store) Store.unlock("lab_explorer");
  }

  function setTab(tab, opts) {
    state.tab = tab;
    TABS.forEach((t) => {
      const b = $("#tab-" + t);
      const on = t === tab;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      $("#panel-" + t).hidden = !on;
    });
    renderTab(tab, false, opts);
    syncUrl();
  }

  function renderTab(tab, force, opts) {
    const m = current();
    if (!force && rendered[tab] === m.key && !(opts && opts.jump)) return;
    rendered[tab] = m.key;
    if (tab === "preview") renderPreview(m);
    else if (tab === "source") renderSource(m, opts);
    else if (tab === "arch") renderArch(m);
    else renderDetails(m);
  }

  function move(step) {
    const i = MODULES.findIndex((m) => m.key === state.key);
    select(MODULES[(i + step + MODULES.length) % MODULES.length].key);
  }

  /* ==========================================================
     PREVIEW
     ========================================================== */
  const DEVICES = { desktop: "Desktop", tablet: "Tablet", mobile: "Mobile" };
  let stageNode = null;

  function setDevice(d) {
    state.device = d;
    const dev = $(".device");
    if (dev) dev.dataset.d = d;
    $$(".devices button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.d === d)));
  }

  function renderPreview(m) {
    const p = $("#panel-preview");
    p.textContent = "";
    if (m.demoKind === "students") return studentsDemo(p, m);
    if (m.demoKind === "sysvision") return sysvisionPanel(p, m);

    const tools = el("div", "pv-tools");
    const devices = el("div", "devices");
    devices.setAttribute("role", "group"); devices.setAttribute("aria-label", "Device size");
    Object.keys(DEVICES).forEach((d) => {
      const b = el("button", "", DEVICES[d]);
      b.type = "button"; b.dataset.d = d; b.setAttribute("aria-pressed", String(d === state.device));
      b.addEventListener("click", () => setDevice(d));
      devices.append(b);
    });
    const url = el("div", "urlbar");
    url.append(el("i"), el("span", "", "localhost / " + m.demo));
    const btns = el("div", "ws-actions");
    const reload = el("button", "icon-btn", "↻ Reload"); reload.type = "button";
    const open = el("a", "icon-btn", "Open ↗"); open.href = encodeURI(m.demo); open.target = "_blank"; open.rel = "noopener";
    open.style.textDecoration = "none";
    const full = el("button", "icon-btn", "⛶ Fullscreen"); full.type = "button";
    btns.append(reload, open, full);
    tools.append(devices, url, btns);

    const stage = el("div", "stage");
    const dev = el("div", "device");
    dev.dataset.d = state.device;
    const loading = el("div", "loading");
    loading.append(el("div", "spinner"), document.createTextNode("LOADING " + m.title.toUpperCase()));
    const frame = document.createElement("iframe");
    frame.title = m.title + " (live preview)";
    frame.src = encodeURI(m.demo);
    frame.loading = "lazy";
    frame.addEventListener("load", () => loading.remove());
    setTimeout(() => loading.remove(), 9000);
    dev.append(frame);
    stage.append(dev, loading);
    stageNode = stage;
    reload.addEventListener("click", () => { stage.append(loading); try { frame.contentWindow.location.reload(); } catch (e) { frame.src = frame.src; } setTimeout(() => loading.remove(), 4000); });
    full.addEventListener("click", () => toggleFullscreen());
    p.append(tools, stage, el("p", "pv-note", "This is the real project, running live. Resize it with the device buttons, or open the Source tab to read how it works."));
  }

  function toggleFullscreen() {
    if (!stageNode || state.tab !== "preview") { toast("Open a live preview first"); return; }
    if (document.fullscreenElement) document.exitFullscreen();
    else if (stageNode.requestFullscreen) stageNode.requestFullscreen();
    else toast("Fullscreen isn't available in this browser");
  }

  /* --- browser companion for the Python CLI project --- */
  function studentsDemo(p, m) {
    const KEY = "vlab_students";
    const read = () => {
      try {
        const d = JSON.parse(localStorage.getItem(KEY) || "[]");
        return Array.isArray(d) ? d.filter((s) => s && typeof s === "object" && ["id", "name", "course", "year"].every((k) => k in s)) : [];
      } catch (e) { return []; }
    };
    const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} };
    let students = read();

    const box = el("div", "fallback");
    box.append(el("h3", "", "Browser companion"));
    box.append(el("p", "", "The real project is a Python command-line program (read it in the Source tab). This is a small browser version of the same record logic so you can try it: duplicate-ID guard, schema validation on load, and a JSON backup."));
    const msg = el("p", "msg"); msg.setAttribute("role", "status"); msg.setAttribute("aria-live", "polite");

    const form = el("form", "demo-form");
    const fId = el("input"); fId.placeholder = "Student ID"; fId.maxLength = 24; fId.required = true; fId.setAttribute("aria-label", "Student ID");
    const fName = el("input"); fName.placeholder = "Full name"; fName.maxLength = 70; fName.required = true; fName.setAttribute("aria-label", "Full name");
    const fCourse = el("input"); fCourse.placeholder = "Course"; fCourse.maxLength = 50; fCourse.required = true; fCourse.setAttribute("aria-label", "Course");
    const fYear = el("select"); fYear.setAttribute("aria-label", "Year level");
    [1, 2, 3, 4, 5].forEach((y) => { const o = el("option", "", "Year " + y); o.value = String(y); fYear.append(o); });
    const add = el("button", "small-btn", "Add"); add.type = "submit";
    form.append(fId, fName, fCourse, fYear, add);

    const row = el("div", "demo-row");
    const search = el("input", "demo-search"); search.type = "search"; search.placeholder = "Search by ID, name or course…"; search.setAttribute("aria-label", "Search students");
    const exp = el("button", "small-btn ghost", "Export JSON"); exp.type = "button";
    const sample = el("button", "small-btn ghost", "Add 3 sample records"); sample.type = "button";
    const count = el("span", "tag", "");
    row.append(search, sample, exp, count);

    const wrap = el("div", "tbl-wrap");
    const table = el("table");
    const thead = el("thead"); const hr = el("tr");
    ["ID", "Name", "Course", "Year", ""].forEach((h) => hr.append(el("th", "", h)));
    thead.append(hr);
    const tbody = el("tbody");
    table.append(thead, tbody); wrap.append(table);

    function draw() {
      const q = search.value.trim().toLowerCase();
      tbody.textContent = "";
      const list = students.filter((s) => !q || (s.id + " " + s.name + " " + s.course).toLowerCase().indexOf(q) !== -1);
      list.forEach((s) => {
        const tr = el("tr");
        [s.id, s.name, s.course, "Year " + s.year].forEach((v) => tr.append(el("td", "", String(v))));
        const td = el("td");
        const del = el("button", "small-btn danger", "Delete"); del.type = "button";
        let armed = false;
        del.addEventListener("click", () => {
          if (!armed) { armed = true; del.textContent = "Sure?"; setTimeout(() => { armed = false; del.textContent = "Delete"; }, 2500); return; }
          students = students.filter((x) => x.id !== s.id); write(students); msg.textContent = "Deleted " + s.name + "."; draw();
        });
        td.append(del); tr.append(td); tbody.append(tr);
      });
      if (!list.length) { const tr = el("tr"); const td = el("td", "", students.length ? "No match." : "No records yet. Add one above."); td.colSpan = 5; td.style.color = "var(--muted)"; tr.append(td); tbody.append(tr); }
      count.textContent = students.length + " RECORD" + (students.length === 1 ? "" : "S");
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = fId.value.trim(), name = fName.value.trim(), course = fCourse.value.trim();
      if (!id || !name || !course) { msg.textContent = "Please fill in every field."; return; }
      if (students.some((s) => String(s.id).toLowerCase() === id.toLowerCase())) { msg.textContent = "Error: Student ID already exists!"; fId.focus(); return; }
      students.push({ id, name, course, year: Number(fYear.value) });
      write(students); form.reset(); msg.textContent = "Student added."; draw(); fId.focus();
    });
    search.addEventListener("input", draw);
    sample.addEventListener("click", () => {
      [["2026-0001", "Alex Rivera", "BS Computer Engineering", 1], ["2026-0002", "Sam Cruz", "BS Information Technology", 2], ["2026-0003", "Jamie Santos", "BS Electronics Engineering", 3]].forEach(([id, name, course, year]) => {
        if (!students.some((s) => s.id === id)) students.push({ id, name, course, year });
      });
      write(students); msg.textContent = "Sample records added (clearly fake names)."; draw();
    });
    exp.addEventListener("click", () => {
      if (!students.length) { msg.textContent = "No student records available to export."; return; }
      download("student_backup.json", JSON.stringify(students, null, 4), "application/json");
      msg.textContent = "Records exported successfully to student_backup.json!";
    });
    box.append(msg, form, row, wrap);
    p.append(box);
    draw();
  }

  /* --- honest panel for the Flask project (it needs a local Python service) --- */
  function sysvisionPanel(p, m) {
    const box = el("div", "fallback");
    box.append(el("h3", "", "Runs on your computer"));
    box.append(el("p", "", "SysVision reads real CPU, RAM and disk numbers, which a website can't do on its own. It needs its small Python service running locally, so it can't be embedded here. Here is how to run it and exactly what it serves."));
    const grid = el("div", "grid-2");

    const left = el("div", "mini");
    left.append(el("h4", "", "Run it locally"));
    m.run.steps.forEach((s) => left.append(cmd(s)));
    left.append(el("p", "", m.run.note));
    left.lastChild.style.marginTop = "8px"; left.lastChild.style.color = "var(--muted)";

    const right = el("div", "mini");
    right.append(el("h4", "", "GET /api/stats  ·  response shape"));
    const json = el("pre", "json");
    const rows = [["timestamp", "ISO-8601 string"], ["hostname", "string"], ["platform", "string"], ["processor", "string"], ["cpu_percent", "float 0–100"], ["memory_percent", "float"], ["memory_used_gb", "float"], ["memory_total_gb", "float"], ["disk_percent", "float"], ["disk_used_gb", "float"], ["disk_total_gb", "float"], ["uptime_hours", "float"], ["data_source", '"live"']];
    json.append("{\n");
    rows.forEach(([k, v], i) => {
      json.append('  "'); json.append(Object.assign(el("span", "k"), { textContent: k })); json.append('": ');
      json.append(Object.assign(el("span", "v"), { textContent: v })); json.append(i < rows.length - 1 ? ",\n" : "\n");
    });
    json.append("}");
    right.append(json);

    const real = el("div", "mini");
    real.append(el("h4", "", "Real readings"));
    const ul = el("ul"); ["CPU utilization", "RAM usage", "Disk usage", "System uptime", "OS and machine name"].forEach((t) => ul.append(el("li", "", t)));
    real.append(ul);
    const sim = el("div", "mini");
    const h = el("h4", "", "Simulated readings "); h.append(el("span", "sim", "LABELLED IN THE UI"));
    sim.append(h);
    const ul2 = el("ul"); ["CPU temperature", "GPU temperature", "Fan speed", "GPU load"].forEach((t) => ul2.append(el("li", "", t)));
    sim.append(ul2);
    grid.append(left, right, real, sim);
    box.append(grid);
    const row = el("div", "row-actions");
    const src = el("button", "small-btn", "Read app.py ▸"); src.type = "button";
    src.addEventListener("click", () => jumpTo("app.py", "def\\s+get_system_stats"));
    const arch = el("button", "small-btn ghost", "See the architecture"); arch.type = "button";
    arch.addEventListener("click", () => select(m.key, { tab: "arch" }));
    row.append(src, arch);
    box.append(row);
    p.append(box);
  }

  function cmd(text) {
    const d = el("div", "cmd", text);
    const b = el("button", "", "COPY"); b.type = "button";
    b.addEventListener("click", () => copy(text, "Command copied"));
    d.append(b);
    return d;
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); toast(msg || "Copied"); }
    catch (e) { window.prompt("Copy this:", text); }
  }
  function download(name, text, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: type || "text/plain" }));
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ==========================================================
     SOURCE VIEWER
     ========================================================== */
  let src = null;

  function renderSource(m, opts) {
    const p = $("#panel-source");
    p.textContent = "";
    const files = el("div", "src-files");
    files.setAttribute("role", "tablist"); files.setAttribute("aria-label", "Source files");
    m.fileList.forEach((f, i) => {
      const b = el("button", "file-tab");
      b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(i === state.file));
      const dot = el("i"); dot.style.setProperty("--fc", LANGS[f.lang].c);
      b.append(dot, f.path);
      b.addEventListener("click", () => openFile(i));
      files.append(b);
    });

    const bar = el("div", "src-bar");
    const info = el("span", "");
    const tools = el("div", "src-tools");
    const find = el("input", "find"); find.type = "search"; find.placeholder = "Find in file…"; find.setAttribute("aria-label", "Find in file");
    const count = el("span", "", "");
    const bPrev = el("button", "icon-btn", "↑"); const bNext = el("button", "icon-btn", "↓");
    const bWrap = el("button", "icon-btn", "Wrap"); const bMinus = el("button", "icon-btn", "A−"); const bPlus = el("button", "icon-btn", "A+");
    const bCopy = el("button", "icon-btn", "Copy"); const bDl = el("button", "icon-btn", "Download");
    [bPrev, bNext, bWrap, bMinus, bPlus, bCopy, bDl].forEach((b) => (b.type = "button"));
    bPrev.title = "Previous match"; bNext.title = "Next match";
    tools.append(find, count, bPrev, bNext, bWrap, bMinus, bPlus, bCopy, bDl);
    bar.append(info, tools);

    const code = el("div", "code");
    code.tabIndex = 0; code.setAttribute("role", "region"); code.setAttribute("aria-label", "Source code");
    let fs = 13;
    code.style.setProperty("--fs", fs + "px");
    bWrap.addEventListener("click", () => { code.classList.toggle("wrap"); bWrap.setAttribute("aria-pressed", String(code.classList.contains("wrap"))); });
    bMinus.addEventListener("click", () => { fs = Math.max(10, fs - 1); code.style.setProperty("--fs", fs + "px"); });
    bPlus.addEventListener("click", () => { fs = Math.min(22, fs + 1); code.style.setProperty("--fs", fs + "px"); });
    bCopy.addEventListener("click", () => { if (src && src.text != null) copy(src.text, "File copied"); });
    bDl.addEventListener("click", () => { if (src && src.text != null) download(m.fileList[src.idx].path.split("/").pop(), src.text); });

    p.append(files, bar, code);
    src = { m, files, info, code, find, count, text: null, idx: -1, nodes: [], plain: [], matches: [], mi: -1 };

    function runFind() {
      const q = find.value.trim().toLowerCase();
      src.matches = [];
      src.nodes.forEach((n, i) => {
        const hit = q && src.plain[i].toLowerCase().indexOf(q) !== -1;
        n.classList.toggle("hit", Boolean(hit));
        if (hit) src.matches.push(i);
      });
      src.mi = -1;
      count.textContent = q ? src.matches.length + " found" : "";
      if (q && src.matches.length) stepFind(1);
    }
    function stepFind(d) {
      if (!src.matches.length) return;
      src.mi = (src.mi + d + src.matches.length) % src.matches.length;
      const i = src.matches[src.mi];
      src.nodes[i].scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      count.textContent = src.mi + 1 + " / " + src.matches.length;
    }
    find.addEventListener("input", runFind);
    find.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); stepFind(e.shiftKey ? -1 : 1); } if (e.key === "Escape") { find.value = ""; runFind(); } });
    bNext.addEventListener("click", () => stepFind(1));
    bPrev.addEventListener("click", () => stepFind(-1));

    openFile(state.file, opts && opts.line);
  }

  async function openFile(idx, jumpSource) {
    if (!src) return;
    const ctx = src, m = ctx.m, f = m.fileList[idx];
    state.file = idx;
    $$(".file-tab", ctx.files).forEach((b, i) => b.setAttribute("aria-selected", String(i === idx)));
    ctx.code.textContent = "";
    ctx.code.append(el("div", "code-empty", "LOADING " + f.path.toUpperCase() + "…"));
    const text = await fetchText(f.url);
    if (src !== ctx || state.file !== idx) return; // the user moved on
    ctx.idx = idx; ctx.text = text;
    ctx.code.textContent = "";
    if (text == null) {
      ctx.info.textContent = f.path;
      ctx.code.append(el("div", "code-empty", "Couldn't load " + f.path + ". If you opened this page straight from a folder, run it through a local server (for example VS Code Live Server)."));
      return;
    }
    const lines = tokenize(text.replace(/\n$/, ""), f.lang);
    const frag = document.createDocumentFragment();
    ctx.nodes = []; ctx.plain = text.replace(/\n$/, "").split("\n");
    lines.forEach((parts, i) => {
      const row = el("div", "cl");
      row.append(el("span", "ln", String(i + 1)));
      const lc = el("span", "lc");
      parts.forEach(([cls, t]) => lc.append(cls ? Object.assign(el("span", "t-" + cls), { textContent: t }) : document.createTextNode(t)));
      if (!parts.length) lc.append(document.createTextNode(" "));
      row.append(lc);
      frag.append(row);
      ctx.nodes.push(row);
    });
    ctx.code.append(frag);
    const s = stats.get(m.key);
    const fileStat = s && s.files[idx];
    ctx.info.textContent = "";
    ctx.info.append(Object.assign(el("b"), { textContent: m.folder + "/" + f.path }), "  ·  " + LANGS[f.lang].n + "  ·  " + ctx.plain.length.toLocaleString() + " lines  ·  " + fmtBytes(fileStat ? fileStat.bytes : enc.encode(text).length));
    syncUrl();
    if (Store) Store.unlock("code_reader");
    if (jumpSource) {
      const rx = new RegExp(jumpSource);
      const at = ctx.plain.findIndex((l) => rx.test(l));
      if (at !== -1) {
        const node = ctx.nodes[at];
        node.scrollIntoView({ block: "center", behavior: "auto" });
        node.classList.add("flash");
        toast("Line " + (at + 1) + " · " + ctx.plain[at].trim().slice(0, 48));
      }
    }
  }

  function jumpTo(path, find) {
    const m = current();
    const idx = m.fileList.findIndex((f) => f.path === path);
    select(m.key, { tab: "source", file: idx === -1 ? 0 : idx, jump: true, line: find });
  }

  /* ==========================================================
     ARCHITECTURE
     ========================================================== */
  function renderArch(m) {
    const p = $("#panel-arch");
    p.textContent = "";
    const hint = el("p", "arch-hint");
    hint.append("How data moves through this project. ", Object.assign(el("b"), { textContent: "Click any step" }), " to jump to the exact line of real code.");
    const flow = el("div", "flow");
    m.arch.forEach((n, i) => {
      const b = el("button", "node");
      b.type = "button";
      b.append(el("span", "ni", pad(i + 1)));
      const mid = el("span");
      const title = el("b", "", n.t);
      if (n.sim) { title.append(" "); title.append(el("span", "sim", "SIMULATED")); }
      mid.append(title, Object.assign(el("code"), { textContent: n.s }));
      b.append(mid, el("span", "go", n.file.split("/").pop().toUpperCase() + " ▸"));
      b.addEventListener("click", () => jumpTo(n.file, n.find));
      flow.append(b);
      if (i < m.arch.length - 1) flow.append(el("span", "wire"));
    });
    p.append(hint, flow);
  }

  /* ==========================================================
     DETAILS
     ========================================================== */
  function card(title, wide) {
    const c = el("section", "card" + (wide ? " wide" : ""));
    c.append(el("h3", "", title));
    return c;
  }
  const listOf = (items) => { const ul = el("ul"); items.forEach((t) => ul.append(el("li", "", t))); return ul; };

  function renderDetails(m) {
    const p = $("#panel-details");
    p.textContent = "";
    const g = el("div", "dgrid");

    const hi = card("Engineering highlights", true); hi.append(listOf(m.highlights));
    const fe = card("Features"); fe.append(listOf(m.features));
    const le = card("What I learned"); le.append(el("p", "quote", m.learned));
    const run = card("Run it yourself");
    if (m.run.steps.length === 1 && m.kind.indexOf("WEB") === 0) run.append(el("p", "", m.run.steps[0]));
    else m.run.steps.forEach((s) => run.append(cmd(s)));
    const note = el("p", "", m.run.note); note.style.color = "var(--muted)"; note.style.marginTop = "8px"; run.append(note);

    const ft = card("Source files (counted live)", true);
    const s = stats.get(m.key);
    if (!s) ft.append(el("p", "", "Counting lines…"));
    else {
      const max = Math.max.apply(null, s.files.map((f) => f.lines)) || 1;
      const table = el("div", "ft");
      s.files.forEach((f, i) => {
        const row = el("div", "ft-row");
        const name = el("button", "name", f.path); name.type = "button";
        name.style.cssText = "all:unset;cursor:pointer;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap";
        name.addEventListener("click", () => select(m.key, { tab: "source", file: i }));
        row.append(name, el("span", "", LANGS[f.lang].n), el("span", "", f.missing ? "—" : f.lines.toLocaleString() + " ln"), el("span", "", f.missing ? "—" : fmtBytes(f.bytes)));
        const meter = el("div", "meter"); const i2 = el("i"); i2.style.width = (f.lines / max) * 100 + "%"; i2.style.background = LANGS[f.lang].c; meter.append(i2);
        row.append(meter);
        table.append(row);
      });
      ft.append(table);
      const tot = el("p", "", "");
      tot.style.cssText = "margin-top:10px;font:700 0.72rem var(--mono);letter-spacing:.1em;color:var(--muted)";
      tot.textContent = "TOTAL  " + s.lines.toLocaleString() + " LINES  ·  " + fmtBytes(s.bytes);
      ft.append(tot);
    }

    const gh = card("Git activity", true);
    const list = el("div", "commits"); list.append(el("p", "", "Loading recent commits…"));
    gh.append(list);
    const actions = el("div", "row-actions");
    const repoUrl = "https://github.com/" + REPO + "/tree/" + BRANCH + "/" + encodeURIComponent(m.folder);
    const a1 = el("a", "small-btn", "View on GitHub ↗"); a1.href = repoUrl; a1.target = "_blank"; a1.rel = "noopener noreferrer"; a1.style.textDecoration = "none";
    const a2 = el("button", "small-btn ghost", "Read the code"); a2.type = "button"; a2.addEventListener("click", () => select(m.key, { tab: "source", file: 0 }));
    const a3 = el("button", "small-btn ghost", "Copy link"); a3.type = "button"; a3.addEventListener("click", shareLink);
    actions.append(a1, a2, a3);
    gh.append(actions);

    g.append(hi, fe, le, run, ft, gh);
    p.append(g);

    const i = MODULES.findIndex((x) => x.key === m.key);
    const nav = el("div", "nav-pn");
    const prev = MODULES[(i + MODULES.length - 1) % MODULES.length], next = MODULES[(i + 1) % MODULES.length];
    const bp = el("button", "icon-btn", "← " + prev.title); bp.type = "button"; bp.addEventListener("click", () => select(prev.key, { tab: "details" }));
    const bn = el("button", "icon-btn", next.title + " →"); bn.type = "button"; bn.addEventListener("click", () => select(next.key, { tab: "details" }));
    nav.append(bp, bn);
    p.append(nav);

    loadCommits(m, list);
  }

  async function loadCommits(m, box) {
    const key = "labCommits:" + m.folder;
    let data = null;
    try { const c = JSON.parse(sessionStorage.getItem(key) || "null"); if (c && Date.now() - c.t < 600000) data = c.d; } catch (e) {}
    if (!data) {
      try {
        const res = await fetch("https://api.github.com/repos/" + REPO + "/commits?path=" + encodeURIComponent(m.folder) + "&per_page=5", { headers: { Accept: "application/vnd.github+json" } });
        if (!res.ok) throw new Error("bad status");
        data = await res.json();
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch (e) {}
      } catch (e) { data = null; }
    }
    if (!box.isConnected) return;
    box.textContent = "";
    if (!Array.isArray(data) || !data.length) {
      box.append(el("p", "", data ? "No commits found for this folder." : "Commit history is unavailable right now (offline or rate-limited)."));
      box.lastChild.style.color = "var(--muted)";
      return;
    }
    data.forEach((c) => {
      const row = el("div", "commit");
      row.append(el("b", "", (c.commit && c.commit.message ? c.commit.message.split("\n")[0] : "commit").slice(0, 120)));
      const meta = el("small", "");
      const link = el("a", "", (c.sha || "").slice(0, 7)); link.href = c.html_url; link.target = "_blank"; link.rel = "noopener noreferrer";
      meta.append(link, "  ·  " + ago(c.commit.author.date));
      row.append(meta);
      box.append(row);
    });
  }

  /* ==========================================================
     SHARE, PALETTE, SHORTCUTS, KEYBOARD
     ========================================================== */
  function shareLink() { copy(location.href, "Link to this view copied"); }

  const palette = $("#palette"), keysDlg = $("#keysDlg");
  function openDlg(d) { try { d.showModal(); } catch (e) { d.setAttribute("open", ""); } }
  function closeDlg(d) { try { d.close(); } catch (e) { d.removeAttribute("open"); } }
  [palette, keysDlg].forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) closeDlg(d); }));

  function paletteItems() {
    const items = [];
    MODULES.forEach((m) => items.push({ label: "Open " + m.title, hint: "module " + m.n, run: () => select(m.key) }));
    MODULES.forEach((m) => items.push({ label: m.title + ": source code", hint: "source", run: () => select(m.key, { tab: "source", file: 0 }) }));
    MODULES.forEach((m) => items.push({ label: m.title + ": architecture", hint: "architecture", run: () => select(m.key, { tab: "arch" }) }));
    MODULES.forEach((m) => items.push({ label: m.title + ": details", hint: "details", run: () => select(m.key, { tab: "details" }) }));
    [["Preview", "preview"], ["Source", "source"], ["Architecture", "arch"], ["Details", "details"]].forEach(([n, t]) => items.push({ label: "Go to " + n + " tab", hint: "tab", run: () => setTab(t) }));
    Object.keys(DEVICES).forEach((d) => items.push({ label: "Preview on " + DEVICES[d].toLowerCase(), hint: "device", run: () => { setTab("preview"); setDevice(d); } }));
    items.push({ label: "Fullscreen preview", hint: "action", run: toggleFullscreen });
    items.push({ label: "Copy link to this view", hint: "action", run: shareLink });
    items.push({ label: "Surprise me with a random project", hint: "action", run: () => select(MODULES[Math.floor(Math.random() * MODULES.length)].key) });
    items.push({ label: "Back to the Projects page", hint: "go", run: () => (location.href = "projects.html") });
    items.push({ label: "Back to the home page", hint: "go", run: () => (location.href = "index.html") });
    return items;
  }
  function fuzzy(q, s) {
    s = s.toLowerCase();
    const at = s.indexOf(q);
    if (at !== -1) return 100 - at;
    let i = 0, gaps = 0;
    for (const ch of s) { if (ch === q[i]) i++; else if (i > 0 && i < q.length) gaps++; if (i === q.length) break; }
    return i === q.length ? 50 - gaps : -1;
  }
  let palState = { items: [], shown: [], sel: 0 };
  function drawPalette() {
    const q = $("#palInput").value.trim().toLowerCase();
    const list = $("#palList");
    list.textContent = "";
    palState.shown = palState.items
      .map((it) => ({ it, s: q ? fuzzy(q, it.label + " " + it.hint) + (/^module/.test(it.hint) ? 8 : 0) : 0 }))
      .filter((x) => x.s >= 0).sort((a, b) => b.s - a.s).slice(0, 9).map((x) => x.it);
    palState.sel = 0;
    palState.shown.forEach((it, i) => {
      const li = el("li"); li.setAttribute("role", "presentation");
      const b = el("button", "pal-item"); b.type = "button"; b.setAttribute("role", "option"); b.setAttribute("aria-selected", String(i === 0));
      b.append(el("span", "", it.label), el("small", "", it.hint));
      b.addEventListener("click", () => runPalette(i));
      b.addEventListener("mousemove", () => selPalette(i));
      li.append(b); list.append(li);
    });
    if (!palState.shown.length) list.append(Object.assign(el("li"), { textContent: "No matches", style: "padding:10px 12px;color:var(--muted)" }));
  }
  function selPalette(i) {
    palState.sel = i;
    $$("#palList .pal-item").forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
  }
  function runPalette(i) { const it = palState.shown[i]; closeDlg(palette); if (it) it.run(); }
  function openPalette() { palState.items = paletteItems(); $("#palInput").value = ""; drawPalette(); openDlg(palette); setTimeout(() => $("#palInput").focus(), 30); }
  $("#palInput").addEventListener("input", drawPalette);
  $("#palInput").addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); selPalette(Math.min(palState.shown.length - 1, palState.sel + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); selPalette(Math.max(0, palState.sel - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); runPalette(palState.sel); }
  });

  document.addEventListener("keydown", (e) => {
    const t = e.target;
    const typing = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openPalette(); return; }
    if (typing || e.ctrlKey || e.metaKey || e.altKey || palette.open || keysDlg.open) return;
    const k = e.key.toLowerCase();
    if (/^[1-7]$/.test(k)) { select(MODULES[Number(k) - 1].key); }
    else if (k === "]") move(1);
    else if (k === "[") move(-1);
    else if (k === "p") setTab("preview");
    else if (k === "s") setTab("source");
    else if (k === "a") setTab("arch");
    else if (k === "d") setTab("details");
    else if (k === "f") toggleFullscreen();
    else if (k === "8" || k === "9" || k === "0") { setTab("preview"); setDevice({ 8: "desktop", 9: "tablet", 0: "mobile" }[k]); }
    else if (k === "/") { e.preventDefault(); $("#modFilter").focus(); }
    else if (e.key === "?") openDlg(keysDlg);
  });

  /* ==========================================================
     START
     ========================================================== */
  function init() {
    buildDirectory();

    TABS.forEach((t, i) => {
      const b = $("#tab-" + t);
      b.addEventListener("click", () => setTab(t));
      b.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
        setTab(n); $("#tab-" + n).focus();
      });
    });
    $("#btnPrev").addEventListener("click", () => move(-1));
    $("#btnNext").addEventListener("click", () => move(1));
    $("#btnShare").addEventListener("click", shareLink);
    $("#openPalette").addEventListener("click", openPalette);
    $("#openKeys").addEventListener("click", () => openDlg(keysDlg));
    $("#ctaRandom").addEventListener("click", () => { select(MODULES[Math.floor(Math.random() * MODULES.length)].key); $("#lab").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });

    const tick = () => { const d = new Date(); $("#clock").textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()); };
    tick(); setInterval(tick, 1000);

    if (!reduce) {
      let raf = 0;
      window.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => { raf = 0; document.documentElement.style.setProperty("--mx", e.clientX + "px"); document.documentElement.style.setProperty("--my", e.clientY + "px"); });
      }, { passive: true });
    }

    const q = new URLSearchParams(location.search);
    const key = MODULES.some((m) => m.key === q.get("app")) ? q.get("app") : MODULES[0].key;
    const tab = TABS.indexOf(q.get("tab")) !== -1 ? q.get("tab") : "preview";
    const file = Math.max(0, parseInt(q.get("file") || "0", 10) || 0);
    select(key, { tab: tab, file: file });
    if (q.get("app") && tab === "preview") { /* keep the page at the top so the hero still shows */ }

    setIndexProgress(0);
    bootSequence().then(() => indexAll()).then(showMetrics);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
