
document.addEventListener("DOMContentLoaded", () => {
  const questions = {
    easy: [
      {
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Machine Language",
          "Home Tool Markup Language"
        ],
        answer: 0,
        explanation: "HTML stands for HyperText Markup Language."
      },
      {
        question: "Which language is used to style web pages?",
        options: ["Python", "CSS", "Java", "C++"],
        answer: 1,
        explanation: "CSS controls the appearance and layout of web pages."
      },
      {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["<!-- -->", "//", "#", "**"],
        answer: 1,
        explanation: "// is used for single-line JavaScript comments."
      },
      {
        question: "Which keyword declares a variable in JavaScript?",
        options: ["var", "print", "echo", "define"],
        answer: 0,
        explanation: "var, let, and const can declare variables."
      },
      {
        question: "What does CSS stand for?",
        options: [
          "Computer Style System",
          "Creative Style Syntax",
          "Cascading Style Sheets",
          "Colorful Style Sheets"
        ],
        answer: 2,
        explanation: "CSS means Cascading Style Sheets."
      },
      {
        question: "Which HTML tag creates a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        answer: 1,
        explanation: "The anchor tag <a> creates hyperlinks."
      },
      {
        question: "Which function displays output in JavaScript?",
        options: ["console.log()", "input()", "read()", "display()"],
        answer: 0,
        explanation: "console.log() displays information in the console."
      },
      {
        question: "Which data type stores True or False?",
        options: ["String", "Integer", "Boolean", "Float"],
        answer: 2,
        explanation: "Boolean values represent true or false."
      },
      {
        question: "Which language is commonly used for web interactivity?",
        options: ["JavaScript", "HTML", "CSS", "SQL"],
        answer: 0,
        explanation: "JavaScript adds interactive behavior to websites."
      },
      {
        question: "What does CPU stand for?",
        options: [
          "Central Processing Unit",
          "Computer Personal Utility",
          "Central Program User",
          "Control Processing Utility"
        ],
        answer: 0,
        explanation: "CPU stands for Central Processing Unit."
      }
    ],

    medium: [
      {
        question: "What is the output of console.log(5 + '5')?",
        options: ["10", "55", "Error", "NaN"],
        answer: 1,
        explanation: "JavaScript concatenates the number and string."
      },
      {
        question: "Which keyword declares a constant in JavaScript?",
        options: ["var", "let", "const", "static"],
        answer: 2,
        explanation: "const declares a variable that cannot be reassigned."
      },
      {
        question: "What is the purpose of a for loop?",
        options: [
          "To repeat code",
          "To delete variables",
          "To create HTML",
          "To stop a program permanently"
        ],
        answer: 0,
        explanation: "A for loop repeats a block of code."
      },
      {
        question: "Which data structure follows FIFO?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        answer: 1,
        explanation: "FIFO means First In, First Out."
      },
      {
        question: "What does DOM stand for?",
        options: [
          "Data Object Management",
          "Document Object Model",
          "Digital Ordinance Method",
          "Document Orientation Module"
        ],
        answer: 1,
        explanation: "The DOM represents a web page as objects."
      },
      {
        question: "What is the result of 10 % 3?",
        options: ["3", "1", "0", "2"],
        answer: 1,
        explanation: "The modulo operator returns the remainder."
      },
      {
        question: "Which method adds an element to the end of an array?",
        options: ["pop()", "shift()", "push()", "remove()"],
        answer: 2,
        explanation: "push() adds one or more elements to an array."
      },
      {
        question: "What does SQL primarily manage?",
        options: [
          "Animations",
          "Databases",
          "Operating systems",
          "Computer graphics"
        ],
        answer: 1,
        explanation: "SQL is used to manage and query relational databases."
      },
      {
        question: "Which statement handles exceptions in JavaScript?",
        options: [
          "if/else",
          "try/catch",
          "for/while",
          "switch/case"
        ],
        answer: 1,
        explanation: "try/catch handles runtime exceptions."
      },
      {
        question: "What is an API?",
        options: [
          "Application Programming Interface",
          "Advanced Program Internet",
          "Automated Processing Input",
          "Application Program Installation"
        ],
        answer: 0,
        explanation: "An API allows software systems to communicate."
      }
    ],

    hard: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        answer: 1,
        explanation: "Binary search halves the search space each iteration."
      },
      {
        question: "What is a closure in JavaScript?",
        options: [
          "A function with access to its outer lexical scope",
          "A loop that never ends",
          "A deleted variable",
          "A method that closes a browser"
        ],
        answer: 0,
        explanation: "A closure retains access to its lexical environment."
      },
      {
        question: "Which sorting algorithm has average O(n log n) complexity?",
        options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Linear Search"],
        answer: 2,
        explanation: "Merge Sort has O(n log n) average and worst-case complexity."
      },
      {
        question: "What does recursion mean?",
        options: [
          "A function calling itself",
          "A variable changing its value",
          "A program deleting itself",
          "A loop skipping iterations"
        ],
        answer: 0,
        explanation: "Recursion occurs when a function calls itself."
      },
      {
        question: "Which principle hides internal implementation details?",
        options: ["Inheritance", "Encapsulation", "Iteration", "Compilation"],
        answer: 1,
        explanation: "Encapsulation bundles data and restricts direct access."
      },
      {
        question: "What is the result of Boolean([]) in JavaScript?",
        options: ["false", "true", "null", "undefined"],
        answer: 1,
        explanation: "Empty arrays are truthy in JavaScript."
      },
      {
        question: "Which data structure is commonly used in DFS?",
        options: ["Queue", "Stack", "Hash table only", "Array only"],
        answer: 1,
        explanation: "Depth-first search uses a stack, explicitly or through recursion."
      },
      {
        question: "What is a race condition?",
        options: [
          "Two operations compete and the outcome depends on timing",
          "A sorting algorithm",
          "A syntax error",
          "A database backup"
        ],
        answer: 0,
        explanation: "A race condition occurs when execution timing affects the result."
      },
      {
        question: "Which SQL command retrieves records?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
        answer: 2,
        explanation: "SELECT retrieves data from database tables."
      },
      {
        question: "What is polymorphism in OOP?",
        options: [
          "One interface with multiple implementations",
          "Deleting multiple objects",
          "Creating only one class",
          "Converting code into HTML"
        ],
        answer: 0,
        explanation: "Polymorphism allows different objects to respond to the same interface."
      }
    ],

    expert: [
      {
        question: "What is the time complexity of Dijkstra's algorithm using a binary heap and adjacency list?",
        options: ["O(V²)", "O((V + E) log V)", "O(E²)", "O(log V)"],
        answer: 1,
        explanation: "With a binary heap, the complexity is O((V + E) log V)."
      },
      {
        question: "What is the main purpose of a mutex?",
        options: [
          "Compress data",
          "Synchronize access to shared resources",
          "Increase CPU clock speed",
          "Allocate permanent memory"
        ],
        answer: 1,
        explanation: "A mutex provides mutual exclusion for shared resources."
      },
      {
        question: "What is a deadlock in operating systems?",
        options: [
          "A process finishes successfully",
          "Processes wait indefinitely for resources held by each other",
          "A CPU reaches maximum speed",
          "A program runs without memory"
        ],
        answer: 1,
        explanation: "Deadlock occurs when processes are permanently blocked waiting for resources."
      },
      {
        question: "Which data structure is commonly used to implement a priority queue efficiently?",
        options: ["Linked list only", "Binary heap", "Stack", "Circular queue"],
        answer: 1,
        explanation: "A binary heap supports efficient insertion and priority removal."
      },
      {
        question: "What does ACID stand for in database transactions?",
        options: [
          "Atomicity, Consistency, Isolation, Durability",
          "Access, Control, Integration, Data",
          "Automatic, Consistent, Indexed, Distributed",
          "Atomicity, Compilation, Isolation, Deployment"
        ],
        answer: 0,
        explanation: "ACID defines four key properties of reliable database transactions."
      },
      {
        question: "What is a virtual function in C++?",
        options: [
          "A function supporting runtime polymorphism",
          "A function that cannot be called",
          "A function that runs only at compile time",
          "A function without a return type"
        ],
        answer: 0,
        explanation: "Virtual functions enable dynamic dispatch through base-class pointers or references."
      },
      {
        question: "What is the purpose of garbage collection?",
        options: [
          "Remove unused memory allocations",
          "Delete source code",
          "Increase network speed",
          "Compile database queries"
        ],
        answer: 0,
        explanation: "Garbage collection reclaims memory no longer in use."
      },
      {
        question: "Which CPU scheduling algorithm can cause starvation?",
        options: [
          "Round Robin",
          "First Come First Served",
          "Priority Scheduling",
          "All processes finish simultaneously"
        ],
        answer: 2,
        explanation: "Low-priority processes can wait indefinitely when higher-priority processes keep arriving."
      },
      {
        question: "What does the CAP theorem state about distributed systems?",
        options: [
          "A system can guarantee all three properties under network partition",
          "A system must trade off between consistency and availability during a network partition",
          "A system cannot use databases",
          "A system must always prioritize speed"
        ],
        answer: 1,
        explanation: "During a network partition, a distributed system cannot guarantee both consistency and availability."
      },
      {
        question: "What is the purpose of a page table in virtual memory?",
        options: [
          "Map virtual addresses to physical memory frames",
          "Store browser history",
          "Schedule CPU instructions",
          "Encrypt database records"
        ],
        answer: 0,
        explanation: "Page tables translate virtual memory addresses into physical memory addresses."
      }
    ]
  };

  const selection = document.getElementById("quizDifficultySelection");
  const panel = document.getElementById("quizPanel");
  const result = document.getElementById("quizResult");

  const progress = document.getElementById("quizProgress");
  const scoreDisplay = document.getElementById("quizScore");
  const progressFill = document.getElementById("quizProgressFill");
  const questionDisplay = document.getElementById("quizQuestion");
  const optionsDisplay = document.getElementById("quizOptions");
  const feedback = document.getElementById("quizFeedback");
  const nextButton = document.getElementById("quizNext");
  const difficultyLabel = document.getElementById("quizDifficultyLabel");

  const resultIcon = document.getElementById("quizResultIcon");
  const resultTitle = document.getElementById("quizResultTitle");
  const resultText = document.getElementById("quizResultText");

  let currentDifficulty = "easy";
  let currentQuestions = [];
  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function startQuiz(difficulty) {
    currentDifficulty = difficulty;
    currentQuestions = shuffle(questions[difficulty]);
    currentQuestion = 0;
    score = 0;

    selection.hidden = true;
    result.hidden = true;
    panel.hidden = false;

    difficultyLabel.textContent = difficulty.toUpperCase() + " MODE";

    renderQuestion();
  }

  function renderQuestion() {
    const q = currentQuestions[currentQuestion];

    answered = false;

    progress.textContent =
      `Question ${currentQuestion + 1} of ${currentQuestions.length}`;

    scoreDisplay.textContent = `Score: ${score}`;

    progressFill.style.width =
      `${(currentQuestion / currentQuestions.length) * 100}%`;

    questionDisplay.textContent = q.question;
    feedback.textContent = "";
    nextButton.disabled = true;

    optionsDisplay.innerHTML = "";

    q.options.forEach((option, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;

      button.addEventListener("click", () => selectAnswer(index));

      optionsDisplay.appendChild(button);
    });
  }

  function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;

    const q = currentQuestions[currentQuestion];
    const buttons = optionsDisplay.querySelectorAll(".quiz-option");

    buttons.forEach((button, index) => {
      button.disabled = true;

      if (index === q.answer) {
        button.classList.add("correct");
      }

      if (index === selectedIndex && index !== q.answer) {
        button.classList.add("incorrect");
      }
    });

    if (selectedIndex === q.answer) {
      score++;
      feedback.textContent = "✓ Correct! " + q.explanation;
      feedback.className = "quiz-feedback correct-feedback";
    } else {
      feedback.textContent = "✕ Incorrect. " + q.explanation;
      feedback.className = "quiz-feedback incorrect-feedback";
    }

    scoreDisplay.textContent = `Score: ${score}`;
    nextButton.disabled = false;

    nextButton.textContent =
      currentQuestion === currentQuestions.length - 1
        ? "View Results"
        : "Next Question";
  }

  function showResults() {
    panel.hidden = true;
    result.hidden = false;

    const percentage = (score / currentQuestions.length) * 100;

    resultIcon.textContent =
      percentage === 100 ? "🏆" :
      percentage >= 70 ? "🎯" :
      percentage >= 40 ? "💡" : "📚";

    resultTitle.textContent =
      percentage === 100 ? "Perfect Score!" :
      percentage >= 70 ? "Excellent Work!" :
      percentage >= 40 ? "Good Effort!" : "Keep Practicing!";

    resultText.textContent =
      `You completed ${currentDifficulty.toUpperCase()} difficulty with ${score} out of ${currentQuestions.length} correct answers (${percentage}%).`;
  }

  nextButton.addEventListener("click", () => {
    if (!answered) return;

    if (currentQuestion < currentQuestions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      progressFill.style.width = "100%";
      showResults();
    }
  });

  document.querySelectorAll("[data-difficulty]").forEach(button => {
    button.addEventListener("click", () => {
      startQuiz(button.dataset.difficulty);
    });
  });

  document.getElementById("quizRetry").addEventListener("click", () => {
    startQuiz(currentDifficulty);
  });

  document.getElementById("quizChangeDifficulty").addEventListener("click", () => {
    panel.hidden = true;
    selection.hidden = false;
  });

  document.getElementById("quizBackToDifficulty").addEventListener("click", () => {
    result.hidden = true;
    selection.hidden = false;
  });
});
