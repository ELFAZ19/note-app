const noteContainer = document.querySelector(".note-container");
const createBtn = document.querySelector(".create");
const clearBtn = document.querySelector(".clear");
const modeToggle = document.querySelector(".mode-toggle");

function showNotes() {
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
  noteContainer.innerHTML = "";
  savedNotes.forEach((data) => {
    const note = createNote(data.text, data.timestamp, data.pin);
    if (data.pin) noteContainer.prepend(note);
    else noteContainer.appendChild(note);
  });
}

function updateStorage() {
  const notes = Array.from(document.querySelectorAll(".input-box")).map(
    (note) => ({
      text: note.querySelector(".editable").innerText,
      timestamp: note.querySelector(".timestamp").innerText,
      pin: note.querySelector(".pin").classList.contains("active"),
    })
  );
  localStorage.setItem("notes", JSON.stringify(notes));
}

function createNote(
  content = "",
  timestamp = new Date().toLocaleString(),
  isPinned = false
) {
  const inputBox = document.createElement("div");
  inputBox.className = "input-box";

  const editable = document.createElement("div");
  editable.className = "editable";
  editable.contentEditable = true;
  editable.innerText = content;
  editable.placeholder = "Write your note here...";

  const charCount = document.createElement("div");
  charCount.className = "char-count";
  charCount.innerText = `Characters: ${content.length}/200`;

  const timeTag = document.createElement("span");
  timeTag.className = "timestamp";
  timeTag.innerText = timestamp;

  const delBtn = document.createElement("img");
  delBtn.src = "images/delete.png";
  delBtn.classList.add("delete");

  const pinBtn = document.createElement("img");
  pinBtn.src = "images/pin.png";
  pinBtn.classList.add("pin");
  if (isPinned) pinBtn.classList.add("active");

  // Append children
  inputBox.append(editable, charCount, timeTag, delBtn, pinBtn);

  // Keyup
  editable.addEventListener("keyup", () => {
    charCount.innerText = `Characters: ${editable.innerText.length}/200`;
    timeTag.innerText = new Date().toLocaleString();
    updateStorage();
  });

  // Pin Note
  pinBtn.addEventListener("click", () => {
    pinBtn.classList.toggle("active");
    showNotes(); // refresh order
    updateStorage();
  });

  // Delete Note
  delBtn.addEventListener("click", () => {
    inputBox.remove();
    updateStorage();
  });

  return inputBox;
}

// Create new note
createBtn.addEventListener("click", () => {
  const newNote = createNote();
  noteContainer.prepend(newNote);
  newNote.querySelector(".editable").focus();
  updateStorage();
});

// Clear all notes
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all notes?")) {
    localStorage.removeItem("notes");
    noteContainer.innerHTML = "";
  }
});

// Toggle dark mode
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

showNotes();
