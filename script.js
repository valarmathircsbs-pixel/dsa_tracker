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
const sortSelect = document.getElementById("sortSelect");

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

// ADD UI
function addToUI(problem) {

    if (!problem.topic) problem.topic = "General";

    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = `${problem.name} (${problem.difficulty} • ${problem.topic})`;

    if (problem.solved) name.classList.add("solved");

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const solveBtn = document.createElement("button");
    solveBtn.textContent = "✔️";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";

    actions.appendChild(solveBtn);
    actions.appendChild(deleteBtn);
    actions.appendChild(editBtn);

    li.appendChild(name);
    li.appendChild(actions);
    list.appendChild(li);

    total++;
    totalCount.textContent = total;

    if (problem.difficulty === "Easy") easy++, easyCount.textContent = easy;
    else if (problem.difficulty === "Medium") medium++, mediumCount.textContent = medium;
    else hard++, hardCount.textContent = hard;

    updateProgress();
    updateEmptyState();

    solveBtn.onclick = () => {
        problem.solved = !problem.solved;
        name.classList.toggle("solved");
        saveData();
        updateProgress();
    };

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

    editBtn.onclick = () => {
        const newName = prompt("Edit problem name:", problem.name);
        const newDifficulty = prompt("Edit difficulty:", problem.difficulty);
        const newTopic = prompt("Edit topic:", problem.topic);

        if (newName) problem.name = newName;
        if (newDifficulty) problem.difficulty = newDifficulty;
        if (newTopic) problem.topic = newTopic;

        saveData();

        list.innerHTML = "";
        total = easy = medium = hard = 0;
        problems.forEach(addToUI);
    };
}

// ADD
button.onclick = () => {
    const name = input.value.trim();

    if (!name) return;

    const exists = problems.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        alert("Problem already exists!");
        return;
    }

    const p = {
        name: name,
        difficulty: select.value,
        topic: topicSelect.value,
        solved: false
    };

    problems.push(p);
    saveData();
    addToUI(p);

    input.value = "";
    input.focus();
    searchInput.value = "";
};

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

// SORT
sortSelect.addEventListener("change", function () {
    sortProblems(this.value);
});

function sortProblems(type) {
    if (type === "name") {
        problems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === "difficulty") {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        problems.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    } else if (type === "solved") {
        problems.sort((a, b) => b.solved - a.solved);
    }

    list.innerHTML = "";
    total = easy = medium = hard = 0;
    problems.forEach(addToUI);
}

// FILTERS
function filterProblems(event, type) {
    list.innerHTML = "";
    total = easy = medium = hard = 0;

    problems.forEach(p => {
        if (type === "All" || p.difficulty === type) {
            addToUI(p);
        }
    });
}

function filterStatus(event, type) {
    list.innerHTML = "";
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

function filterTopic(event, type) {
    list.innerHTML = "";
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

loadData();