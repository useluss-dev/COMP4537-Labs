import { STRINGS } from "../lang/messages/en/strings.js";
import NoteHandler from "./NoteHandler.js";

export default class AppController {
    constructor() {
        this.initPage();
    }

    initPage() {
        const page = document.querySelector("main").id;

        switch (page) {
            case "landing":
                this.landingPage();
            case "writer-page":
                this.writerPage();
            case "reader-page":
                this.readerPage();
        }
    }

    landingPage() {
        const title = document.getElementById("page-title");
        const studentInfo = document.getElementById("student-id");
        const writerLink = document.getElementById("writer-link");
        const readerLink = document.getElementById("reader-link");

        title.textContent = STRINGS.TITLE;
        studentInfo.textContent = STRINGS.STUDENT_INFO;
        writerLink.textContent = STRINGS.WRITER_LINK;
        readerLink.textContent = STRINGS.READER_LINK;
    }

    writerPage() {
        const addBtn = document.getElementById("add-note-button");
        const noteContainer = document.getElementById("note-container");

        const noteHandler = new NoteHandler(noteContainer, false);

        addBtn.textContent = STRINGS.ADD_BTN;

        addBtn.addEventListener("click", () => {
            noteHandler.addNote();
        });
    }

    readerPage() {
        const noteContainer = document.getElementById("note-container");

        new NoteHandler(noteContainer, true);
    }
}
