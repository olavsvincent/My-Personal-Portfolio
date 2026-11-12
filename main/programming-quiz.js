/* ==========================================================
   PROGRAMMING QUIZ — three difficulty levels
   Easy   : 10 core-basics questions, no timer
   Medium : 10 questions, 30 seconds each
   Hard   : 10 trickier questions, 20 seconds each
   Questions and answer positions are shuffled every time.
   Fires "quiz:started" / "quiz:finished" for the leaderboard.
   ========================================================== */
(() => {
  const panel = document.getElementById("quizPanel");
  if (!panel) return;

  const progress = document.getElementById("quizProgress");
  const scoreDisplay = document.getElementById("quizScore");
  const progressFill = document.getElementById("quizProgressFill");
  const questionDisplay = document.getElementById("quizQuestion");
  const optionsContainer = document.getElementById("quizOptions");
  const feedback = document.getElementById("quizFeedback");
  const nextButton = document.getElementById("quizNext");
  const resultPanel = document.getElementById("quizResult");
  const resultIcon = document.getElementById("quizResultIcon");
  const resultTitle = document.getElementById("quizResultTitle");
  const resultText = document.getElementById("quizResultText");
  const retryButton = document.getElementById("quizRetry");

  const LEVELS = {
    easy: { label: "Easy", icon: "🌱", seconds: 0, points: 10, blurb: "Core basics · no timer" },
    medium: { label: "Medium", icon: "⚡", seconds: 30, points: 20, blurb: "Real code questions · 30 s each" },
    hard: { label: "Hard", icon: "🔥", seconds: 20, points: 30, blurb: "Tricky concepts · 20 s each" },
  };

  /* answer is the index of the correct option in the list as written here */
  const BANK = {
    easy: [
      { question: "What is the main purpose of HTML?", options: ["To structure webpage content", "To style webpage colors", "To store database records", "To manage computer hardware"], answer: 0, explanation: "HTML defines the structure of a webpage, including headings, paragraphs, images, and links." },
      { question: "Which language is primarily used to style a webpage?", options: ["Python", "CSS", "SQL", "C++"], answer: 1, explanation: "CSS controls the visual appearance of a webpage, including colors, spacing, fonts, and layout." },
      { question: "What does JavaScript commonly add to a website?", options: ["Physical computer components", "Operating system drivers", "Interactive behavior", "Electrical power"], answer: 2, explanation: "JavaScript can respond to clicks, validate forms, update content, and create interactive features." },
      { question: "Which Python symbol is used to start a single-line comment?", options: ["//", "<!--", "/*", "#"], answer: 3, explanation: "Python uses # to begin a single-line comment." },
      { question: "What is a variable used for in programming?", options: ["To store and refer to a value", "To permanently repair errors", "To increase internet speed", "To create a physical circuit"], answer: 0, explanation: "A variable gives a name to a value that a program can use or update." },
      { question: "Which structure repeats code while a condition is true?", options: ["A comment", "A loop", "A string", "A constant"], answer: 1, explanation: "Loops repeat a block of code according to a condition or iteration rule." },
      { question: "What does an array commonly store?", options: ["Only one fixed character", "Only programming errors", "A collection of values", "Only webpage colors"], answer: 2, explanation: "An array stores multiple values in one collection, accessible through indexes." },
      { question: "What is the main purpose of debugging?", options: ["To change every variable name", "To remove all comments", "To make code longer", "To find and fix problems in code"], answer: 3, explanation: "Debugging helps identify, understand, and fix errors or unexpected behavior in a program." },
      { question: "Which HTML tag is used to create a link to another page?", options: ["<a>", "<img>", "<p>", "<div>"], answer: 0, explanation: "The <a> (anchor) tag creates a hyperlink, and its href attribute holds the destination." },
      { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Styling System", "Colorful Style Syntax"], answer: 1, explanation: "CSS stands for Cascading Style Sheets." },
    ],
    medium: [
      { question: "Which JavaScript keyword declares a variable that can be reassigned and is limited to its block?", options: ["var", "let", "const", "define"], answer: 1, explanation: "let is block-scoped and can be reassigned. const is block-scoped but cannot be reassigned, and var is function-scoped." },
      { question: "What does === check in JavaScript?", options: ["Only that the values look similar", "That the values are equal and have the same type", "That both values are numbers", "That the variables have the same name"], answer: 1, explanation: "=== is strict equality: both the value and the type must match, with no type conversion." },
      { question: "Which CSS declaration turns an element into a flexible layout container?", options: ["display: flex", "position: flex", "layout: flexible", "float: flex"], answer: 0, explanation: "display: flex enables Flexbox, which arranges child items in a row or column." },
      { question: "In Python, which data type is an ordered, changeable collection written with square brackets?", options: ["tuple", "dictionary", "list", "set"], answer: 2, explanation: "A list such as [1, 2, 3] is ordered and mutable. Tuples use parentheses and cannot be changed." },
      { question: "What does git commit do?", options: ["Uploads your code to GitHub", "Saves a snapshot of your staged changes in the repository history", "Downloads the latest changes", "Deletes your local branch"], answer: 1, explanation: "git commit records the staged changes as a new snapshot. Uploading to a remote is a separate step called git push." },
      { question: "Which HTML element is meant for the main navigation links of a page?", options: ["<menu-bar>", "<links>", "<nav>", "<header-links>"], answer: 2, explanation: "<nav> is the semantic element for major navigation blocks, which also helps screen readers." },
      { question: "What does console.log(typeof []) print in JavaScript?", options: ["array", "object", "list", "undefined"], answer: 1, explanation: "Arrays are objects in JavaScript, so typeof [] is \"object\". Use Array.isArray() to test for arrays." },
      { question: "Which HTTP status code means that the page was not found?", options: ["200", "301", "404", "500"], answer: 2, explanation: "404 means Not Found. 200 is OK, 301 is a permanent redirect, and 500 is a server error." },
      { question: "What is the result of 2 + \"2\" in JavaScript?", options: ["4", "\"22\"", "NaN", "It throws an error"], answer: 1, explanation: "When one operand is a string, + joins them together, so the number is converted and the result is the string \"22\"." },
      { question: "In SQL, which statement is used to read data from a table?", options: ["GET", "FETCH TABLE", "SELECT", "OPEN"], answer: 2, explanation: "SELECT retrieves rows from one or more tables, for example SELECT name FROM students;" },
    ],
    hard: [
      { question: "What does Array.prototype.map() return?", options: ["The original array, changed in place", "A new array with each element transformed", "A single combined value", "The first element that matches"], answer: 1, explanation: "map() builds and returns a new array from the results of calling a function on every element. It does not modify the original." },
      { question: "What is the time complexity of binary search on a sorted array?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"], answer: 2, explanation: "Binary search halves the remaining range on every step, which gives O(log n)." },
      { question: "What does a closure let a JavaScript function do?", options: ["Run faster than normal functions", "Hide its code from the browser", "Use variables from its outer scope even after the outer function has finished", "Call itself without recursion"], answer: 2, explanation: "A closure remembers the variables of the scope where it was created, so it can keep using them later." },
      { question: "What does console.log(0.1 + 0.2 === 0.3) print in JavaScript?", options: ["true", "false", "NaN", "undefined"], answer: 1, explanation: "Numbers use binary floating point, so 0.1 + 0.2 is 0.30000000000000004. Compare with a small tolerance instead." },
      { question: "Which technique best protects against SQL injection?", options: ["Hiding the database name", "Using parameterized (prepared) statements", "Making passwords longer", "Turning off the browser console"], answer: 1, explanation: "Parameterized queries keep user input separate from the SQL command, so input can never be executed as code." },
      { question: "What does git rebase mainly do?", options: ["Permanently deletes old commits from the server", "Merges two repositories into one", "Replays your commits on top of another base to create a linear history", "Creates a backup copy of the repository"], answer: 2, explanation: "Rebase moves or replays a branch's commits onto a new base commit, which makes the history linear. Avoid rebasing commits that others already use." },
      { question: "Which CSS selector has the highest specificity?", options: ["p", ".card", "div p", "#header"], answer: 3, explanation: "An ID selector outranks class selectors, which outrank element selectors. Inline styles and !important can override all of them." },
      { question: "In REST conventions, how does PUT usually differ from POST?", options: ["PUT replaces a resource at a known URL and is idempotent; POST usually creates a new resource", "PUT only reads data; POST only deletes data", "PUT is faster because it skips the server", "They are exactly the same"], answer: 0, explanation: "Repeating the same PUT gives the same result (idempotent), while repeating a POST can create several new resources." },
      { question: "What does print(type(3 / 2)) show in Python 3?", options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'number'>"], answer: 1, explanation: "In Python 3, / is true division and always returns a float, so 3 / 2 is 1.5. Use // for integer (floor) division." },
      { question: "What is the JavaScript event loop responsible for?", options: ["Compiling code before it runs", "Running queued callbacks and tasks once the call stack is empty", "Repeating every for loop twice", "Checking the code for syntax errors"], answer: 2, explanation: "The event loop takes finished tasks and callbacks from the queue and runs them when the call stack is free, which makes asynchronous code possible." },
    ],
  };

  const $ = (s, r) => (r || document).querySelector(s);
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  const fmt = (s) => Math.floor(s / 60) + ":" + String(Math.round(s % 60)).padStart(2, "0");
  function shuffle(array) {
    const r = [...array];
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }
  function readBest(level) {
    try { return JSON.parse(localStorage.getItem("quizBest:" + level) || "null"); } catch (e) { return null; }
  }
  function saveBest(level, run) {
    const old = readBest(level);
    if (!old || run.points > old.points || (run.points === old.points && run.seconds < old.seconds)) {
      try { localStorage.setItem("quizBest:" + level, JSON.stringify(run)); } catch (e) {}
    }
  }

  /* ---------- extra elements (created here so the HTML stays as it is) ---------- */
  const container = panel.parentNode;
  const picker = el("div", "quiz-levels");
  picker.id = "quizLevels";
  picker.setAttribute("role", "group");
  picker.setAttribute("aria-label", "Choose a difficulty");
  const frame = el("div", "hud-frame");
  container.insertBefore(frame, panel);
  frame.append(picker, panel, resultPanel);

  const topBar = $(".quiz-top", panel);
  const levelBadge = el("span", "quiz-level-badge");
  topBar.insertBefore(levelBadge, scoreDisplay);

  const timerBox = el("div", "quiz-timer");
  const timerText = el("span", "quiz-timer-text");
  const timerTrack = el("div", "quiz-timer-track");
  const timerFill = el("div", "quiz-timer-fill");
  timerTrack.append(timerFill);
  timerBox.append(el("span", "quiz-timer-icon", "T-"), timerTrack, timerText);
  const track = $(".quiz-progress-track", panel);
  track.parentNode.insertBefore(timerBox, track.nextSibling);

  const stats = el("div", "quiz-stats");
  const actions = el("div", "quiz-result-actions");
  const changeBtn = el("button", "btn btn-outline", "Change difficulty");
  changeBtn.type = "button";
  const nextLevelBtn = el("button", "btn btn-outline", "Try the next level →");
  nextLevelBtn.type = "button";
  resultText.parentNode.insertBefore(stats, resultText.nextSibling);
  retryButton.parentNode.insertBefore(actions, retryButton);
  actions.append(retryButton, nextLevelBtn, changeBtn);

  const quitBtn = el("button", "quiz-quit", "◂ Mission select");
  quitBtn.type = "button";
  topBar.parentNode.insertBefore(quitBtn, topBar);

  /* ---------- state ---------- */
  let level = "easy";
  let run = [];
  let currentQuestion = 0;
  let score = 0;
  let answered = false;
  let shownAt = 0;
  let totalMs = 0;
  let deadline = 0;
  let tick = null;

  const META = {
    easy: { code: "01", tag: "ROOKIE", timer: "OFF", xp: "×1" },
    medium: { code: "02", tag: "OPERATOR", timer: "30s", xp: "×2" },
    hard: { code: "03", tag: "ELITE", timer: "20s", xp: "×3" },
  };

  function buildPicker() {
    picker.textContent = "";
    const head = el("div", "hud-picker-head");
    head.append(el("span", "hud-picker-title", "// SELECT DIFFICULTY"), el("span", "hud-pill hud-pill-ok", "● READY"));
    picker.append(head);
    const grid = el("div", "quiz-level-grid");
    Object.keys(LEVELS).forEach((key) => {
      const L = LEVELS[key];
      const M = META[key];
      const best = readBest(key);
      const b = el("button", "quiz-level quiz-level-" + key);
      b.type = "button";
      b.dataset.level = key;
      b.setAttribute("aria-label", L.label + " difficulty. " + L.blurb + (best ? ". Best score " + best.percent + " percent." : ". Not played yet."));

      const top = el("span", "hud-level-top");
      top.append(el("span", "hud-level-code", "LVL " + M.code), el("span", "hud-level-icon", L.icon));

      const stats = el("span", "hud-level-stats");
      [["Questions", "10"], ["Timer", M.timer], ["XP", M.xp]].forEach(([k, v]) => {
        const row = el("span", "hud-stat-row");
        row.append(el("span", "hud-stat-k", k), el("span", "hud-stat-v", v));
        stats.append(row);
      });

      const bestBox = el("span", "hud-level-best");
      const segs = el("span", "hud-segs");
      for (let i = 0; i < 10; i++) segs.append(el("i", best && i < best.correct ? "on" : ""));
      bestBox.append(segs, el("span", "hud-best-text", best ? "BEST " + best.percent + "% · " + fmt(best.seconds) : "NO DATA YET"));

      b.append(top, el("strong", "quiz-level-name", L.label), el("span", "hud-level-tag", M.tag), el("span", "quiz-level-blurb", L.blurb), stats, bestBox, el("span", "quiz-level-go", "INITIALIZE ▸"));
      b.addEventListener("click", () => startQuiz(key));
      grid.append(b);
    });
    picker.append(grid);
  }

  function showPicker() {
    stopTimer();
    panel.hidden = true;
    resultPanel.hidden = true;
    picker.hidden = false;
    buildPicker();
  }

  function startQuiz(key) {
    level = key;
    const L = LEVELS[level];
    run = shuffle(BANK[level]).map((q) => {
      const opts = q.options.map((text, i) => ({ text, correct: i === q.answer }));
      return { question: q.question, explanation: q.explanation, options: shuffle(opts) };
    });
    currentQuestion = 0;
    score = 0;
    totalMs = 0;
    answered = false;

    picker.hidden = true;
    panel.hidden = false;
    resultPanel.hidden = true;
    levelBadge.textContent = L.icon + " " + L.label;
    levelBadge.className = "quiz-level-badge quiz-badge-" + level;
    timerBox.hidden = !L.seconds;
    window.dispatchEvent(new CustomEvent("quiz:started", { detail: { level } }));
    showQuestion();
  }

  function stopTimer() { clearInterval(tick); tick = null; }

  function startTimer() {
    stopTimer();
    const L = LEVELS[level];
    if (!L.seconds) return;
    deadline = Date.now() + L.seconds * 1000;
    timerBox.classList.remove("quiz-timer-low");
    const update = () => {
      const left = Math.max(0, deadline - Date.now());
      timerFill.style.width = (left / (L.seconds * 1000)) * 100 + "%";
      timerText.textContent = String(Math.ceil(left / 1000)).padStart(2, "0") + "s";
      timerBox.classList.toggle("quiz-timer-low", left <= 5000);
      if (left <= 0) { stopTimer(); chooseAnswer(-1); }
    };
    update();
    tick = setInterval(update, 100);
  }

  function showQuestion() {
    answered = false;
    const item = run[currentQuestion];
    progress.textContent = "Q " + String(currentQuestion + 1).padStart(2, "0") + " / " + String(run.length).padStart(2, "0");
    scoreDisplay.textContent = "SCORE " + String(score).padStart(2, "0");
    progressFill.style.width = (currentQuestion / run.length) * 100 + "%";
    questionDisplay.textContent = item.question;
    feedback.textContent = "";
    feedback.className = "quiz-feedback";
    optionsContainer.replaceChildren();
    nextButton.disabled = true;
    nextButton.textContent = currentQuestion === run.length - 1 ? "See Results" : "Next Question";

    item.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option.text;
      button.addEventListener("click", () => chooseAnswer(index));
      optionsContainer.appendChild(button);
    });
    shownAt = Date.now();
    startTimer();
  }

  function chooseAnswer(index) {
    if (answered) return;
    answered = true;
    stopTimer();
    totalMs += Date.now() - shownAt;

    const item = run[currentQuestion];
    const correctIndex = item.options.findIndex((o) => o.correct);
    optionsContainer.querySelectorAll(".quiz-option").forEach((button, i) => {
      button.disabled = true;
      if (i === correctIndex) button.classList.add("correct");
      else if (i === index) button.classList.add("incorrect");
    });

    if (index === correctIndex) {
      score++;
      feedback.textContent = "Correct! " + item.explanation;
      feedback.classList.add("quiz-feedback-correct");
    } else {
      const lead = index === -1 ? "Time's up! " : "Not quite. ";
      feedback.textContent = lead + "The correct answer is \"" + item.options[correctIndex].text + "\". " + item.explanation;
      feedback.classList.add("quiz-feedback-incorrect");
    }
    scoreDisplay.textContent = "SCORE " + String(score).padStart(2, "0");
    progressFill.style.width = ((currentQuestion + 1) / run.length) * 100 + "%";
    nextButton.disabled = false;
    nextButton.focus({ preventScroll: true });
  }

  function showResults() {
    stopTimer();
    panel.hidden = true;
    picker.hidden = true;
    resultPanel.hidden = false;

    const L = LEVELS[level];
    const total = run.length;
    const percentage = Math.round((score / total) * 100);
    const seconds = Math.round(totalMs / 1000);
    const points = score * L.points;

    resultIcon.textContent = percentage === 100 ? "🏆" : percentage >= 70 ? "🎉" : percentage >= 40 ? "💪" : "📚";
    resultTitle.textContent = percentage === 100 ? "Perfect Score!" : percentage >= 70 ? "Great Job!" : percentage >= 40 ? "Good Effort!" : "Keep Practicing!";
    resultText.textContent =
      "You scored " + score + " out of " + total + " (" + percentage + "%). " +
      (percentage >= 70 ? "You're making good progress. Keep learning and building projects!" : "Review the explanations and try again to improve your score.");

    stats.textContent = "";
    const rank = percentage === 100 ? "S" : percentage >= 90 ? "A" : percentage >= 75 ? "B" : percentage >= 50 ? "C" : "D";
    [[rank, "Rank", "quiz-stat-rank"], [L.icon + " " + L.label, "Difficulty"], [points + " pts", "Points"], [fmt(seconds), "Time"]].forEach(([v, k, cls]) => {
      const s = el("div", "quiz-stat" + (cls ? " " + cls : ""));
      s.append(el("strong", "", v), el("span", "", k));
      stats.append(s);
    });
    nextLevelBtn.hidden = !(percentage >= 70 && level !== "hard");
    retryButton.textContent = "Play " + L.label + " again";

    const summary = { level, correct: score, total, percent: percentage, seconds, points };
    saveBest(level, summary);
    window.dispatchEvent(new CustomEvent("quiz:finished", { detail: summary }));
  }

  nextButton.addEventListener("click", () => {
    if (!answered) return;
    if (currentQuestion === run.length - 1) showResults();
    else { currentQuestion++; showQuestion(); }
  });
  retryButton.addEventListener("click", () => startQuiz(level));
  changeBtn.addEventListener("click", showPicker);
  quitBtn.addEventListener("click", showPicker);
  nextLevelBtn.addEventListener("click", () => startQuiz(level === "easy" ? "medium" : "hard"));
  document.addEventListener("visibilitychange", () => {
    // pause the countdown while the tab is hidden so nobody is penalised for switching tabs
    if (!LEVELS[level].seconds || answered || panel.hidden) return;
    if (document.hidden) { window.__quizPausedAt = Date.now(); stopTimer(); }
    else if (window.__quizPausedAt) {
      const gap = Date.now() - window.__quizPausedAt;
      window.__quizPausedAt = 0;
      deadline += gap; shownAt += gap;
      const L = LEVELS[level];
      stopTimer();
      tick = setInterval(() => {
        const left = Math.max(0, deadline - Date.now());
        timerFill.style.width = (left / (L.seconds * 1000)) * 100 + "%";
        timerText.textContent = String(Math.ceil(left / 1000)).padStart(2, "0") + "s";
        timerBox.classList.toggle("quiz-timer-low", left <= 5000);
        if (left <= 0) { stopTimer(); chooseAnswer(-1); }
      }, 100);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (panel.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    const r = panel.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return; // only when the quiz is on screen
    const k = e.key.toLowerCase();
    const idx = "abcd".indexOf(k) !== -1 && k.length === 1 ? "abcd".indexOf(k) : "1234".indexOf(k) !== -1 && k.length === 1 ? "1234".indexOf(k) : -1;
    if (idx !== -1 && !answered) {
      const btns = optionsContainer.querySelectorAll(".quiz-option");
      if (btns[idx]) { e.preventDefault(); btns[idx].click(); }
    } else if (e.key === "Enter" && answered && t === document.body) {
      e.preventDefault();
      nextButton.click();
    }
  });

  showPicker();
})();
