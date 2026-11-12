/* ==========================================================
   BLOG POSTS — edit this list to write your own posts.
   Newest first. Each post:
     id      short-url-name (letters, numbers, dashes)
     title   headline
     date    YYYY-MM-DD
     tags    list of topics (they become filter buttons)
     excerpt one-sentence summary shown on the card
     body    list of blocks:  {p:"paragraph"}  {h:"heading"}  {ul:["item","item"]}
   Set SAMPLE_POSTS to false once you have replaced these.
   ========================================================== */
window.SAMPLE_POSTS = true;
window.BLOG_POSTS = [
  {
    id: "why-i-built-this-portfolio",
    title: "Why I built this portfolio",
    date: "2026-10-26",
    tags: ["Web", "Portfolio"],
    excerpt: "A first-year student's reasons for turning class lessons into a real website.",
    body: [
      { p: "I wanted a place where my projects, skills, and goals live together instead of being scattered across folders on my computer. Building a portfolio forced me to finish things and show them to other people." },
      { h: "What I practiced" },
      { ul: ["Structuring pages with semantic HTML", "Making layouts responsive with CSS", "Adding interactive features with JavaScript", "Publishing with Git and GitHub"] },
      { p: "Every feature started small and grew. The first version was just a hero section and a list of links, and each week I added something new." },
    ],
  },
  {
    id: "learning-javascript-one-feature-at-a-time",
    title: "Learning JavaScript one feature at a time",
    date: "2026-10-18",
    tags: ["JavaScript", "Learning"],
    excerpt: "How small, finishable features taught me more than tutorials alone.",
    body: [
      { p: "Tutorials were useful, but I only really understood JavaScript when I needed it to solve a real problem on my own site, such as a dark mode toggle, a project filter, or a quiz." },
      { h: "My approach" },
      { ul: ["Pick one small feature", "Break it into steps on paper", "Get a rough version working", "Clean it up and add comments"] },
      { p: "When something breaks, I read the error message slowly and use console.log to see what is really happening. It is slower at first, but it builds real understanding." },
    ],
  },
  {
    id: "my-student-management-system",
    title: "Building my Student Management System in Python",
    date: "2026-10-09",
    tags: ["Python", "Projects"],
    excerpt: "What I learned about classes, lists, and input validation from a command-line app.",
    body: [
      { p: "This project is a menu-driven Python program for adding and viewing student records. It looks simple, but it taught me how to organize code with classes and how to check user input so the program does not crash." },
      { h: "Things I learned" },
      { ul: ["Classes and objects for modeling a student", "Lists and dictionaries for storing records", "Checking for duplicate student IDs", "Keeping a menu loop readable"] },
      { p: "Next I want to save records to a file so they are still there the next time the program runs." },
    ],
  },
  {
    id: "roadmap-from-web-to-electronics",
    title: "My roadmap: from web basics to electronics",
    date: "2026-10-01",
    tags: ["Roadmap", "Hardware"],
    excerpt: "Where I am now, what I will study next, and why hardware excites me.",
    body: [
      { p: "Right now I am strengthening JavaScript, responsive design, and accessibility. Next I plan to learn C++ and object-oriented programming, then explore SQL and data structures." },
      { p: "The long-term goal is to connect software with hardware: microcontrollers, sensors, and projects like a health monitoring system that reads real data." },
      { h: "Why this order" },
      { p: "Strong programming fundamentals make everything else easier, including electronics, so I am building those first." },
    ],
  },
  {
    id: "staying-consistent-as-a-first-year",
    title: "Staying consistent as a first-year student",
    date: "2026-09-22",
    tags: ["Mindset", "Learning"],
    excerpt: "Small daily habits that keep me learning between classes and basketball.",
    body: [
      { p: "Consistency beats intensity. Thirty focused minutes a day on code, even on busy days, adds up faster than one long session every few weeks." },
      { ul: ["Write down one thing to build or fix each day", "Take breaks, a game of basketball clears my head", "Ask questions early instead of struggling alone", "Celebrate small wins"] },
    ],
  },
];
