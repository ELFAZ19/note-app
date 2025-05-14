const noteContainer = document.querySelector(".note-container");
const createBtn = document.querySelector(".create");
const clearBtn = document.querySelector(".clear");
const modeToggle = document.querySelector(".mode-toggle");
const searchInput = document.querySelector("#searchInput");
const importBtn = document.querySelector(".import");
const exportBtn = document.querySelector(".export");

function showNotes() {
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
  noteContainer.innerHTML = "";
  savedNotes.forEach((data) => {
    const note = createNote(data);
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
      lock: note.querySelector(".lock").classList.contains("active"),
      tag: note.querySelector(".tag")
        ? note.querySelector(".tag").innerText
        : "",
      color: note.style.backgroundColor,
    })
  );
  localStorage.setItem("notes", JSON.stringify(notes));
}

function createNote({
  text = "",
  timestamp = new Date().toLocaleString(),
  pin = false,
  lock = false,
  tag = "",
  color = "",
}) {
  const inputBox = document.createElement("div");
  inputBox.className = "input-box";
  inputBox.style.backgroundColor = color;

  const editable = document.createElement("div");
  editable.className = "editable";
  editable.contentEditable = true;
  editable.innerText = text;
  editable.placeholder = "Write your note here...";

  const charCount = document.createElement("div");
  charCount.className = "char-count";
  charCount.innerText = `Characters: ${text.length}/200`;

  const timeTag = document.createElement("span");
  timeTag.className = "timestamp";
  timeTag.innerText = timestamp;

  const delBtn = document.createElement("img");
  delBtn.src = "images/delete.png";
  delBtn.classList.add("delete");

  const pinBtn = document.createElement("img");
  pinBtn.src = "images/pin.png";
  pinBtn.classList.add("pin");
  if (pin) pinBtn.classList.add("active");

  const lockBtn = document.createElement("img");
  lockBtn.src = "images/lock.png";
  lockBtn.classList.add("lock");
  if (lock) lockBtn.classList.add("active");

  const tagBtn = document.createElement("div");
  tagBtn.classList.add("tag");
  tagBtn.innerText = tag || "Tag";

  // Append children
  inputBox.append(
    editable,
    charCount,
    timeTag,
    delBtn,
    pinBtn,
    lockBtn,
    tagBtn
  );

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

  // Lock Note
  lockBtn.addEventListener("click", () => {
    lockBtn.classList.toggle("active");
    updateStorage();
  });

  // Tag Note
  tagBtn.addEventListener("click", () => {
    const newTag = prompt("Enter a tag for this note:");
    if (newTag) {
      tagBtn.innerText = newTag;
      updateStorage();
    }
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
  const newNote = createNote({});
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

// Import Notes (from JSON file)
importBtn.addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.click();

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const importedNotes = JSON.parse(e.target.result);
      localStorage.setItem("notes", JSON.stringify(importedNotes));
      showNotes();
    };

    reader.readAsText(file);
  });
});

// Export Notes (to JSON file)
exportBtn.addEventListener("click", () => {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const blob = new Blob([JSON.stringify(notes)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "notes.json";
  link.click();
});

// Search Notes
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const notes = document.querySelectorAll(".input-box");

  notes.forEach((note) => {
    const content = note.querySelector(".editable").innerText.toLowerCase();
    note.style.display = content.includes(query) ? "block" : "none";
  });
});

showNotes();
