const titleElement = document.getElementById("demoTitle");
const descriptionElement = document.getElementById("demoDescription");
const appContainer = document.getElementById("demoApp");
const moduleButtons = document.querySelectorAll(".module-btn");

    const projectFiles = {
    calculator: "./main/calculator.html",
    grade: "./main/grade_calculator.html",
    books: "./main/book_management_system.html",
    health: "./main/health_monitoring_system.html",
    students: "./main/student_management_system.html",
    workout: "./main/workout_planner.html",
    workspace: "./main/workspace.html"
};

function selectProject(key) {
    const project = projects[key];

    if (!project) {
        titleElement.textContent = "Project Not Found";
        descriptionElement.textContent =
            "Select a project from the module menu to continue.";

        appContainer.innerHTML = `
            <div class="app-card">
                <h2>Module Unavailable</h2>
                <p>The requested project does not exist in this demo.</p>
                <button class="app-btn" id="returnCalculator">
                    Open Calculator
                </button>
            </div>
        `;

        document.getElementById("returnCalculator")
            .addEventListener("click", () => selectProject("calculator"));

        return;
    }

    titleElement.textContent = project.title;
    descriptionElement.textContent = project.description;

    moduleButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.app === key
        );
    });

    const url = new URL(window.location.href);
    url.searchParams.set("app", key);
    window.history.replaceState({}, "", url);

    project.render();
}

function renderCalculator() {
    appContainer.innerHTML = `
        <div class="app-card">
            <h2>Scientific Calculator</h2>
            <p>Enter a mathematical expression using numbers and operators.</p>

            <input
                class="app-input"
                id="calcExpression"
                placeholder="Example: (12 + 8) * 3"
                autocomplete="off"
            >

            <button class="app-btn" id="calculateBtn">Calculate</button>
            <button class="app-btn" id="clearCalc">Clear</button>

            <div class="app-result" id="calcResult">Result appears here.</div>
        </div>
    `;

    const input = document.getElementById("calcExpression");
    const result = document.getElementById("calcResult");

    function calculate() {
        const expression = input.value.trim();

        if (!expression) {
            result.textContent = "Enter an expression first.";
            return;
        }

        if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
            result.textContent = "Only numbers and basic arithmetic operators are allowed.";
            return;
        }

        try {
            const answer = Function(
                `"use strict"; return (${expression});`
            )();

            result.textContent = Number.isFinite(answer)
                ? `Result: ${answer}`
                : "The expression does not produce a finite result.";
        } catch {
            result.textContent = "Invalid mathematical expression.";
        }
    }

    document.getElementById("calculateBtn")
        .addEventListener("click", calculate);

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") calculate();
    });

    document.getElementById("clearCalc").addEventListener("click", () => {
        input.value = "";
        result.textContent = "Result appears here.";
        input.focus();
    });
}

function renderGradeCalculator() {
    appContainer.innerHTML = `
        <div class="app-card">
            <h2>Grade Calculator</h2>
            <p>Enter grades separated by commas to calculate their average.</p>

            <input
                class="app-input"
                id="gradeInput"
                placeholder="Example: 90, 85, 92, 88"
            >

            <button class="app-btn" id="calculateGrade">Calculate Average</button>

            <div class="app-result" id="gradeResult">Average appears here.</div>
        </div>
    `;

    document.getElementById("calculateGrade").addEventListener("click", () => {
        const raw = document.getElementById("gradeInput").value.trim();
        const result = document.getElementById("gradeResult");

        const grades = raw.split(",").map(value => value.trim());

        if (!raw || grades.some(value => value === "" || !Number.isFinite(Number(value)))) {
            result.textContent = "Enter valid grades separated by commas.";
            return;
        }

        const numbers = grades.map(Number);

        if (numbers.some(grade => grade < 0 || grade > 100)) {
            result.textContent = "Grades must be between 0 and 100.";
            return;
        }

        const average = numbers.reduce((sum, grade) => sum + grade, 0) / numbers.length;

        result.textContent = `Average: ${average.toFixed(2)}%`;
    });
}

function renderBooks() {
    appContainer.innerHTML = `
        <div class="app-card">
            <h2>Book Management</h2>
            <p>Add books to a collection stored in this browser.</p>

            <input class="app-input" id="bookInput" placeholder="Book title">

            <button class="app-btn" id="addBook">Add Book</button>

            <ul class="app-list" id="bookList"></ul>
        </div>
    `;

    const storageKey = "vincentDemoBooks";
    let books = readStorage(storageKey, []);

    function drawBooks() {
        const list = document.getElementById("bookList");
        list.replaceChildren();

        books.forEach((book, index) => {
            const item = document.createElement("li");
            item.append(document.createTextNode(book + " "));

            const remove = document.createElement("button");
            remove.className = "app-btn";
            remove.textContent = "Remove";
            remove.addEventListener("click", () => {
                books.splice(index, 1);
                saveStorage(storageKey, books);
                drawBooks();
            });

            item.append(remove);
            list.append(item);
        });
    }

    document.getElementById("addBook").addEventListener("click", () => {
        const input = document.getElementById("bookInput");
        const title = input.value.trim();

        if (!title) return;

        books.push(title);
        saveStorage(storageKey, books);
        input.value = "";
        drawBooks();
    });

    drawBooks();
}

function renderHealth() {
    appContainer.innerHTML = `
        <div class="app-card">
            <h2>Health Monitoring Demo</h2>
            <p>This is a simulated dashboard. It does not measure real health data.</p>

            <label for="heartRate">Example heart rate (BPM)</label>
            <input class="app-input" id="heartRate" type="number" min="30" max="220" value="75">

            <label for="sleepHours">Example sleep duration (hours)</label>
            <input class="app-input" id="sleepHours" type="number" min="0" max="24" value="8">

            <button class="app-btn" id="updateHealth">Update Demo</button>

            <div class="app-result" id="healthResult">
                Demo values are ready.
            </div>
        </div>
    `;

    document.getElementById("updateHealth").addEventListener("click", () => {
        const bpm = Number(document.getElementById("heartRate").value);
        const sleep = Number(document.getElementById("sleepHours").value);
        const result = document.getElementById("healthResult");

        if (bpm < 30 || bpm > 220 || sleep < 0 || sleep > 24) {
            result.textContent = "Enter values within the displayed ranges.";
            return;
        }

        result.textContent =
            `Demo heart rate: ${bpm} BPM · Demo sleep: ${sleep} hours. These values are not medical advice.`;
    });
}

function renderStudents() {
    appContainer.innerHTML = `
        <div class="app-card">
            <h2>Student Management</h2>
            <p>Add sample student names to your local browser demo.</p>

            <input class="app-input" id="studentInput" placeholder="Student name">

            <button class="app-btn" id="addStudent">Add Student</button>

            <ul class="app-list" id="studentList"></ul>
        </div>
    `;

    const storageKey = "vincentDemoStudents";
    let students = readStorage(storageKey, []);

    function drawStudents() {
        const list = document.getElementById("studentList");
        list.replaceChildren();

        students.forEach((student, index) => {
            const item = document.createElement("li");
            item.append(document.createTextNode(student + " "));

            const remove = document.createElement("button");
            remove.className = "app-btn";
            remove.textContent = "Delete";
            remove.addEventListener("click", () => {
                students.splice(index, 1);
                saveStorage(storageKey, students);
                drawStudents();
            });

            item.append(remove);
            list.append(item);
        });
    }

    document.getElementById("addStudent").addEventListener("click", () => {
        const input = document.getElementById("studentInput");
        const name = input.value.trim();

        if (!name) return;

        students.push(name);
        saveStorage(storageKey, students);
        input.value = "";
        drawStudents();
    });

    drawStudents();
}

function renderWorkout() {
    appContainer.innerHTML = `
        <div class="app-card">
            <h2>Workout Planner</h2>
            <p>Create a personal checklist of planned activities.</p>

            <input class="app-input" id="workoutInput" placeholder="Example: 20-minute walk">

            <button class="app-btn" id="addWorkout">Add Activity</button>

            <ul class="app-list" id="workoutList"></ul>
        </div>
    `;

    const storageKey = "vincentDemoWorkouts";
    let workouts = readStorage(storageKey, []);

    function drawWorkouts() {
        const list = document.getElementById("workoutList");
        list.replaceChildren();

        workouts.forEach((workout, index) => {
            const item = document.createElement("li");
            item.append(document.createTextNode(workout + " "));

            const remove = document.createElement("button");
            remove.className = "app-btn";
            remove.textContent = "Remove";
            remove.addEventListener("click", () => {
                workouts.splice(index, 1);
                saveStorage(storageKey, workouts);
                drawWorkouts();
            });

            item.append(remove);
            list.append(item);
        });
    }

    document.getElementById("addWorkout").addEventListener("click", () => {
        const input = document.getElementById("workoutInput");
        const workout = input.value.trim();

        if (!workout) return;

        workouts.push(workout);
        saveStorage(storageKey, workouts);
        input.value = "";
        drawWorkouts();
    });

    drawWorkouts();
}

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function saveStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // The demo continues to work for the current session.
    }
}

moduleButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectProject(button.dataset.app);
    });
});

const requestedApp = new URLSearchParams(window.location.search).get("app") || "calculator";

selectProject(requestedApp);