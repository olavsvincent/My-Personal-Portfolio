/* ==========================================================
   SITE SETTINGS — the only file you need to edit to switch
   on the optional online features. Everything works without
   them (using this browser's storage instead).
   ========================================================== */
window.SITE_CONFIG = {
  /* GitHub feed on the home page */
  githubUser: "olavsvincent",

  /* Repository that holds the project folders (used for the "GitHub" links on the Projects page) */
  githubRepo: "olavsvincent/My-Personal-Portfolio",
  githubBranch: "main",

  /* Contact form that really sends email.
     1. Create a free form at https://formspree.io
     2. Paste its URL here, e.g. "https://formspree.io/f/abcdwxyz"
     Leave empty to keep the "open Gmail" behaviour. */
  formEndpoint: "",

  /* Shared online storage for visitor counter, project likes, guestbook
     and leaderboard (Firebase Realtime Database, free tier).
     Paste the database URL, e.g. "https://my-site-default-rtdb.firebaseio.com"
     Leave empty to store everything only in the visitor's own browser. */
  firebaseDbUrl: "https://shanevincentportfolio-default-rtdb.asia-southeast1.firebasedatabase.app",

  /* Smarter chatbot. URL of your own AI proxy (see server/ai-proxy-worker.js).
     Never put an API key in this file. Leave empty to use the built-in answers. */
  aiEndpoint: "",

  /* Résumé files (see resume.html) */
  resumeHtml: "resume.html",
  resumePdf: "Shane-Vincent-Olavario-Resume.pdf",

  /* Typing animation phrases on the home page hero */
  typingPhrases: {
    en: [
      "Future Computer Engineer",
      "Web Developer in Progress",
      "Problem Solver",
      "Lifelong Learner",
    ],
    fil: [
      "Magiging Computer Engineer",
      "Web Developer na Nag-aaral",
      "Tagapaglutas ng Problema",
      "Palaging Nag-aaral",
    ],
  },
};
