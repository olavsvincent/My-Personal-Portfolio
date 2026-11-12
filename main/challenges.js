/* ==========================================================
   LIVE CODING CHALLENGES (IDE page)
   Visitors write a JavaScript function; it is tested inside a
   Web Worker (with a time limit) so it can never freeze the page.
   ========================================================== */
(function () {
  "use strict";

  const Store = window.SiteStore;
  const KEY_SOLVED = "siteChallengesSolved";
  const KEY_CODE = "siteChallengeCode:";

  const CHALLENGES = [
    { id: "sum", title: "Add them up", level: "easy", fn: "sum",
      desc: "Write <code>sum(numbers)</code> that returns the total of an array of numbers. An empty array returns <code>0</code>.",
      starter: "function sum(numbers) {\n  // your code here\n}\n",
      hint: "Try a for loop with a running total, or numbers.reduce((a, b) => a + b, 0).",
      tests: [[[[1, 2, 3]], 6], [[[]], 0], [[[-5, 5, 10]], 10], [[[2.5, 2.5]], 5]] },
    { id: "reverse", title: "Mirror, mirror", level: "easy", fn: "reverseString",
      desc: "Write <code>reverseString(text)</code> that returns the text backwards.",
      starter: "function reverseString(text) {\n  // your code here\n}\n",
      hint: "Strings can be split into an array, reversed, then joined: text.split('').reverse().join('').",
      tests: [[["hello"], "olleh"], [[""], ""], [["a"], "a"], [["Computer"], "retupmoC"]] },
    { id: "vowels", title: "Count the vowels", level: "easy", fn: "countVowels",
      desc: "Write <code>countVowels(text)</code> that counts the letters <code>a e i o u</code> (upper or lower case).",
      starter: "function countVowels(text) {\n  // your code here\n}\n",
      hint: "Loop through each character and check if 'aeiou' includes it (use toLowerCase()).",
      tests: [[["hello"], 2], [["xyz"], 0], [["AEIOU"], 5], [["Programming"], 3]] },
    { id: "max", title: "Find the biggest", level: "easy", fn: "maxOfArray",
      desc: "Write <code>maxOfArray(numbers)</code> that returns the largest number in a non-empty array.",
      starter: "function maxOfArray(numbers) {\n  // your code here\n}\n",
      hint: "Keep a variable for the biggest so far and update it as you loop.",
      tests: [[[[3, 9, 2]], 9], [[[-4, -1, -7]], -1], [[[5]], 5], [[[1, 100, 50, 99]], 100]] },
    { id: "factorial", title: "Factorial", level: "medium", fn: "factorial",
      desc: "Write <code>factorial(n)</code>: the product of all whole numbers from 1 to n. <code>factorial(0)</code> is <code>1</code>.",
      starter: "function factorial(n) {\n  // your code here\n}\n",
      hint: "Start with result = 1 and multiply by every number up to n.",
      tests: [[[0], 1], [[1], 1], [[5], 120], [[10], 3628800]] },
    { id: "palindrome", title: "Palindrome check", level: "medium", fn: "isPalindrome",
      desc: "Write <code>isPalindrome(text)</code> that returns <code>true</code> if the text reads the same both ways. Ignore case, spaces and punctuation.",
      starter: "function isPalindrome(text) {\n  // your code here\n}\n",
      hint: "Clean the text first: text.toLowerCase().replace(/[^a-z0-9]/g, ''). Then compare it with its reverse.",
      tests: [[["level"], true], [["Hello"], false], [["A man, a plan, a canal: Panama"], true], [[""], true]] },
    { id: "unique", title: "Remove duplicates", level: "medium", fn: "unique",
      desc: "Write <code>unique(items)</code> that returns a new array without duplicates, keeping the first occurrence order.",
      starter: "function unique(items) {\n  // your code here\n}\n",
      hint: "A Set stores each value once: [...new Set(items)].",
      tests: [[[[1, 2, 2, 3, 1]], [1, 2, 3]], [[[]], []], [[["a", "b", "a"]], ["a", "b"]], [[[5, 5, 5]], [5]]] },
    { id: "fizzbuzz", title: "FizzBuzz", level: "medium", fn: "fizzBuzz",
      desc: "Write <code>fizzBuzz(n)</code> that returns an array for 1 to n: <code>\"Fizz\"</code> for multiples of 3, <code>\"Buzz\"</code> for multiples of 5, <code>\"FizzBuzz\"</code> for both, otherwise the number itself.",
      starter: "function fizzBuzz(n) {\n  // your code here\n}\n",
      hint: "Check the 'both' case (divisible by 15) first. Use the % operator.",
      tests: [[[5], [1, 2, "Fizz", 4, "Buzz"]], [[15], [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"]], [[1], [1]]] },
    { id: "prime", title: "Prime or not?", level: "hard", fn: "isPrime",
      desc: "Write <code>isPrime(n)</code> that returns <code>true</code> when n is a prime number. Numbers below 2 are not prime.",
      starter: "function isPrime(n) {\n  // your code here\n}\n",
      hint: "Only test divisors from 2 up to the square root of n.",
      tests: [[[2], true], [[1], false], [[17], true], [[21], false], [[0], false], [[97], true]] },
    { id: "fib", title: "Fibonacci", level: "hard", fn: "fibonacci",
      desc: "Write <code>fibonacci(n)</code> that returns the nth Fibonacci number, where <code>fibonacci(0) = 0</code> and <code>fibonacci(1) = 1</code>.",
      starter: "function fibonacci(n) {\n  // your code here\n}\n",
      hint: "Keep two variables (previous and current) and update them in a loop — recursion gets very slow for big n.",
      tests: [[[0], 0], [[1], 1], [[10], 55], [[30], 832040]] },
  ];

  const WORKER_SRC = `
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const show = (v) => { try { const s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch (e) { return String(v); } };
    self.onmessage = (e) => {
      const { code, fn, tests } = e.data;
      let f;
      try { f = new Function(code + "\\n;return typeof " + fn + " === 'function' ? " + fn + " : undefined;")(); }
      catch (err) { self.postMessage({ error: String(err) }); return; }
      if (!f) { self.postMessage({ error: "Could not find a function named " + fn + "()." }); return; }
      const results = tests.map((t) => {
        try { const got = f.apply(null, JSON.parse(JSON.stringify(t[0]))); return { ok: same(got, t[1]), got: show(got) }; }
        catch (err) { return { ok: false, got: "Error: " + err.message }; }
      });
      self.postMessage({ results });
    };`;

  function runInWorker(code, fn, tests) {
    return new Promise((resolve) => {
      let worker;
      try {
        worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" })));
      } catch (e) {
        resolve({ error: "Your browser blocked the test runner." });
        return;
      }
      const timer = setTimeout(() => {
        worker.terminate();
        resolve({ error: "Timed out after 2 seconds — is there an infinite loop?" });
      }, 2000);
      worker.onmessage = (e) => { clearTimeout(timer); worker.terminate(); resolve(e.data); };
      worker.onerror = (e) => { clearTimeout(timer); worker.terminate(); resolve({ error: e.message || "Your code has an error." }); };
      worker.postMessage({ code: code, fn: fn, tests: tests });
    });
  }

  const $ = (s, r) => (r || document).querySelector(s);
  function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function loadSolved() { try { return JSON.parse(localStorage.getItem(KEY_SOLVED) || "[]"); } catch (e) { return []; } }
  function saveSolved(list) { try { localStorage.setItem(KEY_SOLVED, JSON.stringify(list)); } catch (e) {} }

  function init() {
    const anchor = $(".ide-note") || $("main");
    if (!anchor || !$(".ide-page")) return;

    let solved = loadSolved();
    let current = CHALLENGES[0];

    const section = el("section", "ch-section");
    section.id = "challenges";
    const panel = el("div", "ch-panel");

    const top = el("div", "ch-top");
    const title = el("h2", "ch-title");
    const meta = el("div", "ch-meta");
    const select = el("select", "ch-select");
    select.setAttribute("aria-label", "Choose a challenge");
    const badge = el("span", "ch-badge");
    meta.append(select, badge);
    top.append(title, meta);

    const desc = el("p", "ch-desc");
    const editor = el("textarea", "ch-editor");
    editor.spellcheck = false;
    editor.setAttribute("aria-label", "Challenge code editor");
    const actions = el("div", "ch-actions");
    const run = el("button", "ch-btn primary", "▶ Run tests");
    const hintBtn = el("button", "ch-btn", "💡 Show hint");
    const resetBtn = el("button", "ch-btn", "↺ Reset code");
    const nextBtn = el("button", "ch-btn", "Next challenge →");
    [run, hintBtn, resetBtn, nextBtn].forEach((b) => (b.type = "button"));
    actions.append(run, hintBtn, resetBtn, nextBtn);
    const hint = el("p", "ch-hint"); hint.hidden = true;
    const summary = el("p", "ch-summary"); summary.setAttribute("role", "status"); summary.setAttribute("aria-live", "polite");
    const results = el("ul", "ch-results ch-tests");
    const bar = el("div", "ch-progress"); const fill = el("span"); bar.append(fill);
    const barLabel = el("p", "ch-progress-label");
    const lbWrap = el("div", "ch-lb");

    panel.append(top, desc, editor, actions, hint, summary, results, bar, barLabel, lbWrap);
    const heading = el("div", "section-heading");
    heading.append(el("p", "eyebrow", "PRACTICE ZONE"));
    const h2 = el("h2"); h2.append("Coding ", el("span", "", "Challenges")); heading.append(h2);
    section.append(heading, panel);
    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    CHALLENGES.forEach((c, i) => {
      const o = el("option", "", (i + 1) + ". " + c.title + (solved.includes(c.id) ? " ✓" : ""));
      o.value = c.id; select.append(o);
    });

    function refreshOptions() {
      Array.from(select.options).forEach((o, i) => {
        o.textContent = (i + 1) + ". " + CHALLENGES[i].title + (solved.includes(CHALLENGES[i].id) ? " ✓" : "");
      });
    }
    function refreshProgress() {
      fill.style.width = (solved.length / CHALLENGES.length) * 100 + "%";
      barLabel.textContent = solved.length + " of " + CHALLENGES.length + " challenges solved";
    }

    function load(c) {
      current = c;
      select.value = c.id;
      title.textContent = c.title;
      badge.textContent = c.level.toUpperCase();
      badge.className = "ch-badge " + c.level;
      desc.innerHTML = c.desc; // trusted, authored above
      let draft = null;
      try { draft = localStorage.getItem(KEY_CODE + c.id); } catch (e) {}
      editor.value = draft || c.starter;
      hint.hidden = true; hint.textContent = "Hint: " + c.hint; hintBtn.textContent = "💡 Show hint";
      summary.textContent = ""; summary.className = "ch-summary"; results.textContent = "";
      const old = lbWrap.querySelector(".lb-save"); if (old) old.remove();
      if (window.SiteI18n) window.SiteI18n.apply(panel);
    }

    select.addEventListener("change", () => load(CHALLENGES.find((c) => c.id === select.value)));
    editor.addEventListener("input", () => { try { localStorage.setItem(KEY_CODE + current.id, editor.value); } catch (e) {} });
    editor.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const s = editor.selectionStart;
        editor.value = editor.value.slice(0, s) + "  " + editor.value.slice(editor.selectionEnd);
        editor.selectionStart = editor.selectionEnd = s + 2;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run.click(); }
    });
    hintBtn.addEventListener("click", () => { hint.hidden = !hint.hidden; hintBtn.textContent = hint.hidden ? "💡 Show hint" : "💡 Hide hint"; });
    resetBtn.addEventListener("click", () => {
      editor.value = current.starter;
      try { localStorage.removeItem(KEY_CODE + current.id); } catch (e) {}
      summary.textContent = ""; results.textContent = "";
    });
    nextBtn.addEventListener("click", () => {
      const i = CHALLENGES.findIndex((c) => c.id === current.id);
      load(CHALLENGES[(i + 1) % CHALLENGES.length]);
    });

    run.addEventListener("click", async () => {
      run.disabled = true; summary.className = "ch-summary"; summary.textContent = "Running…"; results.textContent = "";
      const out = await runInWorker(editor.value, current.fn, current.tests);
      run.disabled = false;
      if (out.error) { summary.textContent = "⚠️ " + out.error; summary.className = "ch-summary bad"; return; }
      let pass = 0;
      out.results.forEach((r, i) => {
        const t = current.tests[i];
        const li = el("li", r.ok ? "pass" : "fail");
        const args = t[0].map((a) => JSON.stringify(a)).join(", ");
        li.textContent = (r.ok ? "✓ " : "✗ ") + current.fn + "(" + args + ")  →  " + (r.ok ? r.got : "got " + r.got + ", expected " + JSON.stringify(t[1]));
        if (r.ok) pass++;
        results.append(li);
      });
      const all = pass === current.tests.length;
      summary.textContent = all ? "🎉 All " + pass + " tests passed!" : pass + " of " + current.tests.length + " tests passed — keep going!";
      summary.className = "ch-summary " + (all ? "ok" : "bad");
      if (all && !solved.includes(current.id)) {
        solved.push(current.id); saveSolved(solved); refreshOptions(); refreshProgress();
        if (Store) Store.unlock("challenge_solver");
        if (solved.length === CHALLENGES.length && Store) Store.unlock("challenge_master");
        if (window.SiteLeaderboard) window.SiteLeaderboard.promptSave(lbWrap, "challenges", { solved: solved.length });
      }
    });

    refreshProgress();
    load(current);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
