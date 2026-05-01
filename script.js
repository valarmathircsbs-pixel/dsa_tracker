// ELEMENTS
const input = document.getElementById("problemInput");
const select = document.getElementById("difficultySelect");
const topicSelect = document.getElementById("topicSelect");
const button = document.getElementById("addBtn");
const list = document.getElementById("problemList");

const totalCount = document.getElementById("totalCount");
const easyCount = document.getElementById("easyCount");
const mediumCount = document.getElementById("mediumCount");
const hardCount = document.getElementById("hardCount");

const searchInput = document.getElementById("searchInput");

// DATA
let total = 0, easy = 0, medium = 0, hard = 0;
let problems = [];

// SAVE
function saveData() {
    localStorage.setItem("problems", JSON.stringify(problems));
}

// EMPTY STATE
function updateEmptyState() {
    document.getElementById("emptyMsg").style.display =
        problems.length === 0 ? "block" : "none";
}

// PROGRESS
function updateProgress() {
    const solved = problems.filter(p => p.solved).length;
    const percent = total === 0 ? 0 : (solved / total) * 100;
    document.getElementById("progress").style.width = percent + "%";
}

// ADD TO UI
function addToUI(problem) {

    // Fix old data
    if (!problem.topic) problem.topic = "General";

    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = `${problem.name} (${problem.difficulty} • ${problem.topic})`;

    if (problem.solved) name.classList.add("solved");

    const actions = document.createElement("div");
    actions.classList.add("actions");

    // BUTTONS
    const solveBtn = document.createElement("button");
    solveBtn.textContent = "✔️";
    solveBtn.classList.add("solve-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-btn");

    // APPEND
    actions.appendChild(solveBtn);
    actions.appendChild(deleteBtn);
    actions.appendChild(editBtn);

    li.appendChild(name);
    li.appendChild(actions);
    list.appendChild(li);

    // COUNTS
    total++;
    totalCount.textContent = total;

    if (problem.difficulty === "Easy") easy++, easyCount.textContent = easy;
    else if (problem.difficulty === "Medium") medium++, mediumCount.textContent = medium;
    else hard++, hardCount.textContent = hard;

    updateProgress();
    updateEmptyState();

    // SOLVE
    solveBtn.onclick = () => {
        problem.solved = !problem.solved;
        name.classList.toggle("solved");
        saveData();
        updateProgress();
    };

    // DELETE
    deleteBtn.onclick = () => {
        list.removeChild(li);
        problems = problems.filter(p => p !== problem);
        saveData();

        total--;
        totalCount.textContent = total;

        if (problem.difficulty === "Easy") easy--, easyCount.textContent = easy;
        else if (problem.difficulty === "Medium") medium--, mediumCount.textContent = medium;
        else hard--, hardCount.textContent = hard;

        updateProgress();
        updateEmptyState();
    };

    // EDIT (FIXED)
    editBtn.onclick = () => {
        const newName = prompt("Edit problem name:", problem.name);
        const newDifficulty = prompt("Edit difficulty (Easy/Medium/Hard):", problem.difficulty);
        const newTopic = prompt("Edit topic (Arrays/Strings/Trees/Graphs):", problem.topic);

        if (newName) problem.name = newName;
        if (newDifficulty) problem.difficulty = newDifficulty;
        if (newTopic) problem.topic = newTopic;

        saveData();

        // refresh UI
        list.innerHTML = "";
        total = easy = medium = hard = 0;
        problems.forEach(addToUI);
    };
}

// ADD
button.onclick = () => {
    const name = input.value.trim();

    if (!name) {
        alert("Enter problem name");
        return;
    }

    const exists = problems.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        alert("Problem already exists!");
        return;
    }

    const p = {
        name: name,
        difficulty: select.value,
        topic: topicSelect ? topicSelect.value : "General",
        solved: false
    };

    problems.push(p);
    saveData();
    addToUI(p);

    input.value = "";
};

// ENTER KEY
input.addEventListener("keypress", e => {
    if (e.key === "Enter") button.click();
});

// SEARCH
searchInput.addEventListener("input", function () {
    searchProblems(this.value);
});

function searchProblems(query) {
    list.innerHTML = "";
    total = easy = medium = hard = 0;

    problems.forEach(p => {
        if (p.name.toLowerCase().includes(query.toLowerCase())) {
            addToUI(p);
        }
    });
}

// FILTER DIFFICULTY
function filterProblems(event, type) {
    list.innerHTML = "";

    document.querySelectorAll(".filters button").forEach(btn => {
        btn.classList.remove("active");
    });

    event.target.classList.add("active");

    total = easy = medium = hard = 0;

    problems.forEach(p => {
        if (type === "All" || p.difficulty === type) {
            addToUI(p);
        }
    });
}

// FILTER STATUS
function filterStatus(event, type) {
    list.innerHTML = "";

    document.querySelectorAll(".filters button").forEach(btn => {
        btn.classList.remove("active");
    });

    event.target.classList.add("active");

    total = easy = medium = hard = 0;

    problems.forEach(p => {
        if (
            type === "All" ||
            (type === "Solved" && p.solved) ||
            (type === "Unsolved" && !p.solved)
        ) {
            addToUI(p);
        }
    });
}

// FILTER TOPIC
function filterTopic(event, type) {
    list.innerHTML = "";

    document.querySelectorAll(".filters button").forEach(btn => {
        btn.classList.remove("active");
    });

    event.target.classList.add("active");

    total = easy = medium = hard = 0;

    problems.forEach(p => {
        if (type === "All" || p.topic === type) {
            addToUI(p);
        }
    });
}

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// LOAD
function loadData() {
    const data = localStorage.getItem("problems");

    if (data) {
        problems = JSON.parse(data);
        problems.forEach(addToUI);
    }

    updateEmptyState();
}

// START
loadData();