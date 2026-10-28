
"use strict";

// =====================================
// DEFAULT CODE
// =====================================

const starterHTML = `<main class="demo-card">
  <div class="demo-badge">HELLO WORLD</div>
  <h1>Welcome to my <span>Code Playground</span></h1>
  <p>Edit the HTML, CSS, and JavaScript to build something of your own.</p>
  <button id="helloButton">Click me</button>
  <p id="message" aria-live="polite"></p>
</main>`;

const starterCSS = `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  font-family: Arial, sans-serif;
  color: #172033;
  background: linear-gradient(135deg, #eff6ff, #f5f3ff);
}

.demo-card {
  width: 100%;
  max-width: 560px;
  padding: 42px;
  text-align: center;
  background: white;
  border: 1px solid #dbeafe;
  border-radius: 24px;
  box-shadow: 0 20px 60px #1e40af1a;
}

.demo-badge {
  display: inline-block;
  padding: 7px 12px;
  color: #1d4ed8;
  background: #dbeafe;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  font-size: clamp(28px, 5vw, 42px);
  line-height: 1.15;
}

h1 span {
  color: #2563eb;
}

p {
  color: #64748b;
  line-height: 1.7;
}

button {
  margin-top: 12px;
  padding: 12px 22px;
  color: white;
  background: #2563eb;
  border: 0;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}`;

const starterJS = `document.getElementById("helloButton").addEventListener("click", () => {
  document.getElementById("message").textContent =
    "Nice! Your JavaScript is working.";
});`;

// =====================================
// GET ELEMENTS
// =====================================

const htmlArea = document.getElementById("htmlCode");
const cssArea = document.getElementById("cssCode");
const jsArea = document.getElementById("jsCode");

const preview = document.getElementById("previewFrame");

const runButton = document.getElementById("runCode");
const resetButton = document.getElementById("resetCode");
const downloadButton = document.getElementById("downloadCode");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");

// Stop early if this script is loaded on a page without the IDE.
if (!htmlArea || !cssArea || !jsArea || !preview) {
  console.error("IDE initialization failed: required HTML elements are missing.");
} else {

// =====================================
// INITIALIZE EDITORS
// =====================================

htmlArea.value = starterHTML;
cssArea.value = starterCSS;
jsArea.value = starterJS;

let htmlEditor = null;
let cssEditor = null;
let jsEditor = null;

if (window.CodeMirror) {
  htmlEditor = CodeMirror.fromTextArea(htmlArea, {
    mode: "htmlmixed",
    theme: "material-darker",
    lineNumbers: true,
    lineWrapping: true,
    tabSize: 2,
    indentUnit: 2,
    autoCloseTags: true
  });

  cssEditor = CodeMirror.fromTextArea(cssArea, {
    mode: "css",
    theme: "material-darker",
    lineNumbers: true,
    lineWrapping: true,
    tabSize: 2,
    indentUnit: 2
  });

  jsEditor = CodeMirror.fromTextArea(jsArea, {
    mode: "javascript",
    theme: "material-darker",
    lineNumbers: true,
    lineWrapping: true,
    tabSize: 2,
    indentUnit: 2
  });
} else {
  console.warn(
    "CodeMirror did not load. The IDE will use regular text areas."
  );
}

// =====================================
// EDITOR HELPERS
// =====================================

function getValue(editor, textarea) {
  return editor ? editor.getValue() : textarea.value;
}

function setValue(editor, textarea, value) {
  if (editor) {
    editor.setValue(value);
  } else {
    textarea.value = value;
  }
}

function refreshEditors() {
  [htmlEditor, cssEditor, jsEditor].forEach((editor) => {
    if (editor) editor.refresh();
  });
}

// =====================================
// LIGHT AND DARK MODE
// =====================================

function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);

  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀️" : "🌙";
  }

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeToggle.title = isDark ? "Light mode" : "Dark mode";
  }

  const editorTheme = isDark ? "material-darker" : "default";

  [htmlEditor, cssEditor, jsEditor].forEach((editor) => {
    if (editor) {
      editor.setOption("theme", editorTheme);
      editor.refresh();
    }
  });
}

function getSavedTheme() {
  try {
    return localStorage.getItem("portfolioTheme");
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("portfolioTheme", theme);
  } catch (error) {
    console.warn("The selected theme could not be saved.");
  }
}

const savedTheme = getSavedTheme();

const initialDarkMode =
  savedTheme !== null
    ? savedTheme === "dark"
    : document.body.classList.contains("dark-mode");

applyTheme(initialDarkMode);

if (themeToggle && !themeToggle.dataset.editorThemeBound) {
  themeToggle.dataset.editorThemeBound = "true";

  themeToggle.addEventListener("click", (event) => {
    // Prevent another theme handler on this button from toggling twice.
    event.stopImmediatePropagation();

    const isDark = !document.body.classList.contains("dark-mode");

    applyTheme(isDark);
    saveTheme(isDark ? "dark" : "light");
  }, true);
}

// =====================================
// CREATE PREVIEW DOCUMENT
// =====================================

function createDocument(html, css, js) {
  // Prevent user code from prematurely closing the style/script elements.
  const safeCSS = css.replace(/<\/style/gi, "<\\/style");
  const safeJS = js.replace(/<\/script/gi, "<\\/script");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Web Project</title>
  <style>
${safeCSS}
  </style>
</head>
<body>
${html}
<script>
  window.addEventListener("error", function(event) {
    const box = document.createElement("pre");
    box.style.cssText =
      "white-space:pre-wrap;color:#b91c1c;" +
      "background:#fee2e2;padding:12px;border-radius:8px;";
    box.textContent = "JavaScript error: " + event.message;
    document.body.appendChild(box);
  });

  try {
    ${safeJS}
  } catch (error) {
    const box = document.createElement("pre");
    box.style.cssText =
      "white-space:pre-wrap;color:#b91c1c;" +
      "background:#fee2e2;padding:12px;border-radius:8px;";
    box.textContent = "JavaScript error: " + error.message;
    document.body.appendChild(box);
  }
<\/script>
</body>
</html>`;
}

// =====================================
// RUN CODE
// =====================================

function runCode() {
  const html = getValue(htmlEditor, htmlArea);
  const css = getValue(cssEditor, cssArea);
  const js = getValue(jsEditor, jsArea);

  preview.srcdoc = createDocument(html, css, js);
}

if (runButton) {
  runButton.addEventListener("click", runCode);
}

// =====================================
// RESET CODE
// =====================================

function resetCode() {
  setValue(htmlEditor, htmlArea, starterHTML);
  setValue(cssEditor, cssArea, starterCSS);
  setValue(jsEditor, jsArea, starterJS);

  refreshEditors();
  runCode();
}

if (resetButton) {
  resetButton.addEventListener("click", resetCode);
}

// =====================================
// DOWNLOAD HTML
// =====================================

function downloadHTML() {
  const html = getValue(htmlEditor, htmlArea);
  const css = getValue(cssEditor, cssArea);
  const js = getValue(jsEditor, jsArea);

  const content = createDocument(html, css, js);
  const blob = new Blob([content], {
    type: "text/html;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "my-web-project.html";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

if (downloadButton) {
  downloadButton.addEventListener("click", downloadHTML);
}

// =====================================
// MOBILE NAVIGATION
// =====================================

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

// =====================================
// FOOTER YEAR
// =====================================

if (year) {
  year.textContent = new Date().getFullYear();
}

// =====================================
// INITIAL PREVIEW
// =====================================

runCode();

}
