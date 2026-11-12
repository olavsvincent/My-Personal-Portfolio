/* ==========================================================
   ENGLISH / FILIPINO language toggle
   - Adds a 🌐 button to the navbar.
   - Translates the main interface text; the choice is saved
     and used on every page.
   - To translate more text, add a line to STRINGS below.
     Keys ending in "…" match the start of a longer paragraph.
   ========================================================== */
(function () {
  "use strict";

  const KEY = "siteLang";

  /* Navigation links, matched by their href */
  const NAV = {
    "index.html": "Tahanan",
    "about.html": "Tungkol sa Akin",
    "skills.html": "Mga Kasanayan",
    "projects.html": "Mga Proyekto",
    "contact.html": "Kontak",
    "editor.html": "IDE",
    "blog.html": "Blog",
  };

  /* Headings made of several parts (one entry per text piece, in order) */
  const HEADINGS = {
    "About Me": ["Tungkol", "sa Akin"],
    "Message Me": ["Padalhan", "Ako"],
    "Get In Touch": ["Makipag-ugnayan", "sa Akin"],
    "My Technical Skills": ["Aking mga Teknikal na", "Kasanayan"],
    "Technologies I Use": ["Mga Teknolohiyang", "Ginagamit Ko"],
    "My Learning Roadmap": ["Aking Landas sa", "Pag-aaral"],
    "Learning One Step at a Time": ["Nag-aaral Nang Paisa-isang", "Hakbang"],
    "My Personal Values": ["Aking Personal na", "Pagpapahalaga"],
    "My Goals and Aspirations": ["Aking mga Layunin at", "Pangarap"],
    "Always Ready to Level Up!": ["Laging Handang", "Mag-Level Up!"],
    "Online Code Editor": ["Online na Code", "Editor"],
    "My Projects": ["Aking mga", "Proyekto"],
    "Memory Challenge": ["Hamon sa", "Memorya"],
    "Learning Journey": ["Aking Paglalakbay", "sa Pag-aaral"],
    "GitHub Activity": ["Aktibidad sa", "GitHub"],
    "Sign the Guestbook": ["Lagdaan ang", "Guestbook"],
    "Skills Overview": ["Pangkalahatang-tanaw ng", "mga Kasanayan"],
    "Coding Challenges": ["Mga Hamon sa", "Pag-code"],
    "Leaderboard": ["Talaan ng", "mga Nangunguna"],
  };

  const STRINGS = {
    /* common */
    "Search": "Maghanap",
    "Back to Home ↑": "Bumalik sa Simula ↑",
    "Shane Vincent Olavario. All rights reserved.": "Shane Vincent Olavario. Lahat ng karapatan ay nakalaan.",
    "Ask me": "Tanungin Ako",
    "Achievements": "Mga Tagumpay",
    "View My Projects": "Tingnan ang Aking mga Proyekto",
    "Contact Me": "Kontakin Ako",
    "Computer Engineering Student": "Estudyante ng Computer Engineering",
    "Reset": "I-reset",
    "Clear Filters": "I-clear ang mga Filter",

    /* home */
    "FIRST-YEAR COMPUTER ENGINEERING STUDENT": "UNANG TAON NA ESTUDYANTE NG COMPUTER ENGINEERING",
    "Hi, I'm": "Kumusta, ako si",
    "I am a Computer Engineering student who enjoys…": "Isa akong estudyante ng Computer Engineering na mahilig matuto tungkol sa teknolohiya, gumawa ng mga praktikal na proyekto, at pagbutihin ang aking mga kasanayan nang paunti-unti.",
    "DEVELOPER CONTROL CENTER": "SENTRO NG DEVELOPER",
    "Your space to learn, build, and create something extraordinary.": "Ang iyong espasyo para matuto, bumuo, at lumikha ng pambihira.",
    "SYSTEM ONLINE": "ONLINE ANG SISTEMA",
    "LOCAL TIME": "LOKAL NA ORAS",
    "Your local device time": "Oras ng iyong device",
    "SESSION UPTIME": "TAGAL NG SESYON",
    "Time spent on this page": "Oras na ginugol sa pahinang ito",
    "DEVELOPER PROFILE": "PROFILE NG DEVELOPER",
    "LEARNING": "NAG-AARAL",
    "BUILDING": "BUMUBUO",
    "IMPROVING": "UMUUNLAD",
    "CURRENT MISSION": "KASALUKUYANG MISYON",
    "Build. Test. Improve.": "Bumuo. Subukan. Pagbutihin.",
    "Explore programming, experiment with ideas, and turn what you learn into practical projects.": "Galugarin ang programming, subukan ang mga ideya, at gawing praktikal na proyekto ang iyong natutunan.",
    "Explore projects": "Tingnan ang mga proyekto",
    "INTERFACE READY": "HANDA NA ANG INTERFACE",
    "A LITTLE SOMETHING EXTRA": "KONTING EKSTRA",
    "Explore My": "Galugarin ang Aking",
    "Curious about me? Type a command below and explore my portfolio like a developer.": "Usisero ka ba? Mag-type ng command sa ibaba at galugarin ang aking portfolio na parang isang developer.",
    "TAKE A BREAK": "MAGPAHINGA MUNA",
    "Choose Your": "Piliin ang Iyong",
    "Game": "Laro",
    "Select one of the games below to start playing.": "Pumili ng isa sa mga laro sa ibaba para magsimulang maglaro.",
    "Memory Challenge": "Hamon sa Memorya",
    "Match all eight pairs using your memory.": "Itugma ang walong pares gamit ang iyong memorya.",
    "Play Memory Game →": "Laruin ang Memory Game →",
    "Number Guessing": "Hulaan ang Numero",
    "Guess the secret number using helpful hints.": "Hulaan ang sikretong numero gamit ang mga pahiwatig.",
    "Play Number Game →": "Laruin ang Number Game →",
    "← Choose Another Game": "← Pumili ng Ibang Laro",
    "Memory": "Memorya",
    "Challenge": "Hamon",
    "Match all the pairs using your memory. Try to finish in fewer moves and less time!": "Itugma ang lahat ng pares gamit ang iyong memorya. Subukang tapusin sa mas kaunting galaw at mas maikling oras!",
    "MOVES": "GALAW",
    "TIME": "ORAS",
    "PAIRS": "PARES",
    "Start Game": "Simulan ang Laro",
    "Restart": "Ulitin",
    "Best result:": "Pinakamagandang resulta:",
    "Not yet recorded": "Wala pang naitala",
    "TEST YOUR KNOWLEDGE": "SUBUKIN ANG IYONG KAALAMAN",
    "Programming": "Programming",
    "Quiz": "Kuwis",
    "Challenge yourself with questions about web development and programming basics.": "Hamunin ang sarili gamit ang mga tanong tungkol sa web development at mga batayan ng programming.",
    "Next Question": "Susunod na Tanong",
    "QUIZ COMPLETED": "TAPOS NA ANG KUWIS",
    "Try Again": "Subukan Muli",
    "THINK AND GUESS": "MAG-ISIP AT HUMULA",
    "Number": "Numero",
    "Guessing Game": "Larong Paghula",
    "Can you guess the secret number? Use the hints to find the correct answer in as few attempts as possible.": "Mahuhulaan mo ba ang sikretong numero? Gamitin ang mga pahiwatig para makuha ang tamang sagot sa kakaunting pagsubok.",
    "Difficulty": "Hirap",
    "Guess": "Hulaan",
    "New Game": "Bagong Laro",
    "ATTEMPTS": "MGA PAGSUBOK",
    "BEST SCORE": "PINAKAMAGANDANG ISKOR",
    "Portfolio assistant": "Katulong sa portfolio",
    "Hey! I'm Olavario's portfolio assistant. Ask me about his skills, projects, or basic programming.": "Kumusta! Ako ang katulong sa portfolio ni Olavario. Tanungin mo ako tungkol sa kanyang mga kasanayan, proyekto, o batayang programming.",
    "About Vincent": "Tungkol kay Vincent",
    "Programming help": "Tulong sa programming",

    /* about */
    "GET TO KNOW ME": "KILALANIN AKO",
    "Discover my background, interests, and goals as I begin my journey in Computer Engineering.": "Alamin ang aking pinagmulan, mga interes, at mga layunin sa pagsisimula ng aking paglalakbay sa Computer Engineering.",
    "WHO I AM": "SINO AKO",
    "I am a first-year Computer Engineering student interested…": "Isa akong unang taong estudyante ng Computer Engineering na interesado sa teknolohiya, mga computer, at paglutas ng problema. Nasisiyahan akong tuklasin kung paano gumagana ang mga bagay at kung paano malulutas ng teknolohiya ang mga totoong problema.",
    "As I continue my studies, I am developing…": "Habang nagpapatuloy ako sa pag-aaral, nahahasa ang aking kaalaman sa programming, mga computer system, at web development. Naniniwala akong ang tuloy-tuloy na pagsasanay, pagkamausisa, at pasensya ay mahahalagang bahagi ng pagiging mas mahusay na inhinyero.",
    "My goal is to gain practical experience…": "Layunin kong magkaroon ng praktikal na karanasan, gumawa ng mga kapaki-pakinabang na proyekto, at patuloy na paunlarin ang aking mga teknikal na kasanayan. Handa akong harapin ang mga bagong hamon at matuto nang paisa-isang hakbang.",
    "Education": "Edukasyon",
    "Year Level": "Antas ng Taon",
    "First-Year College Student": "Unang Taon sa Kolehiyo",
    "Interests": "Mga Interes",
    "Basketball, Technology, Programming, and Watching": "Basketball, Teknolohiya, Programming, at Panonood",
    "Mindset": "Pananaw",
    "Always Keep Learning": "Laging Magpatuloy sa Pag-aaral",
    "WHAT DRIVES ME": "ANG NAGPAPAGANA SA AKIN",
    "The principles that guide my learning and personal growth.": "Ang mga prinsipyong gumagabay sa aking pag-aaral at personal na paglago.",
    "Curiosity": "Pagkamausisa",
    "I enjoy exploring new technologies, asking questions…": "Nasisiyahan akong tuklasin ang mga bagong teknolohiya, magtanong, at unawain kung paano gumagana ang mga computer system at software.",
    "Continuous Growth": "Patuloy na Paglago",
    "I believe every challenge is an opportunity to learn…": "Naniniwala akong ang bawat hamon ay pagkakataong matuto. Layunin kong paunlarin ang aking mga kasanayan sa pamamagitan ng pagsasanay, puna, at karanasan.",
    "Persistence": "Pagtitiyaga",
    "Learning something new can be difficult…": "Mahirap minsan ang matuto ng bago, kaya nananatili akong matiyaga, nilulutas ang mga problema, at patuloy na sumusulong.",
    "LOOKING AHEAD": "PAGTANAW SA HINAHARAP",
    "As a Computer Engineering student, I want to build…": "Bilang estudyante ng Computer Engineering, nais kong bumuo ng matibay na pundasyon sa programming, electronics, computer hardware, at software development.",
    "I hope to apply what I learn by creating projects…": "Umaasa akong magagamit ang aking natututunan sa paggawa ng mga proyektong magpapakita ng aking pag-unlad at magbibigay ng totoong karanasan. Nais ko ring maging mas kumpiyansa sa pakikipagtulungan sa iba at paglutas ng mga teknikal na problema.",
    "Ultimately, I aspire to become a skilled engineer…": "Sa huli, pangarap kong maging mahusay na inhinyerong gumagamit ng teknolohiya nang malikhain at responsable para makapagdulot ng positibong pagbabago.",
    "MY GAME PLAN": "ANG AKING PLANO",
    "Just like basketball, learning takes practice…": "Tulad ng basketball, kailangan ng pagsasanay, pagtutulungan, at pagtitiyaga sa pag-aaral. Pinagbubuti ko ang aking mga kasanayan nang paisa-isang hakbang para maging mas mahusay na Computer Engineer.",
    "🏀 View My Projects": "🏀 Tingnan ang Aking mga Proyekto",

    /* contact */
    "LET'S CONNECT": "MAGKAUGNAYAN TAYO",
    "Have a project idea, question, or just want to say hello?…": "May ideya ba para sa proyekto, tanong, o gusto lang bumati? Huwag mag-atubiling makipag-ugnayan sa akin gamit ang mga detalye sa ibaba.",
    "Email": "Email",
    "Copy Email": "Kopyahin ang Email",
    "Find Me": "Hanapin Ako",
    "Online": "Online",
    "SEND A MESSAGE": "MAGPADALA NG MENSAHE",
    "Fill in the details below to prepare your email.": "Punan ang mga detalye sa ibaba para ihanda ang iyong email.",
    "Name": "Pangalan",
    "Your Email": "Iyong Email",
    "Subject": "Paksa",
    "Choose a subject": "Pumili ng paksa",
    "Project Collaboration": "Pakikipagtulungan sa Proyekto",
    "School-Related Inquiry": "Tanong Tungkol sa Paaralan",
    "Website Feedback": "Puna sa Website",
    "General Question": "Pangkalahatang Tanong",
    "Other": "Iba pa",
    "Message": "Mensahe",
    "Prepare Email": "Ihanda ang Email",
    "Send Message": "Ipadala ang Mensahe",
    "Your name": "Iyong pangalan",
    "Write your message...": "Isulat ang iyong mensahe...",

    /* skills */
    "WHAT I KNOW": "ANG ALAM KO",
    "The programming languages, technologies, and tools I am learning…": "Ang mga programming language, teknolohiya, at kasangkapang aking pinag-aaralan habang lumalago bilang estudyante ng Computer Engineering.",
    "MY EXPERTISE": "ANG AKING KAKAYAHAN",
    "Search, filter, and explore the technical skills I am developing.": "Maghanap, mag-filter, at galugarin ang mga teknikal na kasanayang aking hinahasa.",
    "All Skills": "Lahat ng Kasanayan",
    "Web Development": "Web Development",
    "Tools & Data": "Mga Kasangkapan at Data",
    "Self-assessed level": "Sariling tantiya ng antas",
    "Practicing": "Nagsasanay",
    "Learning": "Nag-aaral",
    "Beginner": "Baguhan",
    "Click to explore →": "I-click para galugarin →",
    "Building structured and accessible web pages.": "Paggawa ng maayos at madaling gamiting mga web page.",
    "Designing responsive layouts and website interfaces.": "Pagdidisenyo ng responsive na layout at interface ng website.",
    "Creating interactive website features.": "Paggawa ng mga interaktibong tampok ng website.",
    "Practicing programming fundamentals and problem-solving.": "Pagsasanay sa mga batayan ng programming at paglutas ng problema.",
    "Learning how to organize, store, and manage data.": "Pag-aaral kung paano mag-ayos, mag-imbak, at mamahala ng data.",
    "Learning version control and code management.": "Pag-aaral ng version control at pamamahala ng code.",
    "SKILL DETAILS": "DETALYE NG KASANAYAN",
    "Related projects": "Kaugnay na mga proyekto",
    "Explore Projects": "Tingnan ang mga Proyekto",
    "MY NEXT STEPS": "ANG AKING SUSUNOD NA HAKBANG",
    "Technologies I want to study as I continue my Computer Engineering journey.": "Mga teknolohiyang nais kong pag-aralan habang nagpapatuloy sa aking paglalakbay sa Computer Engineering.",
    "Current focus": "Kasalukuyang pokus",
    "Improve JavaScript, responsive design, accessibility, and website functionality.": "Pagbutihin ang JavaScript, responsive design, accessibility, at pagganap ng website.",
    "Next to learn": "Susunod na aaralin",
    "C++ Programming": "C++ Programming",
    "Build stronger programming fundamentals and understand object-oriented programming.": "Palakasin ang mga batayan ng programming at unawain ang object-oriented programming.",
    "Future goal": "Pangarap sa hinaharap",
    "Explore electronics, microcontrollers, hardware, and software integration.": "Galugarin ang electronics, microcontroller, hardware, at pagsasama ng software.",
    "Databases & Systems": "Mga Database at Sistema",
    "Learn SQL, data structures, and how applications store and process information.": "Matuto ng SQL, data structures, at kung paano nag-iimbak at nagpoproseso ng impormasyon ang mga aplikasyon.",
    "ALWAYS IMPROVING": "PATULOY NA UMUUNLAD",
    "I am improving through coursework, hands-on practice, and personal projects. My goal is to turn what I learn into practical solutions.": "Umuunlad ako sa pamamagitan ng mga aralin, praktikal na pagsasanay, at personal na proyekto. Layunin kong gawing praktikal na solusyon ang aking natututunan.",

    /* projects */
    "WHAT I'VE BUILT": "ANG AKING NAGAWA",
    "Explore my programming projects and engineering concepts…": "Galugarin ang aking mga proyekto sa programming at mga konsepto sa engineering. Maghanap, mag-filter, mag-save ng paborito, at magbukas ng proyekto para malaman ang mga tampok at teknolohiya nito.",
    "Total Projects": "Kabuuang Proyekto",
    "Technologies": "Mga Teknolohiya",
    "Completed": "Natapos",
    "My Favorites": "Aking mga Paborito",
    "Search projects": "Maghanap ng proyekto",
    "Category": "Kategorya",
    "All Categories": "Lahat ng Kategorya",
    "Python Projects": "Mga Proyektong Python",
    "Status": "Katayuan",
    "All Statuses": "Lahat ng Katayuan",
    "In Progress": "Isinasagawa",
    "Concept": "Konsepto",
    "Project Gallery": "Galeriya ng Proyekto",
    "Favorites Only": "Mga Paborito Lamang",
    "Quick Preview ↗": "Mabilis na Silip ↗",
    "Project Page ↗": "Pahina ng Proyekto ↗",
    "No projects found": "Walang nahanap na proyekto",
    "Try another search term or change your filters.": "Subukan ang ibang salita o baguhin ang mga filter.",
    "Project Features": "Mga Tampok ng Proyekto",
    "Technologies Used": "Mga Teknolohiyang Ginamit",
    "What I Learned": "Ang Aking Natutunan",
    "Open Project Page ↗": "Buksan ang Pahina ng Proyekto ↗",
    "Launch Project": "Ilunsad ang Proyekto",
    "A Python application for adding, viewing, and managing student records through a simple command-line interface.": "Isang Python application para magdagdag, tumingin, at mamahala ng mga tala ng estudyante gamit ang simpleng command-line interface.",
    "A responsive website for organizing workouts based on fitness goals, experience, and available equipment.": "Isang responsive na website para ayusin ang mga ehersisyo ayon sa layunin sa fitness, karanasan, at magagamit na kagamitan.",
    "An IoT project concept for monitoring heart rate and blood oxygen levels with real-time updates and alerts.": "Isang konsepto ng IoT project para subaybayan ang tibok ng puso at antas ng oxygen sa dugo na may real-time na update at alerto.",
    "A program that calculates grades from scores and displays the resulting average.": "Isang programang kumukuwenta ng mga grado mula sa mga iskor at nagpapakita ng average.",
    "A calculator for arithmetic, trigonometry, logarithms, square roots, and exponents.": "Isang calculator para sa arithmetic, trigonometry, logarithm, square root, at exponent.",

    /* editor */
    "WEB DEVELOPMENT PLAYGROUND": "PALARUAN SA WEB DEVELOPMENT",
    "Write HTML, style it with CSS, add JavaScript, and see your result instantly.": "Sumulat ng HTML, i-istilo gamit ang CSS, magdagdag ng JavaScript, at makita agad ang resulta.",
    "Ready to code": "Handa nang mag-code",
    "Download HTML": "I-download ang HTML",
    "▶ Run Code": "▶ Patakbuhin ang Code",
    "Live Preview": "Live na Preview",
    "OUTPUT": "RESULTA",
    "Preview runs in a sandbox": "Tumatakbo ang preview sa sandbox",
    "Finish Portfolio": "Tapusin ang Portfolio",

    /* new features */
    "Résumé": "Résumé",
    "📄 Résumé": "📄 Résumé",
    "visits": "pagbisita",
    "Loading…": "Naglo-load…",
    "Public repositories": "Mga pampublikong repository",
    "Followers": "Mga tagasunod",
    "Latest repositories": "Pinakabagong mga repository",
    "Recent activity": "Kamakailang aktibidad",
    "View on GitHub": "Tingnan sa GitHub",
    "Your name (optional)": "Iyong pangalan (opsyonal)",
    "Leave a short message…": "Mag-iwan ng maikling mensahe…",
    "Post message": "I-post ang mensahe",
    "Skills radar": "Radar ng mga kasanayan",
    "Run tests": "Patakbuhin ang mga test",
    "Next challenge": "Susunod na hamon",
    "Reset code": "I-reset ang code",
    "Show hint": "Ipakita ang pahiwatig",
    "Save your score": "I-save ang iyong iskor",
    "Save": "I-save",
    "Sort by": "Ayusin ayon sa",
    "Default order": "Orihinal na ayos",
    "Name A–Z": "Pangalan A–Z",
    "Name Z–A": "Pangalan Z–A",
    "Most liked": "Pinakagusto",
    "Technologies": "Mga Teknolohiya",
    "▦ Grid": "▦ Grid",
    "☰ List": "☰ Listahan",
    "← Previous": "← Nakaraan",
    "Next →": "Susunod →",
    "🔗 Copy link": "🔗 Kopyahin ang link",
    "✓ Link copied": "✓ Nakopya ang link",
    "GitHub ↗": "GitHub ↗",
    "Read more": "Magbasa pa",
    "Show less": "Ipakita nang mas kaunti",
    "All posts": "Lahat ng post",
    "Search posts…": "Maghanap ng post…",
    "min read": "min na babasahin",
    "Download PDF": "I-download ang PDF",
    "Print / Save as PDF": "I-print / I-save bilang PDF",
  };

  const SKIP_SELECTOR =
    "script,style,noscript,textarea,input,pre,code,.code-content,.terminal,#terminalOutput," +
    ".music-player,.playlist,[data-no-i18n],.cm-s-default,.CodeMirror,.ide-output,iframe";

  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const prefixKeys = Object.keys(STRINGS).filter((k) => k.slice(-1) === "…");

  function lookup(text) {
    const n = norm(text);
    if (!n) return null;
    if (Object.prototype.hasOwnProperty.call(STRINGS, n)) return STRINGS[n];
    for (let i = 0; i < prefixKeys.length; i++) {
      const p = prefixKeys[i].slice(0, -1);
      if (n.indexOf(p) === 0) return STRINGS[prefixKeys[i]];
    }
    return null;
  }

  let lang = "en";
  try {
    lang = localStorage.getItem(KEY) === "fil" ? "fil" : "en";
  } catch (e) {}

  const tracked = []; // {node, original} text nodes, {el, attr, original} attributes
  const done = new WeakSet();

  function setText(node, translated) {
    if (done.has(node)) return;
    const original = node.nodeValue;
    const lead = original.match(/^\s*/)[0];
    const trail = original.match(/\s*$/)[0];
    node.nodeValue = lead + translated + trail;
    tracked.push({ node: node, original: original });
    done.add(node);
  }

  function textNodes(el) {
    const out = [];
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode;
      if (norm(n.nodeValue)) out.push(n);
    }
    return out;
  }

  function translateTree(root) {
    if (!root || root.nodeType !== 1) {
      if (root && root.nodeType === 3 && root.parentElement) root = root.parentElement;
      else return;
    }
    if (root.closest && root.closest(SKIP_SELECTOR)) return;

    // Navigation links by href
    root.querySelectorAll && root.querySelectorAll(".nav-links a").forEach((a) => {
      const href = (a.getAttribute("href") || "").split("/").pop();
      if (NAV[href]) {
        const nodes = textNodes(a);
        if (nodes.length === 1) setText(nodes[0], NAV[href]);
      }
    });

    // Multi-part headings
    const headings = root.matches && root.matches("h1,h2,h3") ? [root] : [];
    root.querySelectorAll && root.querySelectorAll("h1,h2,h3").forEach((h) => headings.push(h));
    headings.forEach((h) => {
      if (h.closest(SKIP_SELECTOR) || h.hasAttribute("data-typing")) return;
      const parts = HEADINGS[norm(h.textContent)];
      if (!parts) return;
      const nodes = textNodes(h);
      if (nodes.length === parts.length && !nodes.some((n) => done.has(n))) {
        nodes.forEach((n, i) => setText(n, parts[i]));
      }
    });

    // Everything else, text node by text node
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const batch = [];
    while (w.nextNode()) batch.push(w.currentNode);
    batch.forEach((n) => {
      const p = n.parentElement;
      if (!p || done.has(n) || p.closest(SKIP_SELECTOR) || p.closest("[data-typing]")) return;
      if (p.closest(".nav-links")) return;
      const t = lookup(n.nodeValue);
      if (t) setText(n, t);
    });

    // Placeholders
    root.querySelectorAll &&
      root.querySelectorAll("[placeholder]").forEach((el) => {
        const t = lookup(el.getAttribute("placeholder"));
        if (t && !el.hasAttribute("data-i18n-ph")) {
          el.setAttribute("data-i18n-ph", el.getAttribute("placeholder"));
          el.setAttribute("placeholder", t);
        }
      });
  }

  function revert() {
    tracked.splice(0).forEach((t) => {
      if (t.node && t.node.parentNode) t.node.nodeValue = t.original;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      el.setAttribute("placeholder", el.getAttribute("data-i18n-ph"));
      el.removeAttribute("data-i18n-ph");
    });
  }

  let button, menuBtn;
  function updateButton() {
    if (!button) return;
    button.textContent = lang === "fil" ? "FIL" : "EN";
    button.setAttribute("aria-pressed", String(lang === "fil"));
    const label = lang === "fil" ? "Switch to English" : "Lumipat sa Filipino";
    button.setAttribute("aria-label", label);
    button.title = label;
    if (menuBtn) {
      menuBtn.textContent = lang === "fil" ? "🌐 Wika: Filipino — i-tap para sa English" : "🌐 Language: English — tap for Filipino";
      menuBtn.setAttribute("aria-label", label);
    }
  }

  function setLang(next, silent) {
    lang = next;
    document.documentElement.lang = lang === "fil" ? "fil" : "en";
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) {}
    if (lang === "fil") translateTree(document.body);
    else revert();
    updateButton();
    window.dispatchEvent(new CustomEvent("site:langchange", { detail: lang }));
    if (!silent && lang === "fil" && window.SiteStore) window.SiteStore.unlock("polyglot");
  }

  let pending = null;
  function watch() {
    new MutationObserver((records) => {
      if (lang !== "fil") return;
      clearTimeout(pending);
      pending = setTimeout(() => {
        records.forEach((r) => r.addedNodes.forEach((n) => translateTree(n)));
      }, 60);
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* Does the site's own CSS pin the palette button inside a custom navbar layout? */
  function hasCustomHeaderCSS(tc) {
    if (tc && !tc.classList.contains("tc-floating") && getComputedStyle(tc).position === "fixed") return true;
    function scan(rules) {
      for (let i = 0; i < rules.length; i++) {
        const r = rules[i];
        if (r.selectorText && r.selectorText.indexOf(".tc-trigger:not(.tc-floating)") !== -1) return true;
        if (r.cssRules && scan(r.cssRules)) return true;
      }
      return false;
    }
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        if (scan(document.styleSheets[i].cssRules)) return true;
      } catch (e) { /* cross-origin sheet (fonts, icons) */ }
    }
    return false;
  }

  function init() {
    button = document.createElement("button");
    button.type = "button";
    button.className = "lang-toggle";
    button.addEventListener("click", () => setLang(lang === "fil" ? "en" : "fil"));

    const anchor = document.getElementById("themeToggle");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(button, anchor.nextSibling);
    else {
      button.classList.add("lang-floating");
      document.body.appendChild(button);
    }

    // Some navbar designs pin the palette button to the top-right corner and use a
    // one-row grid on phones. In that case the language button is pinned beside it
    // on desktop and lives inside the dropdown menu on phones.
    const tc = document.querySelector(".tc-trigger");
    const custom = hasCustomHeaderCSS(tc);
    document.documentElement.classList.toggle("hdr-custom", custom);
    const links = document.querySelector(".nav-links");
    if (custom && links) {
      const li = document.createElement("li");
      li.className = "lang-menu-item";
      menuBtn = document.createElement("button");
      menuBtn.type = "button";
      menuBtn.className = "lang-menu-btn";
      menuBtn.addEventListener("click", () => setLang(lang === "fil" ? "en" : "fil"));
      li.appendChild(menuBtn);
      links.appendChild(li);
    }

    document.documentElement.lang = lang === "fil" ? "fil" : "en";
    if (lang === "fil") translateTree(document.body);
    updateButton();
    watch();
  }

  window.SiteI18n = {
    get lang() { return lang; },
    set: setLang,
    apply: function (root) { if (lang === "fil") translateTree(root); },
    add: function (map) { Object.assign(STRINGS, map); },
  };

  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
})();
