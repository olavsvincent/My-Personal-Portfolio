
(() => {
  const launcher = document.getElementById("chatbotLauncher");
  const panel = document.getElementById("chatbotPanel");
  const closeButton = document.getElementById("chatbotClose");
  const launcherIcon = document.getElementById("chatbotLauncherIcon");
  const form = document.getElementById("chatbotForm");
  const input = document.getElementById("chatbotInput");
  const messages = document.getElementById("chatbotMessages");
  const quickReplies = document.getElementById("chatbotQuickReplies");

  if (!launcher || !panel || !form || !input || !messages) return;

  const projects = [
    "Student Management System — a Python project for managing student records.",
    "Workout Planner — a web project using HTML, CSS, and JavaScript.",
    "Health Monitoring System — a concept for monitoring heart rate and blood oxygen levels."
  ];

  function openChat() {
    panel.classList.add("chatbot-open");
    panel.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    launcherIcon.textContent = "×";
    input.focus();
  }

  function closeChat() {
    panel.classList.remove("chatbot-open");
    panel.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
    launcherIcon.textContent = "☏";
    launcher.focus();
  }

  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `chat-message ${sender}-message`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function getReply(message) {
    const text = message.toLowerCase().trim();

    if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text)) {
      return "Hey there! What would you like to know about Vincent, his projects, or programming?";
    }

    if (text.includes("who are you") || text.includes("what can you do") || text.includes("help")) {
      return "I'm Vincent's portfolio assistant. I can tell you about his background, skills, projects, and explain basic programming concepts. Try asking about HTML, CSS, JavaScript, or Python.";
    }

    if (text.includes("about vincent") || text.includes("tell me about vincent") ||
        text.includes("who is vincent") || text.includes("about him") ||
        text.includes("your background")) {
      return "Shane Vincent Olavario is a first-year Computer Engineering student interested in technology, computers, problem-solving, and building practical projects. He aims to keep learning and improve his programming and engineering skills.";
    }

    if (text.includes("skill") || text.includes("what can he do")) {
      return "Vincent is developing skills in HTML, CSS, JavaScript, Python, databases, and Git/GitHub. His portfolio highlights his learning progress and practical projects.";
    }

    if (text.includes("project") || text.includes("what has he made") ||
        text.includes("what did he build")) {
      return "Here are some projects featured in the portfolio:\n\n" +
        projects.map((project, index) => `${index + 1}. ${project}`).join("\n\n") +
        "\n\nVisit the Projects page to explore them.";
    }

    if (text.includes("contact") || text.includes("email") || text.includes("reach him")) {
      return "You can visit the Contact page on this portfolio to find the contact options Vincent has provided.";
    }

    if (text.includes("computer engineering") || text.includes("why cpe") ||
        text.includes("course")) {
      return "Computer Engineering combines computing and electronics. It involves areas such as programming, computer hardware, digital systems, and embedded devices.";
    }

    if (text.includes("html")) {
      return "HTML means HyperText Markup Language. It defines the structure and content of a webpage, such as headings, paragraphs, images, links, and buttons.";
    }

    if (text.includes("css")) {
      return "CSS means Cascading Style Sheets. It controls how a webpage looks, including colors, fonts, spacing, layouts, animations, and responsive design.";
    }

    if (text.includes("javascript") || text.includes(" js ") ||
        text === "js" || text.includes("java script")) {
      return "JavaScript adds behavior to webpages. It can handle button clicks, validate forms, update content, create games, and make interactive interfaces.";
    }

    if (text.includes("python")) {
      return "Python is a general-purpose programming language known for readable syntax. It is useful for automation, data processing, scripting, and many other tasks.";
    }

    if (text.includes("c++") || text.includes("cpp")) {
      return "C++ is a programming language often used for performance-focused software, game development, systems programming, and problem-solving.";
    }

    if (text.includes("variable")) {
      return "A variable is a named place to store a value. For example, in JavaScript: let score = 10; stores the number 10 in a variable named score.";
    }

    if (text.includes("function")) {
      return "A function is a reusable block of code that performs a task. In JavaScript: function greet() { return 'Hello!'; } defines a function named greet.";
    }

    if (text.includes("loop") || text.includes("for loop") || text.includes("while loop")) {
      return "A loop repeats a block of code. A for loop is useful when you know how many repetitions you need; a while loop continues while its condition is true.";
    }

    if (text.includes("array") || text.includes("list")) {
      return "An array stores multiple values in one variable. In JavaScript, const scores = [90, 85, 78]; creates an array containing three numbers.";
    }

    if (text.includes("bug") || text.includes("debug")) {
      return "Debugging means finding and fixing problems in code. Read the error message, check the line mentioned, inspect your variables, and test one change at a time.";
    }

    if (text.includes("thank")) {
      return "You're welcome! Feel free to ask another question or explore the portfolio.";
    }

    if (text.includes("game") || text.includes("memory")) {
      return "Try the Memory Challenge on this homepage! Match all eight pairs while keeping your moves and time as low as possible.";
    }

    return "I don't have a predefined answer for that yet. Try asking about Vincent, his skills, projects, Computer Engineering, or basic HTML, CSS, JavaScript, and Python.";
  }

  function sendMessage(message) {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    addMessage(cleanMessage, "user");
    addMessage(getReply(cleanMessage), "bot");
  }

  launcher.addEventListener("click", () => {
    if (panel.classList.contains("chatbot-open")) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeButton?.addEventListener("click", closeChat);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
    input.value = "";
    input.focus();
  });

  quickReplies?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-chat]");
    if (!button) return;
    sendMessage(button.dataset.chat || "");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("chatbot-open")) {
      closeChat();
    }
  });
})();
