const noteContainer = document.querySelector(".note-container");
const createBtn = document.querySelector(".create");
const clearBtn = document.querySelector(".clear");
const modeToggle = document.querySelector(".mode-toggle");
const searchInput = document.querySelector("#searchInput");
const importBtn = document.querySelector(".import");
const exportBtn = document.querySelector(".export");

function showNotes() {
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

  const pinned = savedNotes.filter((n) => n.pin);
  const others = savedNotes.filter((n) => !n.pin);
  const allNotes = [...pinned, ...others];

  noteContainer.innerHTML = "";
  allNotes.forEach((data) => {
    const note = createNote(data);
    noteContainer.appendChild(note);
  });
}

function updateStorage() {
  const notes = Array.from(document.querySelectorAll(".input-box")).map(
    (note) => ({
      text: note.querySelector(".editable").innerText,
      timestamp: note.querySelector(".timestamp").innerText,
      pin: note.querySelector(".pin").classList.contains("active"),
      lock: note.querySelector(".lock").classList.contains("active"),
      tag: note.querySelector(".tag")?.innerText || "",
      color: note.style.backgroundColor || "",
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
  editable.contentEditable = !lock;
  editable.innerText = text;

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

  inputBox.append(
    editable,
    charCount,
    timeTag,
    delBtn,
    pinBtn,
    lockBtn,
    tagBtn
  );

  editable.addEventListener("keyup", () => {
    charCount.innerText = `Characters: ${editable.innerText.length}/200`;
    timeTag.innerText = new Date().toLocaleString();
    updateStorage();
  });

  pinBtn.addEventListener("click", () => {
    pinBtn.classList.toggle("active");
    updateStorage();
    showNotes();
  });

  lockBtn.addEventListener("click", () => {
    lockBtn.classList.toggle("active");
    editable.contentEditable = !editable.isContentEditable;
    updateStorage();
  });

  tagBtn.addEventListener("click", () => {
    const newTag = prompt("Enter tag:");
    if (newTag) {
      tagBtn.innerText = newTag;
      updateStorage();
    }
  });

  delBtn.addEventListener("click", () => {
    inputBox.remove();
    updateStorage();
  });

  return inputBox;
}

createBtn.addEventListener("click", () => {
  const newNote = createNote({});
  noteContainer.prepend(newNote);
  newNote.querySelector(".editable").focus();
  updateStorage();
});

clearBtn.addEventListener("click", () => {
  if (confirm("Delete all notes?")) {
    localStorage.removeItem("notes");
    noteContainer.innerHTML = "";
  }
});

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

importBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.click();
  input.addEventListener("change", () => {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      localStorage.setItem("notes", JSON.stringify(data));
      showNotes();
    };
    reader.readAsText(file);
  });
});

exportBtn.addEventListener("click", () => {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const blob = new Blob([JSON.stringify(notes)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "notes.json";
  link.click();
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const notes = document.querySelectorAll(".input-box");
  notes.forEach((note) => {
    const content = note.querySelector(".editable").innerText.toLowerCase();
    note.style.display = content.includes(query) ? "block" : "none";
  });
});

showNotes();
