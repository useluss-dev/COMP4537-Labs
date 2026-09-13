import { STRINGS } from "../lang/en/user.js";

export class UserInterface {
    constructor() {
        this.app = document.querySelector("#app");
        this.setAppTitle(STRINGS.APP_TITLE);
    }

    setAppTitle(title) {
        document.title = title;
    }

    createInputField(labelText, inputName, btnText) {
        const container = document.createElement("div");
        const controls = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");
        const btn = document.createElement("button");

        container.classList.add("input-field");
        controls.classList.add("controls");

        input.type = "text";
        input.id = inputName;
        input.name = inputName;

        label.textContent = labelText;
        label.htmlFor = inputName;

        btn.type = "button";
        btn.textContent = btnText;

        controls.appendChild(input);
        controls.appendChild(btn);

        container.appendChild(label);
        container.appendChild(controls);

        this.app.appendChild(container);

        return {
            input,
            btn,
        };
    }

    createMessage() {
        const message = document.createElement("p");
        message.id = "message";

        this.app.appendChild(message);

        return message;
    }

    showMessage(messageElement, text) {
        messageElement.textContent = text;
    }

    createGameArea() {
        const gameArea = document.createElement("div");

        gameArea.id = "game-area";
        this.app.appendChild(gameArea);

        return gameArea;
    }

    createMemoryButton(number, color) {
        const button = document.createElement("button");

        button.classList.add("memory-button");
        button.dataset.number = number;
        button.style.backgroundColor = color;
        button.textContent = number;
        button.disabled = true;

        return button;
    }

    hideButtonNumber(button) {
        button.textContent = "";
    }

    revealButtonNumber(button) {
        button.textContent = button.dataset.number;
    }

    enableButton(button) {
        button.disabled = false;
        button.classList.add("clickable");
    }

    disableButton(button) {
        button.disabled = true;
    }
}
