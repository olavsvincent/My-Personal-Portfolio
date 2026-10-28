
const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
];

const shortDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const plans = {
    "Upper/Lower": [
        ["Upper", "upper"], ["Lower", "lower"], ["Rest", null],
        ["Upper", "upper"], ["Lower", "lower"], ["Rest", null], ["Rest", null]
    ],
    "Full Body": [
        ["Full Body", "full"], ["Rest", null], ["Full Body", "full"],
        ["Rest", null], ["Full Body", "full"], ["Rest", null], ["Rest", null]
    ],
    "Push/Pull/Legs": [
        ["Push", "push"], ["Pull", "pull"], ["Legs", "legs"],
        ["Rest", null], ["Push", "push"], ["Pull", "pull"], ["Rest", null]
    ],
    "3-Day Split": [
        ["Full Body", "full"], ["Rest", null], ["Upper", "upper"],
        ["Rest", null], ["Lower", "lower"], ["Rest", null], ["Rest", null]
    ]
};

// Exercise format:
// name, muscle groups, sets, reps, rest seconds, icon, description, equipment

const exercises = {
    upper: [
        ["Dumbbell Bench Press", "Chest, Triceps", 3, 10, 90, "↗",
            "Press the weights upward with control.", ["Dumbbells", "Full Gym"]],
        ["One-Arm Dumbbell Row", "Back, Biceps", 3, 10, 75, "⇧",
            "Pull your elbow toward your hip.", ["Dumbbells", "Full Gym"]],
        ["Shoulder Press", "Shoulders", 3, 10, 75, "↑",
            "Press upward without arching your back.", ["Dumbbells", "Barbells", "Full Gym"]],
        ["Push-Ups", "Chest, Triceps", 3, 8, 60, "◇",
            "Keep your body in a straight line.", ["Bodyweight", "Full Gym"]]
    ],

    lower: [
        ["Goblet Squat", "Quads, Glutes", 3, 10, 90, "↓",
            "Keep your feet planted and knees aligned.", ["Dumbbells", "Full Gym"]],
        ["Romanian Deadlift", "Hamstrings, Glutes", 3, 10, 90, "↘",
            "Hinge at the hips while keeping your back neutral.", ["Dumbbells", "Barbells", "Full Gym"]],
        ["Reverse Lunge", "Quads, Glutes", 3, 8, 60, "⇄",
            "Step backward with control.", ["Bodyweight", "Dumbbells", "Full Gym"]],
        ["Glute Bridge", "Glutes", 3, 12, 45, "⌁",
            "Raise your hips without over-arching.", ["Bodyweight", "Resistance Bands"]]
    ],

    full: [
        ["Bodyweight Squat", "Quads, Glutes", 3, 12, 60, "↓",
            "Squat using a comfortable range of motion.", ["Bodyweight", "Full Gym"]],
        ["Push-Ups", "Chest, Triceps", 3, 8, 60, "◇",
            "Use an incline if standard push-ups are difficult.", ["Bodyweight", "Full Gym"]],
        ["Dumbbell Row", "Back, Biceps", 3, 10, 60, "⇧",
            "Pull smoothly without twisting your torso.", ["Dumbbells", "Full Gym"]],
        ["Plank", "Core", 3, 30, 45, "—",
            "Hold your body straight for the listed seconds.", ["Bodyweight"]]
    ],

    push: [
        ["Dumbbell Bench Press", "Chest, Triceps", 3, 10, 90, "↗",
            "Press the weights upward with control.", ["Dumbbells", "Full Gym"]],
        ["Shoulder Press", "Shoulders", 3, 10, 75, "↑",
            "Keep your core tight while pressing.", ["Dumbbells", "Barbells", "Full Gym"]],
        ["Lateral Raise", "Shoulders", 3, 12, 45, "↔",
            "Raise the weights with a slight elbow bend.", ["Dumbbells", "Resistance Bands", "Full Gym"]],
        ["Close-Grip Push-Up", "Triceps, Chest", 2, 8, 60, "◇",
            "Keep your elbows angled backward.", ["Bodyweight", "Full Gym"]]
    ],

    pull: [
        ["Dumbbell Row", "Back, Biceps", 3, 10, 75, "⇧",
            "Pull the weight toward your waist.", ["Dumbbells", "Full Gym"]],
        ["Band Pull-Apart", "Upper Back", 3, 15, 45, "↔",
            "Pull the band apart while keeping your shoulders down.", ["Resistance Bands"]],
        ["Dumbbell Curl", "Biceps", 3, 12, 45, "↟",
            "Keep your elbows close to your body.", ["Dumbbells", "Resistance Bands", "Full Gym"]],
        ["Reverse Fly", "Rear Delts", 2, 12, 45, "✳",
            "Use a light weight and avoid swinging.", ["Dumbbells", "Resistance Bands", "Full Gym"]]
    ],

    legs: [
        ["Goblet Squat", "Quads, Glutes", 3, 10, 90, "↓",
            "Keep your knees aligned with your toes.", ["Dumbbells", "Full Gym"]],
        ["Romanian Deadlift", "Hamstrings, Glutes", 3, 10, 90, "↘",
            "Move from the hips with a neutral back.", ["Dumbbells", "Barbells", "Full Gym"]],
        ["Reverse Lunge", "Quads, Glutes", 2, 8, 60, "⇄",
            "Use controlled steps.", ["Bodyweight", "Dumbbells", "Full Gym"]],
        ["Calf Raise", "Calves", 3, 15, 45, "↑",
            "Pause briefly at the top of each repetition.", ["Bodyweight", "Dumbbells", "Full Gym"]]
    ]
};

const state = {
    goal: "Hypertrophy",
    level: "Beginner",
    split: "Upper/Lower",
    day: 0,
    completed: new Set(),
    settings: {}
};

const $ = selector => document.querySelector(selector);

function getEquipment() {
    return [...document.querySelectorAll(
        ".equipment-grid input:checked"
    )].map(input => input.value);
}

function updateSummary() {
    $("#summary").textContent =
        `${state.goal} · ${state.level} · ${state.split} · ` +
        `${getEquipment().length} equipment option(s)`;
}

// Goal selection
document.querySelectorAll("[data-goal]").forEach(button => {
    button.addEventListener("click", () => {
        state.goal = button.dataset.goal;

        document.querySelectorAll("[data-goal]").forEach(item => {
            item.classList.toggle("selected", item === button);
        });

        updateSummary();
    });
});

// Experience selection
document.querySelectorAll("[data-level]").forEach(button => {
    button.addEventListener("click", () => {
        state.level = button.dataset.level;

        document.querySelectorAll("[data-level]").forEach(item => {
            item.classList.toggle("selected", item === button);
        });

        updateSummary();
    });
});

// Split and equipment selection
$("#split").addEventListener("change", event => {
    state.split = event.target.value;
    updateSummary();
});

document.querySelectorAll(".equipment-grid input").forEach(input => {
    input.addEventListener("change", updateSummary);
});

function getDayPlan(index) {
    return plans[state.split][index];
}

function getSettingKey(index, exercise) {
    return `${state.split}|${index}|${exercise}`;
}

function getExerciseList() {
    const [, type] = getDayPlan(state.day);

    if (!type) return [];

    const equipment = getEquipment();

    let list = exercises[type].filter(exercise =>
        exercise[7].some(item => equipment.includes(item))
    );

    // If no exercise matches the selected equipment,
    // provide bodyweight alternatives.
    if (list.length === 0) {
        list = exercises.full.filter(exercise =>
            exercise[7].includes("Bodyweight")
        );
    }

    return list.map((exercise, index) => {
        const copy = [...exercise];
        const key = getSettingKey(state.day, index);
        const saved = state.settings[key];

        let sets = copy[2];
        let reps = copy[3];
        let rest = copy[4];

        if (state.level === "Advanced") {
            sets = Math.min(5, sets + 1);
        }

        if (state.goal === "Strength") {
            reps = Math.max(5, Math.min(8, reps));
            rest = Math.max(120, rest);
        } else if (state.goal === "Endurance") {
            reps = Math.min(20, reps + 3);
            rest = Math.max(30, rest - 15);
        }

        copy[2] = saved?.sets ?? sets;
        copy[3] = saved?.reps ?? reps;
        copy[4] = saved?.rest ?? rest;

        return copy;
    });
}

// Weekly calendar
function renderWeek() {
    const container = $("#week");
    container.innerHTML = "";

    days.forEach((day, index) => {
        const [focus, type] = getDayPlan(index);
        const button = document.createElement("button");

        button.type = "button";
        button.className =
            `day-card ${index === state.day ? "active" : ""}`;

        button.innerHTML = `
            <small>${shortDays[index]}</small>
            <span>${type ? "✓" : "·"}</span>
            <strong>${focus}</strong>
            <em>${type ? "Workout" : "Recovery"}</em>
        `;

        button.addEventListener("click", () => {
            state.day = index;
            renderWeek();
            renderSession();
        });

        container.appendChild(button);
    });
}

// Build exercise cards without inserting user input into HTML.
function renderSession() {
    const [focus, type] = getDayPlan(state.day);
    const container = $("#exerciseList");

    container.innerHTML = "";

    const isRestDay = !type;
    const list = getExerciseList();

    $("#sessionTitle").textContent = isRestDay
        ? `${days[state.day]}: Recovery Day`
        : `Day ${state.day + 1}: ${focus} Focus`;

    $("#sessionDescription").textContent = isRestDay
        ? "Rest, hydrate, and allow your body to recover."
        : `${state.goal} · ${state.level} training session. Focus on good technique.`;

    $("#duration").textContent = isRestDay
        ? "Rest Day"
        : `${list.reduce((total, exercise) => total + exercise[2] * 3, 5)} min`;

    $("#exerciseCount").textContent =
        `${list.length} exercises`;

    if (isRestDay) {
        const message = document.createElement("div");
        message.className = "panel";
        message.innerHTML = `
            <h3>Rest and Recover</h3>
            <p class="subtitle">
                No workout is scheduled today. Rest, hydrate, and get
                enough sleep before your next session.
            </p>
        `;

        container.appendChild(message);
        updateProgress([]);
        return;
    }

    list.forEach((exercise, index) => {
        const [
            name, muscles, sets, reps, rest, icon, description
        ] = exercise;

        const card = document.createElement("article");
        card.className = "exercise-card";

        // Exercise icon
        const iconBox = document.createElement("div");
        iconBox.className = "exercise-icon";
        iconBox.textContent = icon;

        // Exercise information
        const info = document.createElement("div");
        info.className = "exercise-info";

        const title = document.createElement("h3");
        title.textContent = name;

        const details = document.createElement("p");
        details.textContent = description;

        const badges = document.createElement("div");
        badges.className = "badges";

        muscles.split(", ").forEach(muscle => {
            const badge = document.createElement("span");
            badge.className = "badge";
            badge.textContent = muscle;
            badges.appendChild(badge);
        });

        const restInfo = document.createElement("p");
        restInfo.className = "rest-info";
        restInfo.textContent = `↻ ${rest} seconds rest`;

        info.append(title, details, badges, restInfo);

        // Editable sets and repetitions
        const volume = document.createElement("div");
        volume.className = "volume-controls";

        const settingKey = getSettingKey(state.day, index);

        function createNumberInput(label, value, setting, min, max) {
            const wrapper = document.createElement("label");
            wrapper.textContent = label;

            const input = document.createElement("input");
            input.type = "number";
            input.min = min;
            input.max = max;
            input.value = value;
            input.setAttribute("aria-label", `${name} ${label}`);

            input.addEventListener("change", () => {
                const number = Math.max(
                    min,
                    Math.min(max, Number(input.value) || min)
                );

                input.value = number;

                const previous = state.settings[settingKey] || {
                    sets, reps, rest
                };

                state.settings[settingKey] = {
                    ...previous,
                    [setting]: number
                };

                // Re-render so set buttons match the selected set count.
                renderSession();
            });

            wrapper.appendChild(input);
            return wrapper;
        }

        volume.append(
            createNumberInput("Sets", sets, "sets", 1, 8),
            createNumberInput("Reps", reps, "reps", 1, 100)
        );

        // Completed-set buttons
        const setsArea = document.createElement("div");
        setsArea.className = "sets-area";

        const setsHeading = document.createElement("div");
        setsHeading.className = "sets-heading";

        const heading = document.createElement("span");
        heading.textContent = "COMPLETED SETS";

        const count = document.createElement("span");

        setsHeading.append(heading, count);

        const buttons = document.createElement("div");
        buttons.className = "set-buttons";

        let completedCount = 0;

        for (let set = 0; set < sets; set++) {
            const key = `${settingKey}|${set}`;
            const done = state.completed.has(key);

            if (done) completedCount++;

            const button = document.createElement("button");
            button.type = "button";
            button.className = `set-button ${done ? "done" : ""}`;
            button.textContent = done ? "✓" : `S${set + 1}`;
            button.setAttribute(
                "aria-label",
                `${name}, set ${set + 1}`
            );

            button.addEventListener("click", () => {
                if (state.completed.has(key)) {
                    state.completed.delete(key);
                } else {
                    state.completed.add(key);
                }

                renderSession();
            });

            buttons.appendChild(button);
        }

        count.textContent = `${completedCount}/${sets}`;
        setsArea.append(setsHeading, buttons);

        card.append(iconBox, info, volume, setsArea);
        container.appendChild(card);
    });

    updateProgress(list);
}

// Progress bar
function updateProgress(list = getExerciseList()) {
    let total = 0;
    let completed = 0;

    list.forEach((exercise, index) => {
        const sets = exercise[2];
        const settingKey = getSettingKey(state.day, index);

        total += sets;

        for (let set = 0; set < sets; set++) {
            if (state.completed.has(`${settingKey}|${set}`)) {
                completed++;
            }
        }
    });

    const percentage = total
        ? Math.round((completed / total) * 100)
        : 0;

    $("#progressText").textContent =
        `${completed} of ${total} sets completed`;

    $("#percentage").textContent = `${percentage}%`;
    $("#progressBar").style.width = `${percentage}%`;

    if (percentage === 100 && total > 0) {
        $("#progressMessage").textContent =
            "Workout completed! Great job staying consistent.";
    } else if (completed > 0) {
        $("#progressMessage").textContent =
            "Nice work! Keep going at your own pace.";
    } else {
        $("#progressMessage").textContent =
            "Start with a warm-up before your first exercise.";
    }
}

// Generate a new routine
$("#generate").addEventListener("click", () => {
    state.day = 0;
    state.completed.clear();
    state.settings = {};

    renderWeek();
    renderSession();

    $("#schedule").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Reset the selected day
$("#reset").addEventListener("click", () => {
    const prefix = `${state.split}|${state.day}|`;

    for (const key of state.completed) {
        if (key.startsWith(prefix)) {
            state.completed.delete(key);
        }
    }

    Object.keys(state.settings).forEach(key => {
        if (key.startsWith(prefix)) {
            delete state.settings[key];
        }
    });

    renderSession();
});

// Finish workout
$("#finish").addEventListener("click", () => {
    const [focus] = getDayPlan(state.day);

    if (focus === "Rest") {
        alert("Today is your scheduled recovery day.");
        return;
    }

    const list = getExerciseList();

    let total = 0;
    let completed = 0;

    list.forEach((exercise, index) => {
        const settingKey = getSettingKey(state.day, index);

        total += exercise[2];

        for (let set = 0; set < exercise[2]; set++) {
            if (state.completed.has(`${settingKey}|${set}`)) {
                completed++;
            }
        }
    });

    if (total > 0 && completed === total) {
        alert("Workout completed! Great job!");
    } else {
        alert(
            `You've completed ${completed} of ${total} sets. ` +
            "You can continue your workout when you're ready."
        );
    }
});

// Initial display
updateSummary();
renderWeek();
renderSession();
