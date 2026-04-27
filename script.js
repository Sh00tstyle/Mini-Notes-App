const button = document.getElementById("addTaskBtn");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const counter = document.getElementById("taskCounter");
const temp = document.getElementById("taskTemplate");

const dataStorageID = "data";
let data = [];

document.addEventListener("DOMContentLoaded", () => {
    readFromFile();
    detectButtonState();
    render();
});

button.addEventListener("click", submit);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        submit();
    }
});

input.addEventListener("input", detectButtonState);

list.addEventListener("click", (event) => {
    const listItem = event.target.closest("li");

    if (!listItem) return;

    const deleteButton = event.target.closest(".delete");
    const textElement = listItem.querySelector(".taskText");

    if (deleteButton) {
        removeTaskItem(textElement.textContent);
    } else {
        toggleCompleted(textElement.textContent);
    }

    render();
});

function submit() {
    addTaskItem(input.value.trim());
    resetInput();
    detectButtonState();
    render();
}

function detectButtonState() {
    if (input.value.trim() === "") {
        button.disabled = true;
    }
    else {
        button.disabled = false;
    }
}

function getIndexByText(taskText) {
    if (taskText === "") return -1;

    for (let i = 0; i < data.length; i++) {
        if (data[i].text === taskText) return i;
    }

    return -1;
}

function addTaskItem(taskText) {
    if (taskText === "" || getIndexByText(taskText) >= 0) return;

    data.push({completed: false, text: taskText});
    saveToFile();
}

function removeTaskItem(taskText) {
    const taskIndex = getIndexByText(taskText);

    if (taskIndex < 0) return;

    data.splice(taskIndex, 1);
    saveToFile();
}

function toggleCompleted(taskText) {
    const taskIndex = getIndexByText(taskText);

    if (taskIndex < 0) return;

    data[taskIndex].completed = !data[taskIndex].completed;
    saveToFile();
}

function resetInput() {
    input.value = "";
    input.focus();
}

function render() {
    list.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const clone = temp.content.cloneNode(true);
        const listItem = clone.querySelector("li");
        const textElement = listItem.querySelector(".taskText");

        textElement.textContent = data[i].text;

        if (data[i].completed)
            listItem.classList.add("completed");

        list.appendChild(listItem);
    }

    counter.textContent = data.length;
}

function saveToFile() {
    const jsonText = JSON.stringify(data);

    localStorage.setItem(dataStorageID, jsonText);
}

function readFromFile() {
    const jsonText = localStorage.getItem(dataStorageID);

    if (!jsonText) return;

    try {
        data = JSON.parse(jsonText);

        if(!Array.isArray(data)) {
            data = [];
            return;
        }

        // Returns all objects in the array that meet the filter conditions (validation)
        data = data.filter(item => 
            item !== null &&
            typeof item === 'object' &&
            typeof item.text === 'string' &&
            typeof item.completed === 'boolean'
        );
    }
    catch {
        data = [];
    }
}