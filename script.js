const button = document.getElementById("addNoteButton");
const titleInput = document.getElementById("noteTitleInput");
const textInput = document.getElementById("noteTextInput");
const listInfo = document.getElementById("listInfo");
const list = document.getElementById("noteList");
const template = document.getElementById("noteTemplate");

const dataStorageID = "data";
let data = [];

const nextIDStorageID = "nextID";
let nextID = 0;

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
        removeNoteItem(Number(article.dataset.id));
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

function getIndexByID(noteID) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === noteID) return i;
    }

    return -1;
}

function addNoteItem(noteTitle, noteText) {
    if (noteTitle === "" || noteText === "") return;

    data.push({id: nextID, title: noteTitle, text: noteText});
    nextID++;

    saveToFile();
    render();
}

function removeNoteItem(noteID) {
    const noteIndex = getIndexByID(noteID);

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

    listInfo.hidden = data.length > 0;

    for (let i = data.length - 1; i >= 0; i--) {
        const clone = template.content.cloneNode(true);
        const articleElement = clone.querySelector("article");
        const titleElement = clone.querySelector(".noteTitle");
        const textElement = clone.querySelector(".noteText");

        articleElement.dataset.id = data[i].id;
        titleElement.textContent = data[i].title;
        textElement.textContent = data[i].text;

        list.appendChild(clone);
    }
}

function saveToFile() {
    const jsonData = JSON.stringify(data);
    const jsonNextID = JSON.stringify(nextID);

    localStorage.setItem(dataStorageID, jsonData);
    localStorage.setItem(nextIDStorageID, jsonNextID);
}

function readFromFile() {
    const jsonData = localStorage.getItem(dataStorageID);
    const jsonNextID = localStorage.getItem(nextIDStorageID);

    if (!jsonData) return;

    try {
        data = JSON.parse(jsonData);

        if(!Array.isArray(data)) {
            data = [];
            nextID = 0;
            return;
        }

        // Returns all objects in the array that meet the filter conditions (validation)
        data = data.filter(item => 
            item !== null &&
            typeof item === 'object' &&
            typeof item.id === 'number' &&
            typeof item.title === 'string' &&
            typeof item.text === 'string'
        );

        if(!jsonNextID) {
            let highestUsedID = -1;
            
            for(let i = 0; i < data.length; i++) {
                if(data[i].id > highestUsedID)
                    highestUsedID = data[i].id;
            }
            
            nextID = highestUsedID + 1;
        } else {
            nextID = JSON.parse(jsonNextID);
        }
    }
    catch {
        data = [];
        nextID = 0;
    }
}