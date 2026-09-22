import Note from "./Note.js";

const STORAGE_KEY = "notes";

export default class NoteHandler {
    constructor(container, readOnly = false) {
        this.container = container;
        this.readOnly = readOnly;
        this.notes = [];

        this.loadNotes();
        this.renderNotes();

        this.handleStorageChange = this.handleStorageChange.bind(this);
        window.addEventListener("storage", this.handleStorageChange);
    }

    handleStorageChange(event) {
        if (event.key !== STORAGE_KEY) {
            return;
        }

        this.loadNotes();
        this.renderNotes();
    }

    addNote() {
        const note = new Note();

        this.notes.push(note);
        this.saveNotes();
        this.renderNotes();
    }

    updateNote(id, content) {
        if (this.readOnly) {
            return;
        }

        const note = this.notes.find((note) => note.id === id);

        if (!note) {
            return;
        }

        note.content = content;
        this.saveNotes();
    }

    removeNote(id) {
        if (this.readOnly) {
            return;
        }

        this.notes = this.notes.filter((note) => note.id !== id);

        this.saveNotes();
        this.renderNotes();
    }

    saveNotes() {
        if (this.readOnly) {
            return;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
    }

    loadNotes() {
        const savedNotes = localStorage.getItem(STORAGE_KEY);

        if (!savedNotes) {
            return;
        }

        try {
            const parsedNotes = JSON.parse(savedNotes);

            this.notes = parsedNotes.map(
                (note) => new Note(note.content, note.id)
            );
        } catch (error) {
            console.error("Could not load notes:", error);
            this.notes = [];
        }
    }

    renderNotes() {
        this.container.innerHTML = "";

        this.notes.forEach((note) => {
            const noteElement = document.createElement("article");
            noteElement.className = "note";

            const textarea = document.createElement("textarea");

            textarea.value = note.content;
            textarea.placeholder = "Write a note...";
            textarea.rows = 4;

            if (this.readOnly) {
                textarea.readOnly = true;
            } else {
                textarea.addEventListener("input", (event) => {
                    this.updateNote(note.id, event.target.value);
                });
            }

            noteElement.appendChild(textarea);

            if (!this.readOnly) {
                const removeButton = document.createElement("button");

                removeButton.type = "button";
                removeButton.textContent = "Remove";

                removeButton.addEventListener("click", () => {
                    this.removeNote(note.id);
                });

                noteElement.appendChild(removeButton);
            }

            this.container.appendChild(noteElement);
        });
    }
}
