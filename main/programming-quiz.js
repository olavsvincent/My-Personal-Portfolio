
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

  const questions = [
    {
      question: "What is the main purpose of HTML?",
      options: [
        "To structure webpage content",
        "To style webpage colors",
        "To store database records",
        "To manage computer hardware"
      ],
      answer: 0,
      explanation: "HTML defines the structure of a webpage, including headings, paragraphs, images, and links."
    },
    {
      question: "Which language is primarily used to style a webpage?",
      options: ["Python", "CSS", "SQL", "C++"],
      answer: 1,
      explanation: "CSS controls the visual appearance of a webpage, including colors, spacing, fonts, and layout."
    },
    {
      question: "What does JavaScript commonly add to a website?",
      options: [
        "Physical computer components",
        "Operating system drivers",
        "Interactive behavior",
        "Electrical power"
      ],
      answer: 2,
      explanation: "JavaScript can respond to clicks, validate forms, update content, and create interactive features."
    },
    {
      question: "Which Python symbol is used to start a single-line comment?",
      options: ["//", "<!--", "/*", "#"],
      answer: 3,
      explanation: "Python uses # to begin a single-line comment."
    },
    {
      question: "What is a variable used for in programming?",
      options: [
        "To store and refer to a value",
        "To permanently repair errors",
        "To increase internet speed",
        "To create a physical circuit"
      ],
      answer: 0,
      explanation: "A variable gives a name to a value that a program can use or update."
    },
    {
      question: "Which structure repeats code while a condition is true?",
      options: ["A comment", "A loop", "A string", "A constant"],
      answer: 1,
      explanation: "Loops repeat a block of code according to a condition or iteration rule."
    },
    {
      question: "What does an array commonly store?",
      options: [
        "Only one fixed character",
        "Only programming errors",
        "A collection of values",
        "Only webpage colors"
      ],
      answer: 2,
      explanation: "An array stores multiple values in one collection, accessible through indexes."
    },
    {
      question: "What is the main purpose of debugging?",
      options: [
        "To change every variable name",
        "To remove all comments",
        "To make code longer",
        "To find and fix problems in code"
      ],
      answer: 3,
      explanation: "Debugging helps identify, understand, and fix errors or unexpected behavior in a program."
    }
  ];

  let currentQuestion = 0;
  let score = 0;
  let answered = false;
  let selectedQuestions = [];

  function shuffle(array) {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  function startQuiz() {
    selectedQuestions = shuffle(questions);
    currentQuestion = 0;
    score = 0;
    answered = false;

    panel.hidden = false;
    resultPanel.hidden = true;

    showQuestion();
  }

  function showQuestion() {
    answered = false;

    const item = selectedQuestions[currentQuestion];

    progress.textContent =
      `Question ${currentQuestion + 1} of ${selectedQuestions.length}`;

    scoreDisplay.textContent = `Score: ${score}`;
    progressFill.style.width =
      `${(currentQuestion / selectedQuestions.length) * 100}%`;

    questionDisplay.textContent = item.question;
    feedback.textContent = "";
    feedback.className = "quiz-feedback";
    optionsContainer.replaceChildren();

    nextButton.disabled = true;
    nextButton.textContent =
      currentQuestion === selectedQuestions.length - 1
        ? "See Results"
        : "Next Question";

    item.options.forEach((option, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.addEventListener("click", () => chooseAnswer(index));

      optionsContainer.appendChild(button);
    });
  }

  function chooseAnswer(index) {
    if (answered) return;

    answered = true;

    const item = selectedQuestions[currentQuestion];
    const buttons = optionsContainer.querySelectorAll(".quiz-option");

    buttons.forEach((button, buttonIndex) => {
      button.disabled = true;

      if (buttonIndex === item.answer) {
        button.classList.add("correct");
      } else if (buttonIndex === index) {
        button.classList.add("incorrect");
      }
    });

    if (index === item.answer) {
      score++;
      feedback.textContent = `Correct! ${item.explanation}`;
      feedback.classList.add("quiz-feedback-correct");
    } else {
      feedback.textContent =
        `Not quite. The correct answer is "${item.options[item.answer]}". ${item.explanation}`;
      feedback.classList.add("quiz-feedback-incorrect");
    }

    scoreDisplay.textContent = `Score: ${score}`;
    progressFill.style.width =
      `${((currentQuestion + 1) / selectedQuestions.length) * 100}%`;

    nextButton.disabled = false;
  }

  function showResults() {
    panel.hidden = true;
    resultPanel.hidden = false;

    const percentage = Math.round((score / selectedQuestions.length) * 100);

    resultIcon.textContent =
      percentage === 100 ? "🏆" :
      percentage >= 70 ? "🎉" :
      percentage >= 40 ? "💪" : "📚";

    resultTitle.textContent =
      percentage === 100 ? "Perfect Score!" :
      percentage >= 70 ? "Great Job!" :
      percentage >= 40 ? "Good Effort!" : "Keep Practicing!";

    resultText.textContent =
      `You scored ${score} out of ${selectedQuestions.length} (${percentage}%). ` +
      (percentage >= 70
        ? "You're making good progress. Keep learning and building projects!"
        : "Review the explanations and try again to improve your score.");
  }

  nextButton.addEventListener("click", () => {
    if (!answered) return;

    if (currentQuestion === selectedQuestions.length - 1) {
      showResults();
    } else {
      currentQuestion++;
      showQuestion();
    }
  });

  retryButton.addEventListener("click", startQuiz);

  startQuiz();
})();
