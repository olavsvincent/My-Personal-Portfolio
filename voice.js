/* ==========================================================
   VOICE SHORTCUTS
   Say (or type) things like "open projects", "dark mode",
   "show the leaderboard", "switch to Filipino", "scroll down".
   - Uses the browser's built-in speech recognition. No API key.
   - Works in English and Filipino.
   - Falls back to a text box where speech is not supported.
   Shortcut: Alt + V
   ========================================================== */
(function () {
  "use strict";

  const Store = window.SiteStore;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* ---------- what can be asked for ---------- */
  const PAGES = [
    { id: "home", url: "index.html", en: ["home", "homepage", "home page", "main page", "start page", "front page", "the beginning"], fil: ["tahanan", "simula", "pangunahing pahina"], label: { en: "Home", fil: "Tahanan" } },
    { id: "about", url: "about.html", en: ["about", "about me", "about you", "about page", "who are you", "who is vincent", "who is shane", "your story", "biography"], fil: ["tungkol", "tungkol sa akin", "sino ka", "kwento mo"], label: { en: "About", fil: "Tungkol sa Akin" } },
    { id: "skills", url: "skills.html", en: ["skills", "skill", "skills page", "abilities", "technologies", "tech stack", "expertise"], fil: ["kasanayan", "mga kasanayan", "kakayahan"], label: { en: "Skills", fil: "Mga Kasanayan" } },
    { id: "projects", url: "projects.html", en: ["projects", "project", "projects page", "portfolio", "your work", "your projects", "apps", "creations"], fil: ["proyekto", "mga proyekto", "mga gawa", "gawa mo"], label: { en: "Projects", fil: "Mga Proyekto" } },
    { id: "blog", url: "blog.html", en: ["blog", "blog page", "journey", "learning journey", "posts", "articles", "notes", "writing"], fil: ["blog", "paglalakbay", "mga sulat"], label: { en: "Blog", fil: "Blog" } },
    { id: "contact", url: "contact.html", en: ["contact", "contact page", "contact me", "email", "email me", "message", "message you", "get in touch", "reach you", "hire you"], fil: ["kontak", "makipag ugnayan", "mensahe", "padalhan ka"], label: { en: "Contact", fil: "Kontak" } },
    { id: "ide", url: "editor.html", en: ["ide", "editor", "code editor", "online editor", "playground", "coding playground", "write code", "compiler"], fil: ["editor", "code editor"], label: { en: "Code editor", fil: "Code editor" } },
    { id: "resume", url: "resume.html", en: ["resume", "my resume", "your resume", "resume page", "cv", "curriculum vitae"], fil: ["resume", "bio data"], label: { en: "Résumé", fil: "Résumé" } },
  ];

  const SECTIONS = [
    { id: "games", url: "index.html", scroll: "game-picker", en: ["games", "game", "play a game", "play games", "arcade", "take a break", "mini games"], fil: ["laro", "mga laro", "maglaro"], label: { en: "Games", fil: "Mga Laro" } },
    { id: "quiz", url: "index.html", scroll: "programming-quiz", en: ["quiz", "programming quiz", "take the quiz", "start the quiz", "test my knowledge", "trivia"], fil: ["kuwis", "pagsusulit", "quiz"], label: { en: "Programming Quiz", fil: "Programming Kuwis" } },
    { id: "memory", url: "index.html", scroll: "memory-game", click: "play memory game", en: ["memory game", "memory challenge", "memory", "play memory", "match the cards"], fil: ["memory game", "laro ng memorya"], label: { en: "Memory Challenge", fil: "Hamon sa Memorya" } },
    { id: "number", url: "index.html", scroll: "number-game", click: "play number game", en: ["number game", "number guessing", "guessing game", "guess the number", "play number game"], fil: ["hulaan ang numero", "number game"], label: { en: "Number Guessing", fil: "Hulaan ang Numero" } },
    { id: "leaderboard", url: "index.html", scroll: "leaderboard", en: ["leaderboard", "high scores", "scores", "ranking", "rankings", "top players", "hall of fame"], fil: ["talaan", "iskor", "leaderboard"], label: { en: "Leaderboard", fil: "Leaderboard" } },
    { id: "github", url: "index.html", scroll: "github-feed", en: ["github", "git hub", "github activity", "repositories", "repos", "commits", "recent commits"], fil: ["github", "aktibidad sa github"], label: { en: "GitHub activity", fil: "Aktibidad sa GitHub" } },
    { id: "terminal", url: "index.html", scroll: "terminal-section", en: ["terminal", "command line", "console"], fil: ["terminal"], label: { en: "Terminal", fil: "Terminal" } },
    { id: "dashboard", url: "index.html", scroll: "developer-dashboard", en: ["dashboard", "control center", "developer dashboard"], fil: ["dashboard"], label: { en: "Developer dashboard", fil: "Dashboard ng developer" } },
    { id: "guestbook", url: "contact.html", scroll: "guestbook", en: ["guestbook", "guest book", "sign the guestbook", "sign guestbook", "leave a message", "leave a note"], fil: ["guestbook", "lagdaan ang guestbook"], label: { en: "Guestbook", fil: "Guestbook" } },
    { id: "challenges", url: "editor.html", scroll: "challenges", en: ["challenges", "coding challenges", "practice problems", "practice", "exercises", "coding exercises"], fil: ["hamon sa pag code", "pagsasanay"], label: { en: "Coding challenges", fil: "Mga hamon sa pag-code" } },
    { id: "radar", url: "skills.html", scroll: "skills-radar", en: ["skills overview", "radar", "radar chart", "skill chart", "skills chart"], fil: ["buod ng kasanayan"], label: { en: "Skills overview", fil: "Buod ng kasanayan" } },
  ];

  const PROJECTS = [
    { slug: "student-management-system", name: "Student Management System", en: ["student management", "student management system", "student system", "students app"] },
    { slug: "workout-planner", name: "Workout Planner", en: ["workout planner", "workout", "fitness planner", "workout app"] },
    { slug: "health-monitoring-system", name: "Health Monitoring System", en: ["health monitoring", "health monitoring system", "health system", "heart rate project"] },
    { slug: "grade-calculator", name: "Grade Calculator", en: ["grade calculator", "grades calculator", "grading"] },
    { slug: "scientific-calculator", name: "Scientific Calculator", en: ["scientific calculator", "calculator", "scientific"] },
    { slug: "book-management-system", name: "Book Management System", en: ["book management", "book management system", "book system", "library system", "books app"] },
    { slug: "sysvision", name: "SysVision", en: ["sysvision", "sys vision", "sis vision", "system vision", "system monitor", "cis vision"] },
  ];

  const ACTIONS = [
    { id: "dark", en: ["dark mode", "dark theme", "night mode", "go dark", "turn on dark mode", "enable dark mode"], fil: ["madilim", "dark mode"] },
    { id: "light", en: ["light mode", "light theme", "day mode", "bright mode", "go light", "turn on light mode"], fil: ["maliwanag", "light mode"] },
    { id: "theme", en: ["toggle theme", "change theme", "switch theme", "toggle dark mode", "swap theme"], fil: ["palitan ang theme"] },
    { id: "customize", en: ["customize theme", "customise theme", "change colors", "change colours", "theme settings", "color picker", "palette", "customize"], fil: ["palitan ang kulay", "kulay"] },
    { id: "filipino", en: ["filipino", "tagalog", "speak filipino", "filipino language", "in filipino"], fil: ["wikang filipino", "sa filipino", "gawing filipino"] },
    { id: "english", en: ["english", "speak english", "english language", "in english"], fil: ["wikang ingles", "sa ingles", "english"] },
    { id: "down", en: ["scroll down", "down", "page down", "go down", "next section"], fil: ["pababa", "ibaba"] },
    { id: "up", en: ["scroll up", "up", "page up", "go up"], fil: ["pataas", "itaas"] },
    { id: "top", en: ["top", "scroll to top", "back to top", "to the top", "go to the top"], fil: ["sa itaas", "pinakataas"] },
    { id: "bottom", en: ["bottom", "scroll to bottom", "to the bottom", "go to the bottom", "footer"], fil: ["sa ibaba", "pinakababa"] },
    { id: "back", en: ["back", "go back", "previous page", "previous"], fil: ["bumalik", "balik"] },
    { id: "refresh", en: ["refresh", "reload", "refresh page", "reload page"], fil: ["i refresh", "ulitin ang pahina"] },
    { id: "chat", en: ["chat", "chatbot", "chat bot", "assistant", "ask a question", "talk to the assistant", "open chat"], fil: ["chatbot", "magtanong", "katulong"] },
    { id: "search", en: ["search", "quick search", "find", "search the site", "search site"], fil: ["maghanap", "hanapin"] },
    { id: "music", en: ["play music", "pause music", "music", "stop music", "music player", "play song", "pause song"], fil: ["tugtugin ang musika", "musika", "patugtugin"] },
    { id: "resumeDownload", en: ["download resume", "download my resume", "download your resume", "download cv", "get resume", "get your resume"], fil: ["i download ang resume"] },
    { id: "achievements", en: ["achievements", "badges", "trophies", "my achievements"], fil: ["mga tagumpay", "tagumpay"] },
    { id: "help", en: ["help", "what can i say", "commands", "voice commands", "what can you do", "show commands", "list commands"], fil: ["tulong", "ano ang masasabi ko", "mga utos"] },
  ];

  /* ---------- text matching ---------- */
  const FILLER = /^(?:hey|hi|hello|ok|okay|please|can you|could you|would you|will you|i want to|i wanna|i would like to|i'd like to|let's|lets|take me to|bring me to|go to|go|open|show me|show|display|navigate to|jump to|switch to|turn on|look at|check|see|the|my|pumunta sa|punta sa|buksan ang|buksan|ipakita ang|ipakita|dalhin mo ako sa)\s+/;
  const TAIL = /\s+(?:please|po|now|for me)$/;

  function normalize(text) {
    let t = String(text || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s'-]/g, " ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    let prev;
    do { prev = t; t = t.replace(FILLER, ""); } while (t !== prev);
    return t.replace(TAIL, "").trim();
  }

  function lev(a, b) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > 2) return 3;
    const m = [];
    for (let i = 0; i <= a.length; i++) { m[i] = [i]; }
    for (let j = 1; j <= b.length; j++) m[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  }

  function phraseScore(text, phrase) {
    const p = normalize(phrase) || phrase;
    if (text === p) return 1.3;
    if ((" " + text + " ").indexOf(" " + p + " ") !== -1) return 1 + Math.min(p.length, 30) / 100;
    const pt = p.split(" "), tt = text.split(" ");
    let hit = 0;
    pt.forEach((w) => {
      if (tt.some((t) => t === w || (w.length >= 5 && lev(t, w) <= 1) || (w.length >= 9 && lev(t, w) <= 2))) hit++;
    });
    if (hit === pt.length) return 0.86 + Math.min(p.length, 30) / 400;
    return (hit / pt.length) * 0.5;
  }

  function best(text, list, kind) {
    let top = null;
    list.forEach((item) => {
      const phrases = (item.en || []).concat(item.fil || []);
      phrases.forEach((ph) => {
        const s = phraseScore(text, ph);
        if (!top || s > top.score) top = { score: s, item: item, kind: kind, phrase: ph };
      });
    });
    return top;
  }

  function parse(raw) {
    const text = normalize(raw);
    if (!text) return null;
    const cands = [best(text, ACTIONS, "action"), best(text, PROJECTS, "project"), best(text, SECTIONS, "section"), best(text, PAGES, "page")]
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || b.phrase.length - a.phrase.length);
    const winner = cands[0];
    if (!winner || winner.score < 0.85) return { none: true, text: text, hints: cands.filter((c) => c.score >= 0.3).slice(0, 3) };
    return winner;
  }

  /* ---------- UI text ---------- */
  const T = {
    en: {
      title: "Voice shortcuts", listening: "Listening… speak now", idle: "Tap the mic and say a command",
      tapMic: "Start listening", stop: "Stop listening", typePh: "Or type a command…", go: "Go",
      heard: "Heard:", notSure: "Sorry, I didn’t catch a command in “%s”.", didYouMean: "Did you mean:",
      noSpeech: "I didn’t hear anything. Tap the mic and try again.",
      blocked: "The microphone is blocked. Allow it in your browser’s address bar, or type a command instead.",
      unsupported: "Your browser can’t listen for voice here, but you can type a command below.",
      netErr: "Speech service isn’t reachable right now. You can type a command instead.",
      opening: "Opening %s", scrolling: "Scrolling", speak: "Speak replies", language: "Voice language",
      tryTitle: "Try saying", privacy: "Your browser’s speech service processes your voice. This site doesn’t record or store it.",
      close: "Close", dark: "Dark mode on", light: "Light mode on", themeSwap: "Theme switched", customize: "Opening theme settings",
      fil: "Switched to Filipino", eng: "Switched to English", back: "Going back", refresh: "Refreshing",
      chat: "Opening the chat", search: "Opening search", music: "Toggling the music", achievements: "Opening achievements",
      notHere: "That isn’t available on this page.", resume: "Downloading the résumé", helpSaid: "Here are some things you can say.",
    },
    fil: {
      title: "Mga voice shortcut", listening: "Nakikinig… magsalita na", idle: "I-tap ang mic at sabihin ang utos",
      tapMic: "Simulan ang pakikinig", stop: "Itigil ang pakikinig", typePh: "O mag-type ng utos…", go: "Sige",
      heard: "Narinig:", notSure: "Pasensya, wala akong naintindihang utos sa “%s”.", didYouMean: "Ito ba ang ibig mong sabihin:",
      noSpeech: "Wala akong narinig. I-tap ang mic at subukan muli.",
      blocked: "Naka-block ang mikropono. Payagan ito sa address bar ng browser, o mag-type na lang ng utos.",
      unsupported: "Hindi sinusuportahan ng browser mo ang pakikinig dito, pero puwede kang mag-type ng utos sa ibaba.",
      netErr: "Hindi maabot ang speech service ngayon. Puwede kang mag-type ng utos.",
      opening: "Binubuksan ang %s", scrolling: "Nag-i-scroll", speak: "Magsalita pabalik", language: "Wika ng boses",
      tryTitle: "Subukang sabihin", privacy: "Ang speech service ng browser mo ang nagpoproseso ng boses mo. Hindi ito nire-record o sine-save ng site na ito.",
      close: "Isara", dark: "Naka-on ang dark mode", light: "Naka-on ang light mode", themeSwap: "Napalitan ang theme", customize: "Binubuksan ang theme settings",
      fil: "Napalitan sa Filipino", eng: "Napalitan sa English", back: "Bumabalik", refresh: "Nire-refresh",
      chat: "Binubuksan ang chat", search: "Binubuksan ang paghahanap", music: "Pinapalitan ang musika", achievements: "Binubuksan ang mga tagumpay",
      notHere: "Hindi ito available sa pahinang ito.", resume: "Dina-download ang résumé", helpSaid: "Ito ang ilang puwede mong sabihin.",
    },
  };
  const EXAMPLES = {
    en: ["open projects", "show my skills", "go to the blog", "dark mode", "play memory game", "show the leaderboard", "open sysvision", "switch to Filipino", "scroll down", "download resume"],
    fil: ["buksan ang mga proyekto", "ipakita ang kasanayan", "dark mode", "laro", "talaan", "wikang English", "pababa"],
  };

  const curLang = () => (window.SiteI18n && window.SiteI18n.lang === "fil" ? "fil" : "en");
  let voiceLang = null; // chosen recognition language: "en" | "fil"
  const vl = () => voiceLang || curLang();
  const t = (k, a) => {
    const s = (T[curLang()] || T.en)[k] || T.en[k] || k;
    return a != null ? s.replace("%s", a) : s;
  };

  /* ---------- running a command ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clickByText(rx) {
    const re = new RegExp(rx, "i");
    const nodes = Array.from(document.querySelectorAll("button, a"));
    const b = nodes.find((n) => re.test(n.textContent.replace(/\s+/g, " ")) || re.test(n.getAttribute("aria-label") || ""));
    if (b) { b.click(); return true; }
    return false;
  }
  function scrollToId(id) {
    const e = document.getElementById(id);
    if (!e) return false;
    e.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    return true;
  }
  function runPending() {
    let p = null;
    try { p = JSON.parse(sessionStorage.getItem("vcPending") || "null"); sessionStorage.removeItem("vcPending"); } catch (e) {}
    if (!p) return;
    setTimeout(() => {
      if (p.clickText) clickByText(p.clickText);
      if (p.clickSel) { const n = $(p.clickSel); if (n) n.click(); }
      if (p.scroll) setTimeout(() => scrollToId(p.scroll), 250);
    }, 900);
  }
  function go(url, pending) {
    if (pending) { try { sessionStorage.setItem("vcPending", JSON.stringify(pending)); } catch (e) {} }
    location.href = url;
  }

  function execute(match) {
    const L = curLang();
    const { kind, item } = match;
    if (kind === "page") {
      if (item.url === page || (item.url === "index.html" && page === "")) { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); return t("opening", item.label[L]); }
      go(item.url); return t("opening", item.label[L]);
    }
    if (kind === "project") {
      const url = "projects.html#" + item.slug;
      if (page === "projects.html") { location.hash = item.slug; } else go(url);
      return t("opening", item.name);
    }
    if (kind === "section") {
      if (item.url === page) {
        if (item.click) clickByText(item.click);
        setTimeout(() => scrollToId(item.scroll), item.click ? 250 : 0);
      } else go(item.url, { scroll: item.scroll, clickText: item.click });
      return t("opening", item.label[L]);
    }
    // actions
    const dark = document.body.classList.contains("dark-mode");
    const toggle = document.getElementById("themeToggle");
    switch (item.id) {
      case "dark": if (!dark && toggle) toggle.click(); return t("dark");
      case "light": if (dark && toggle) toggle.click(); return t("light");
      case "theme": if (toggle) toggle.click(); return t("themeSwap");
      case "customize": { const b = $(".tc-trigger"); if (b) { b.click(); return t("customize"); } return t("notHere"); }
      case "filipino": if (window.SiteI18n) window.SiteI18n.set("fil"); return t("fil");
      case "english": if (window.SiteI18n) window.SiteI18n.set("en"); return t("eng");
      case "down": window.scrollBy({ top: Math.round(window.innerHeight * 0.8), behavior: reduce ? "auto" : "smooth" }); return t("scrolling");
      case "up": window.scrollBy({ top: -Math.round(window.innerHeight * 0.8), behavior: reduce ? "auto" : "smooth" }); return t("scrolling");
      case "top": window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); return t("scrolling");
      case "bottom": window.scrollTo({ top: document.documentElement.scrollHeight, behavior: reduce ? "auto" : "smooth" }); return t("scrolling");
      case "back": history.back(); return t("back");
      case "refresh": location.reload(); return t("refresh");
      case "chat": { const b = document.getElementById("chatbotLauncher") || $("[id*=hatbotLauncher]"); if (b) { b.click(); return t("chat"); } return t("notHere"); }
      case "search": { const b = $(".quick-search-trigger, #quickSearchTrigger"); if (b) { b.click(); return t("search"); } return t("notHere"); }
      case "music": { const b = $("#portfolioMusicPlayer button, #musicToggle, .music-toggle, #portfolioMusicPlayer"); if (b) { b.click(); return t("music"); } return t("notHere"); }
      case "achievements": { const b = $("#achievementWidget, .achievement-widget"); if (b) { b.click(); return t("achievements"); } go("index.html"); return t("achievements"); }
      case "resumeDownload":
        if (page === "resume.html") { const a = document.getElementById("resumePdf"); if (a) a.click(); } else go("resume.html", { clickSel: "#resumePdf" });
        return t("resume");
      case "help": showExamples(true); return t("helpSaid");
      default: return t("notHere");
    }
  }

  /* ---------- panel ---------- */
  let fab, panel, statusEl, heardEl, input, listBox, micBtn, speakChk, langSel, rec = null, listening = false, finalTimer = null;
  const speakPref = () => { try { return localStorage.getItem("vcSpeak") !== "0"; } catch (e) { return true; } };

  function say(text) {
    if (!("speechSynthesis" in window) || !speakChk || !speakChk.checked) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = curLang() === "fil" ? "fil-PH" : "en-US";
      u.rate = 1.02;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function setStatus(msg, tone) {
    statusEl.textContent = msg;
    statusEl.dataset.tone = tone || "";
  }
  function showExamples() {
    listBox.textContent = "";
    const set = EXAMPLES[curLang()].concat(curLang() === "fil" ? [] : []);
    set.forEach((ex) => {
      const b = el("button", "vc-chip", ex);
      b.type = "button";
      b.addEventListener("click", () => handle(ex, false));
      listBox.append(b);
    });
  }

  function handle(raw, spoken) {
    heardEl.textContent = raw ? t("heard") + " “" + raw + "”" : "";
    const m = parse(raw);
    if (!m) return;
    if (m.none) {
      const msg = t("notSure", raw);
      setStatus(msg, "warn");
      if (m.hints && m.hints.length) {
        listBox.textContent = "";
        listBox.append(el("span", "vc-hint", t("didYouMean")));
        m.hints.forEach((h) => {
          const label = h.item.label ? h.item.label[curLang()] : h.item.name || h.phrase;
          const b = el("button", "vc-chip", label);
          b.type = "button";
          b.addEventListener("click", () => handle(h.phrase, false));
          listBox.append(b);
        });
      } else showExamples();
      if (spoken) say(msg);
      return;
    }
    const reply = execute(m);
    setStatus("✓ " + reply, "ok");
    if (spoken) say(reply);
    if (Store) Store.unlock("voice_commander");
  }

  function stopRec() {
    clearTimeout(finalTimer);
    if (rec) { try { rec.abort(); } catch (e) {} }
    listening = false;
    fab.classList.remove("vc-live");
    micBtn.classList.remove("vc-live");
    micBtn.setAttribute("aria-label", t("tapMic"));
  }

  function startRec() {
    if (!SR) { setStatus(t("unsupported"), "warn"); input.focus(); return; }
    if (listening) { stopRec(); setStatus(t("idle")); return; }
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    rec = new SR();
    rec.lang = vl() === "fil" ? "fil-PH" : "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 3;
    let got = false;
    rec.onstart = () => {
      listening = true;
      fab.classList.add("vc-live");
      micBtn.classList.add("vc-live");
      micBtn.setAttribute("aria-label", t("stop"));
      setStatus(t("listening"), "live");
      heardEl.textContent = "";
    };
    rec.onresult = (e) => {
      let interim = "", final = "", alts = [];
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) { final += r[0].transcript; for (let k = 0; k < r.length; k++) alts.push(r[k].transcript); }
        else interim += r[0].transcript;
      }
      if (interim) heardEl.textContent = t("heard") + " “" + interim.trim() + "”";
      if (final) {
        got = true;
        // try the alternatives too: the first one that matches a command wins
        let use = final.trim();
        for (let k = 0; k < alts.length; k++) { const m = parse(alts[k]); if (m && !m.none) { use = alts[k].trim(); break; } }
        stopRec();
        handle(use, true);
      }
    };
    rec.onerror = (e) => {
      const code = e.error;
      if (code === "no-speech") setStatus(t("noSpeech"), "warn");
      else if (code === "not-allowed" || code === "service-not-allowed") setStatus(t("blocked"), "warn");
      else if (code === "network") setStatus(t("netErr"), "warn");
      else if (code !== "aborted") setStatus(t("netErr"), "warn");
      stopRec();
    };
    rec.onend = () => {
      if (listening && !got) { setStatus(t("noSpeech"), "warn"); }
      stopRec();
    };
    try { rec.start(); } catch (err) { stopRec(); setStatus(t("netErr"), "warn"); }
    finalTimer = setTimeout(() => { if (listening) { stopRec(); setStatus(t("noSpeech"), "warn"); } }, 9000);
  }

  function openPanel(autoListen) {
    panel.classList.add("vc-open");
    fab.setAttribute("aria-expanded", "true");
    if (!heardEl.textContent) setStatus(SR ? t("idle") : t("unsupported"));
    showExamples();
    if (autoListen && SR) startRec();
    else if (!SR) setTimeout(() => input.focus(), 260);
  }
  function closePanel() {
    stopRec();
    panel.classList.remove("vc-open");
    fab.setAttribute("aria-expanded", "false");
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
  }

  function relabel() {
    if (!panel) return;
    $(".vc-title", panel).textContent = t("title");
    input.placeholder = t("typePh");
    $(".vc-go", panel).textContent = t("go");
    $(".vc-speak-label", panel).textContent = t("speak");
    $(".vc-lang-label", panel).textContent = t("language");
    $(".vc-try", panel).textContent = t("tryTitle");
    $(".vc-privacy", panel).textContent = t("privacy");
    $(".vc-close", panel).setAttribute("aria-label", t("close"));
    micBtn.setAttribute("aria-label", listening ? t("stop") : t("tapMic"));
    fab.setAttribute("aria-label", t("title") + " (Alt+V)");
    fab.title = t("title") + " (Alt+V)";
    if (!listening && !statusEl.dataset.tone) setStatus(SR ? t("idle") : t("unsupported"));
    if (voiceLang === null) langSel.value = curLang();
    showExamples();
  }

  function build() {
    fab = el("button", "vc-fab");
    fab.type = "button";
    fab.setAttribute("data-no-i18n", "");
    fab.setAttribute("aria-haspopup", "dialog");
    fab.setAttribute("aria-expanded", "false");
    fab.innerHTML = '<span aria-hidden="true">🎤</span>';

    panel = el("div", "vc-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("data-no-i18n", "");

    const head = el("div", "vc-head");
    head.append(el("h2", "vc-title", t("title")));
    const close = el("button", "vc-close", "×"); close.type = "button";
    head.append(close);

    micBtn = el("button", "vc-mic");
    micBtn.type = "button";
    micBtn.innerHTML = '<span aria-hidden="true">🎤</span>';
    statusEl = el("p", "vc-status"); statusEl.setAttribute("role", "status"); statusEl.setAttribute("aria-live", "polite");
    heardEl = el("p", "vc-heard");
    const top = el("div", "vc-top"); const col = el("div", "vc-col"); col.append(statusEl, heardEl); top.append(micBtn, col);

    const form = el("form", "vc-form");
    input = el("input", "vc-input"); input.type = "text"; input.autocomplete = "off"; input.maxLength = 120;
    input.setAttribute("aria-label", "Type a command");
    const goBtn = el("button", "vc-go", t("go")); goBtn.type = "submit";
    form.append(input, goBtn);

    const opts = el("div", "vc-opts");
    const sw = el("label", "vc-opt");
    speakChk = el("input"); speakChk.type = "checkbox"; speakChk.checked = speakPref();
    sw.append(speakChk, el("span", "vc-speak-label", t("speak")));
    const lw = el("label", "vc-opt");
    langSel = el("select", "vc-select");
    [["en", "English"], ["fil", "Filipino"]].forEach(([v, n]) => { const o = el("option", "", n); o.value = v; langSel.append(o); });
    lw.append(el("span", "vc-lang-label", t("language")), langSel);
    opts.append(sw, lw);

    listBox = el("div", "vc-list");
    panel.append(head, top, form, opts, el("p", "vc-try", t("tryTitle")), listBox, el("p", "vc-privacy", t("privacy")));
    if (!SR) { micBtn.hidden = true; lw.hidden = true; }
    document.body.append(panel, fab);

    fab.addEventListener("click", () => (panel.classList.contains("vc-open") ? closePanel() : openPanel(true)));
    close.addEventListener("click", () => { closePanel(); fab.focus(); });
    micBtn.addEventListener("click", startRec);
    form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value.trim(); if (v) { handle(v, false); input.value = ""; } });
    speakChk.addEventListener("change", () => { try { localStorage.setItem("vcSpeak", speakChk.checked ? "1" : "0"); } catch (e) {} if (!speakChk.checked) { try { window.speechSynthesis.cancel(); } catch (e) {} } });
    langSel.addEventListener("change", () => { voiceLang = langSel.value; });
    document.addEventListener("keydown", (e) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === "v" || e.key === "V")) { e.preventDefault(); panel.classList.contains("vc-open") ? closePanel() : openPanel(true); }
      else if (e.key === "Escape" && panel.classList.contains("vc-open")) { closePanel(); fab.focus(); }
    });
    window.addEventListener("site:langchange", relabel);
    relabel();
  }

  window.SiteVoice = { parse: parse, normalize: normalize, run: (s) => handle(s, false), open: () => openPanel(false) };

  function init() { build(); runPending(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
