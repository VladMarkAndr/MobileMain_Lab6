document.addEventListener("DOMContentLoaded", async () => {
    let notes = [];
    try {
        const res = await fetch("data/users.json");
        const data = await res.json();
        notes = data.notes || [];
    } catch (e) {
        notes = [
            { id: 1, category: "Research", title: "Doc", url: "http://localhost", description: "Important!!!", urgent: true, icon: "📁" },
            { id: 2, category: "Work", title: "Tab Keeper", url: "http://localhost/app", description: "Active session.", urgent: false, icon: "🚀" }
        ];
    }

    const grid = document.getElementById("notes-grid");
    const searchInput = document.getElementById("search-input");
    const filtersContainer = document.getElementById("filters-container");

    const modalOverlay = document.getElementById("modal-overlay");
    const btnOpenModal = document.getElementById("btn-open-modal");
    const modalClose = document.getElementById("modal-close");
    const modalCancel = document.getElementById("modal-cancel");
    const createNoteForm = document.getElementById("create-note-form");
    
    const modalTitleInput = document.getElementById("modal-title");
    const modalUrlInput = document.getElementById("modal-url");
    const modalCategorySelect = document.getElementById("modal-category");
    const modalDescInput = document.getElementById("modal-desc");
    
    const previewTitle = document.getElementById("preview-title");
    const previewIcon = document.getElementById("preview-icon");
    const iconButtons = document.querySelectorAll(".icon-btn");

    let selectedIcon = "📁";

    function render(items) {
        grid.innerHTML = "";
        items.forEach(note => {
            const card = document.createElement("div");
            card.className = "note-card";
            card.innerHTML = `
                <div>
                    <div class="note-header">
                        <span class="badge-tag badge-${note.category.toLowerCase()}">${note.icon || '📁'} ${note.category}</span>
                        <div class="note-actions">
                            ${note.urgent ? '<span style="color:#ef4444; font-size:0.75rem; font-weight:700;">Urgent</span>' : ''}
                            <button onclick="editNote(${note.id})" style="background:none; color:inherit; cursor:pointer;" title="Изменить">✏️</button>
                            <button onclick="deleteNote(${note.id})" style="background:none; color:inherit; cursor:pointer;" title="Удалить">🗑️</button>
                        </div>
                    </div>
                    <div class="note-content" style="margin-top: 0.75rem;">
                        <h3>${note.title}</h3>
                        <a href="${note.url}" target="_blank">${note.url}</a>
                        <div class="note-desc">${note.description || 'No description provided.'}</div>
                    </div>
                </div>
                <div class="note-footer">
                    <span>Added to session</span>
                    <a href="${note.url}" target="_blank" class="btn-open-link">Open ↗</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    render(notes);

    btnOpenModal.addEventListener("click", () => {
        modalOverlay.style.display = "flex";
    });

    function closeModal() {
        modalOverlay.style.display = "none";
        createNoteForm.reset();
        previewTitle.textContent = "Marketing Campaign";
        previewIcon.textContent = "📁";
    }

    modalClose.addEventListener("click", closeModal);
    modalCancel.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Живой предпросмотр в поп-апе
    modalTitleInput.addEventListener("input", (e) => {
        previewTitle.textContent = e.target.value || "New Tab Name";
    });

    iconButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            iconButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedIcon = btn.getAttribute("data-icon");
            previewIcon.textContent = selectedIcon;
        });
    });

    createNoteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newNote = {
            id: Date.now(),
            title: modalTitleInput.value.trim(),
            url: modalUrlInput.value.trim(),
            category: modalCategorySelect.value,
            description: modalDescInput.value.trim(),
            icon: selectedIcon,
            urgent: false
        };

        notes.unshift(newNote);
        render(notes);
        closeModal();
    });

    filtersContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-pill")) {
            document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
            e.target.classList.add("active");
            const filter = e.target.getAttribute("data-filter");
            if (filter === "all") {
                render(notes);
            } else {
                render(notes.filter(n => n.category === filter));
            }
        }
    });

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        render(notes.filter(n => n.title.toLowerCase().includes(query) || n.description.toLowerCase().includes(query)));
    });

    window.deleteNote = function(id) {
        notes = notes.filter(n => n.id !== id);
        render(notes);
    };

    window.editNote = function(id) {
        const note = notes.find(n => n.id === id);
        if (!note) return;
        const newTitle = prompt("Изменить название заметки:", note.title);
        if (newTitle) {
            note.title = newTitle;
            render(notes);
        }
    };
});