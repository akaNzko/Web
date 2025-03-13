let notes = [];
let currentNoteIndex = null;
let sortBy = "importance";
let sortDirection = "asc";
let filterImportance = "all";
let filterStatus = "all";

document.getElementById("add-note").addEventListener("click", () => {
  openModal();
});

document.getElementById("save-note").addEventListener("click", () => {
  saveNote();
});

document.getElementById("confirm-yes").addEventListener("click", () => {
  deleteNote(currentNoteIndex);
  closeConfirmModal();
});

document.getElementById("confirm-no").addEventListener("click", () => {
  closeConfirmModal();
});

document.getElementById("sort-by").addEventListener("change", (e) => {
  sortBy = e.target.value;
  renderNotes();
});

document.getElementById("sort-direction").addEventListener("change", (e) => {
  sortDirection = e.target.value;
  renderNotes();
});

document.getElementById("filter-importance").addEventListener("change", (e) => {
  filterImportance = e.target.value;
  renderNotes();
});

document.getElementById("filter-status").addEventListener("change", (e) => {
  filterStatus = e.target.value;
  renderNotes();
});

document.getElementById("search").addEventListener("input", (e) => {
  renderNotes(e.target.value);
});

function openModal(index = null) {
  const modal = document.getElementById("note-modal");
  const modalTitle = document.getElementById("modal-title");
  const noteText = document.getElementById("note-text");
  const noteImportance = document.getElementById("note-importance");
  const noteStatus = document.getElementById("note-status");

  if (index !== null) {
    modalTitle.textContent = "Редактировать заметку";
    noteText.value = notes[index].text;
    noteImportance.value = notes[index].importance;
    noteStatus.value = notes[index].status;
    currentNoteIndex = index;
  } else {
    modalTitle.textContent = "Новая заметка";
    noteText.value = "";
    noteImportance.value = "high";
    noteStatus.value = "active";
    currentNoteIndex = null;
  }

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("note-modal");
  modal.style.display = "none";
}

function openConfirmModal(index) {
  const modal = document.getElementById("confirm-modal");
  currentNoteIndex = index;
  modal.style.display = "flex";
}

function closeConfirmModal() {
  const modal = document.getElementById("confirm-modal");
  modal.style.display = "none";
}

function saveNote() {
  const noteText = document.getElementById("note-text").value;
  const noteImportance = document.getElementById("note-importance").value;
  const noteStatus = document.getElementById("note-status").value;

  if (noteText.trim() === "") {
    alert("Заметка не может быть пустой");
    return;
  }

  const note = {
    text: noteText,
    importance: noteImportance,
    status: noteStatus,
    time: new Date().toLocaleString(),
  };

  if (currentNoteIndex !== null) {
    notes[currentNoteIndex] = note;
  } else {
    notes.push(note);
  }

  closeModal();
  renderNotes();
}

function deleteNote(index) {
  notes.splice(index, 1);
  renderNotes();
}

function renderNotes(searchText = "") {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";

  let filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  if (filterImportance !== "all") {
    filteredNotes = filteredNotes.filter(
      (note) => note.importance === filterImportance
    );
  }

  if (filterStatus !== "all") {
    filteredNotes = filteredNotes.filter(
      (note) => note.status === filterStatus
    );
  }

  filteredNotes.sort((a, b) => {
    if (sortBy === "importance") {
      const importanceOrder = { high: 3, medium: 2, low: 1 };
      return sortDirection === "asc"
        ? importanceOrder[a.importance] - importanceOrder[b.importance]
        : importanceOrder[b.importance] - importanceOrder[a.importance];
    } else if (sortBy === "status") {
      const statusOrder = { active: 3, completed: 2, cancelled: 1 };
      return sortDirection === "asc"
        ? statusOrder[a.status] - statusOrder[b.status]
        : statusOrder[b.status] - statusOrder[a.status];
    } else {
      return sortDirection === "asc"
        ? new Date(a.time) - new Date(b.time)
        : new Date(b.time) - new Date(a.time);
    }
  });

  filteredNotes.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note", note.importance);
    noteElement.innerHTML = `
            <div>${note.text}</div>
            <div class="time">Создано: ${note.time}</div>
            <div class="status ${note.status}">${note.status}</div>
            <button onclick="openModal(${index})">Редактировать</button>
            <button onclick="openConfirmModal(${index})">Удалить</button>
        `;
    notesList.appendChild(noteElement);
  });
}

document.querySelector(".close").addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
  const modal = document.getElementById("note-modal");
  const confirmModal = document.getElementById("confirm-modal");
  if (e.target === modal) {
    closeModal();
  }
  if (e.target === confirmModal) {
    closeConfirmModal();
  }
});

renderNotes();
