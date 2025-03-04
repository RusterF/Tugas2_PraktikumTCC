const apiUrl = "http://localhost:5000/notes";

document.addEventListener("DOMContentLoaded", fetchNotes);

function fetchNotes() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("notesContainer");
            container.innerHTML = "";
            data.forEach(note => {
                container.innerHTML += `
                    <div class="col-md-4">
                        <div class="card shadow-sm p-3 mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${note.title}</h5>
                                <p class="card-text">${note.content}</p>
                                <div class="d-flex justify-content-between">
                                    <button class="btn btn-warning btn-sm" 
                                        onclick="openEditModal(${note.id}, '${encodeURIComponent(note.title)}', '${encodeURIComponent(note.content)}')">
                                        Edit
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteNote(${note.id})">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error fetching notes:", error));
}

function addNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!title || !content) {
        alert("Title and content cannot be empty!");
        return;
    }

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    })
    .then(() => {
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";
        fetchNotes();
    })
    .catch(error => console.error("Error adding note:", error));
}

function openEditModal(id, title, content) {
    document.getElementById("editId").value = id;
    document.getElementById("editTitle").value = decodeURIComponent(title);
    document.getElementById("editContent").value = decodeURIComponent(content);
    let editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

function saveEditNote() {
    const id = document.getElementById("editId").value;
    const title = document.getElementById("editTitle").value;
    const content = document.getElementById("editContent").value;

    if (!title || !content) {
        alert("Title and content cannot be empty!");
        return;
    }

    fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    })
    .then(() => {
        fetchNotes();
        let editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        editModal.hide();
    })
    .catch(error => console.error("Error updating note:", error));
}

function deleteNote(id) {
    if (confirm("Are you sure you want to delete this note?")) {
        fetch(`${apiUrl}/${id}`, { method: "DELETE" })
            .then(() => fetchNotes())
            .catch(error => console.error("Error deleting note:", error));
    }
}
