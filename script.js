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

let problems = [];
let editIndex = null;

// SAVE
function saveData() {
    localStorage.setItem("problems", JSON.stringify(problems));
}

// LOAD
function loadData() {
    const data = localStorage.getItem("problems");
    if (data) problems = JSON.parse(data);
    render();
}

// RENDER
function render(data = problems) {
    list.innerHTML = "";

    let total = 0, easy = 0, medium = 0, hard = 0;

    data.forEach((p, index) => {

        const li = document.createElement("li");

        const name = document.createElement("span");
        name.textContent = `${p.name} (${p.difficulty} • ${p.topic})`;

        if (p.solved) name.classList.add("solved");

        const actions = document.createElement("div");

        const solveBtn = document.createElement("button");
        solveBtn.textContent = "✔️";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";

        actions.append(solveBtn, deleteBtn, editBtn);
        li.append(name, actions);
        list.appendChild(li);

        total++;
        if (p.difficulty === "Easy") easy++;
        else if (p.difficulty === "Medium") medium++;
        else hard++;

        solveBtn.onclick = () => {
            p.solved = !p.solved;
            saveData();
            render();
        };

        deleteBtn.onclick = () => {
            if (confirm("Delete this problem?")) {
                problems.splice(index, 1);
                saveData();
                render();
            }
        };

        editBtn.onclick = () => openModal(index);
    });

    totalCount.textContent = total;
    easyCount.textContent = easy;
    mediumCount.textContent = medium;
    hardCount.textContent = hard;

    updateProgress(total);
    document.getElementById("emptyMsg").style.display = problems.length ? "none" : "block";
}

// ADD
button.onclick = () => {
    const name = input.value.trim();
    if (!name) return;

    problems.push({
        name,
        difficulty: select.value,
        topic: topicSelect.value,
        solved: false
    });

    input.value = "";
    input.focus();
    searchInput.value = "";

    saveData();
    render();
};

// SEARCH
searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    render(problems.filter(p => p.name.toLowerCase().includes(q)));
});

// SORT
sortSelect.addEventListener("change", () => {
    const type = sortSelect.value;

    if (type === "name") problems.sort((a,b)=>a.name.localeCompare(b.name));
    else if (type === "difficulty") {
        const order = {Easy:1,Medium:2,Hard:3};
        problems.sort((a,b)=>order[a.difficulty]-order[b.difficulty]);
    }
    else if (type === "solved") problems.sort((a,b)=>b.solved-a.solved);

    render();
});

// FILTERS
function filterProblems(e,type){
    render(type==="All"?problems:problems.filter(p=>p.difficulty===type));
}
function filterStatus(e,type){
    render(type==="All"?problems:
        problems.filter(p=>type==="Solved"?p.solved:!p.solved));
}
function filterTopic(e,type){
    render(type==="All"?problems:problems.filter(p=>p.topic===type));
}

// CLEAR
function clearAll(){
    if(confirm("Clear all data?")){
        problems=[];
        localStorage.clear();
        render();
    }
}

// MODAL
function openModal(i){
    editIndex=i;
    const p=problems[i];

    editName.value=p.name;
    editDifficulty.value=p.difficulty;
    editTopic.value=p.topic;

    editModal.style.display="flex";
}
function closeModal(){
    editModal.style.display="none";
}
function saveEdit(){
    const p=problems[editIndex];

    p.name=editName.value;
    p.difficulty=editDifficulty.value;
    p.topic=editTopic.value;

    saveData();
    closeModal();
    render();
}

// PROGRESS
function updateProgress(total){
    const solved=problems.filter(p=>p.solved).length;
    const percent=total?Math.round((solved/total)*100):0;

    document.getElementById("progress").style.width=percent+"%";
    document.getElementById("percentText").textContent="Solved: "+percent+"%";
}

// DARK MODE
function toggleDarkMode(){
    document.body.classList.toggle("dark");
}

// START
loadData();