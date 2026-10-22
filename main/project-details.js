
(() => {
  const projects = {
    "student-management": {
      category: "PYTHON PROJECT",
      title: "Student Management System",
      description:
        "A beginner-friendly application for organizing and managing student records.",
      about:
        "The Student Management System is a Python project designed to manage student information through a simple menu-based interface. It demonstrates how programming can organize records and handle user input.",
      features: [
        "Add student records",
        "View saved student information",
        "Store student ID, name, course, and year level",
        "Check for duplicate student IDs",
        "Navigate a text-based menu"
      ],
      learning:
        "This project helps me practice Python syntax, functions, lists, dictionaries, input validation, and basic object-oriented programming concepts.",
      type: "Command-line application",
      technology: "Python",
      status: "Learning project",
      tags: ["Python", "OOP", "CLI", "Student Records"]
    },

    "workout-planner": {
      category: "WEB DEVELOPMENT PROJECT",
      title: "Workout Planner",
      description:
        "A web application for organizing workouts and exercise routines.",
      about:
        "The Workout Planner is a web development project focused on presenting exercise information in a clear and organized interface. It can be expanded to let users choose training goals, equipment, and workout days.",
      features: [
        "Display workout routines",
        "Organize exercises by training day",
        "Show exercise names and training details",
        "Provide a responsive interface",
        "Support future workout customization"
      ],
      learning:
        "This project helps me practice HTML page structure, CSS layouts, JavaScript interactions, and responsive web design.",
      type: "Web application",
      technology: "HTML, CSS, JavaScript",
      status: "Learning project",
      tags: ["HTML", "CSS", "JavaScript", "Responsive Design"]
    },

    "health-monitoring": {
      category: "COMPUTER ENGINEERING PROJECT",
      title: "Health Monitoring System",
      description:
        "A project concept for monitoring heart rate and blood oxygen saturation.",
      about:
        "The Health Monitoring System is a developing project concept that explores how sensors and software could help monitor basic vital signs. The proposed system includes a dashboard for viewing readings and an alert feature for notifying a caregiver when configured conditions are met.",
      features: [
        "Explore heart rate monitoring",
        "Explore blood oxygen saturation (SpO₂) monitoring",
        "Plan a dashboard for displaying readings",
        "Design a possible emergency alert workflow",
        "Explore connections between electronics and software"
      ],
      learning:
        "This project helps me explore programming, electronic sensors, data presentation, and embedded systems. Features should be treated as planned until implemented and tested.",
      type: "Engineering project concept",
      technology: "Planned: ESP32, sensors, web technologies",
      status: "Concept / development",
      tags: ["Computer Engineering", "Sensors", "ESP32", "Health Technology"]
    },

    "book-management": {
      category: "PYTHON PROJECT",
      title: "Book Management System",
      description:
        "An application for organizing and managing book records.",
      about:
        "The Book Management System is a programming project focused on organizing book information. It is intended to make it easier to add, view, search, and update book records.",
      features: [
        "Add new book records",
        "View book information",
        "Search for specific books",
        "Update existing book records",
        "Organize book information"
      ],
      learning:
        "This project helps me practice data management, organizing information, handling user input, and building practical programs.",
      type: "Desktop / console application",
      technology: "Python",
      status: "Learning project",
      tags: ["Python", "CRUD", "Data Management", "Book Records"]
    },

    "scientific-calculator": {
      category: "WEB DEVELOPMENT PROJECT",
      title: "Scientific Calculator",
      description:
        "A web-based calculator for arithmetic and scientific calculations.",
      about:
        "The Scientific Calculator is a web development project designed to perform mathematical calculations through a simple, user-friendly interface. It can support scientific functions useful for mathematics and engineering subjects.",
      features: [
        "Perform addition, subtraction, multiplication, and division",
        "Handle decimal and percentage calculations",
        "Support square roots and powers",
        "Provide interactive calculator buttons",
        "Display calculation results"
      ],
      learning:
        "This project helps me improve my JavaScript skills, understand mathematical operations, process user input, and build interactive web interfaces.",
      type: "Web application",
      technology: "HTML, CSS, JavaScript",
      status: "Learning project",
      tags: ["HTML", "CSS", "JavaScript", "Mathematics"]
    },

    "grade-calculator": {
      category: "WEB DEVELOPMENT PROJECT",
      title: "Grade Calculator",
      description:
        "A web-based tool for calculating grades from entered scores.",
      about:
        "The Grade Calculator is designed to help students calculate their grades more conveniently. Users can enter their scores and, if supported by the application, the corresponding grading weights to calculate a result.",
      features: [
        "Enter quiz, assignment, and exam scores",
        "Calculate grades using supported grading weights",
        "Display the calculated result",
        "Validate user input",
        "Provide a simple and clear interface"
      ],
      learning:
        "This project helps me practice JavaScript calculations, input validation, basic problem-solving, and displaying results dynamically.",
      type: "Web application",
      technology: "HTML, CSS, JavaScript",
      status: "Learning project",
      tags: ["HTML", "CSS", "JavaScript", "Grade Computation"]
    }
  };

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("project");
  const project = projects[projectId];

  const title = document.getElementById("detailTitle");

  if (!title) {
    console.error(
      "Project details page is missing the #detailTitle element."
    );
    return;
  }

  if (!project) {
    document.title = "Project Not Found | Shane Vincent Olavario";

    title.textContent = "Project Not Found";

    document.getElementById("detailDescription").textContent =
      "We couldn't find that project. Please return to the Projects page and select a project.";

    document.getElementById("detailCategory").textContent = "NOT FOUND";

    document.getElementById("detailAbout").textContent =
      "Choose one of the available projects to view its details.";

    document.getElementById("detailFeatures").replaceChildren();
    document.getElementById("detailLearning").textContent = "";
    document.getElementById("detailType").textContent = "—";
    document.getElementById("detailTechnology").textContent = "—";
    document.getElementById("detailStatus").textContent = "Unavailable";
    document.getElementById("detailTags").replaceChildren();

    return;
  }

  document.title = `${project.title} | Shane Vincent Olavario`;

  document.getElementById("detailCategory").textContent =
    project.category;

  title.textContent = project.title;

  document.getElementById("detailDescription").textContent =
    project.description;

  document.getElementById("detailAbout").textContent =
    project.about;

  document.getElementById("detailLearning").textContent =
    project.learning;

  document.getElementById("detailType").textContent =
    project.type;

  document.getElementById("detailTechnology").textContent =
    project.technology;

  document.getElementById("detailStatus").textContent =
    project.status;

  const featureList = document.getElementById("detailFeatures");
  featureList.replaceChildren();

  project.features.forEach((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    featureList.appendChild(item);
  });

  const tags = document.getElementById("detailTags");
  tags.replaceChildren();

  project.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.textContent = tag;
    tags.appendChild(span);
  });
})();
