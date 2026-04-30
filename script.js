const input = document.getElementById("problemInput");
const select = document.getElementById("difficultySelect");
const button = document.getElementById("addBtn");
const list = document.getElementById("problemList");

const totalCount = document.getElementById("totalCount");
const easyCount = document.getElementById("easyCount");
const mediumCount = document.getElementById("mediumCount");
const hardCount = document.getElementById("hardCount");

let total = 0, easy = 0, medium = 0, hard = 0;
let problems = [];

// Save
function saveData() {
    localStorage.setItem("problems", JSON.stringify(problems));
}

// Empty state
function updateEmptyState() {
    document.getElementById("emptyMsg").style.display =
        problems.length === 0 ? "block" : "none";
}

// Progress
function updateProgress() {
    const solved = problems.filter(p => p.solved).length;
    const percent = total === 0 ? 0 : (solved / total) * 100;
    document.getElementById("progress").style.width = percent + "%";
}

// Add UI
function addToUI(problem) {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = `${problem.name} (${problem.difficulty})`;

    if (problem.solved) name.classList.add("solved");

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const solveBtn = document.createElement("button");
    solveBtn.textContent = "✔️";
    solveBtn.classList.add("solve-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");

    actions.appendChild(solveBtn);
    actions.appendChild(deleteBtn);

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
}

// Add
button.onclick = () => {
    const name = input.value.trim();
    if (!name) return;

    const exists = problems.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        alert("Problem already exists!");
        return;
    }

    const p = { name, difficulty: select.value, solved: false };

    problems.push(p);
    saveData();
    addToUI(p);
    input.value = "";
};

// Enter key
input.addEventListener("keypress", e => {
    if (e.key === "Enter") button.click();
});

// Load
function loadData() {
    const data = localStorage.getItem("problems");
    if (data) {
        problems = JSON.parse(data);
        problems.forEach(addToUI);
    }
    updateEmptyState();
}

// Filter
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

// Dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// Start
loadData();