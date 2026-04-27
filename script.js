const button = document.getElementById("addNoteButton");
const titleInput = document.getElementById("noteTitleInput");
const textInput = document.getElementById("noteTextInput");
const list = document.getElementById("noteList");
const template = document.getElementById("noteTemplate");

const dataStorageID = "data";
let data = [];

document.addEventListener("DOMContentLoaded", () => {
    readFromFile();
    detectButtonState();
    render();
});

button.addEventListener("click", submit);

titleInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        submit();
    }
});

list.addEventListener("click", (event) => {
    const article = event.target.closest("article");

    if (!article) return;

    const deleteButton = event.target.closest(".delete");
    
    if (deleteButton) {
        const titleElement = article.querySelector(".noteTitle");

        removeNoteItem(titleElement.textContent);
        event.stopPropagation();
    }
});

titleInput.addEventListener("input", detectButtonState);

textInput.addEventListener("input", detectButtonState);

function submit() {
    addNoteItem(titleInput.value.trim(), textInput.value.trim());
    resetInput();
    detectButtonState();
}

function detectButtonState() {
    if (titleInput.value.trim() !== "" && textInput.value.trim() !== "") {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}

function getIndexByTitle(noteTitle) {
    if (noteTitle === "") return -1;

    for (let i = 0; i < data.length; i++) {
        if (data[i].title === noteTitle) return i;
    }

    return -1;
}

function addNoteItem(noteTitle, noteText) {
    if (noteTitle === "" || noteText === "" || getIndexByTitle(noteTitle) >= 0) return;

    data.push({title: noteTitle, text: noteText});
    saveToFile();
    render();
}

function removeNoteItem(noteTitle) {
    const noteIndex = getIndexByTitle(noteTitle);

    if (noteIndex < 0) return;

    data.splice(noteIndex, 1);
    saveToFile();
    render();
}

function resetInput() {
    titleInput.value = "";
    textInput.value = "";
    titleInput.focus();
}

function render() {
    list.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const clone = template.content.cloneNode(true);
        const titleElement = clone.querySelector(".noteTitle");
        const textElement = clone.querySelector(".noteText");

        titleElement.textContent = data[i].title;
        textElement.textContent = data[i].text;

        list.appendChild(clone);
    }
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
            typeof item.title === 'string' &&
            typeof item.text === 'string'
        );
    }
    catch {
        data = [];
    }
}