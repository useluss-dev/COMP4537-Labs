import { UserInterface } from "./UserInterface.js";
import { MemoryGame } from "./MemoryGame.js";
import { BUTTON_TITLES } from "../lang/en/buttons.js";
import { STRINGS } from "../lang/en/user.js";

export class AppController {
    constructor() {
        this.ui = new UserInterface();
        this.game = null;
        this.buttons = [];
    }

    start() {
        const controls = this.ui.createInputField(
            STRINGS.NUM_BUTTONS,
            "input",
            BUTTON_TITLES.BTN_GO
        );

        const message = this.ui.createMessage();
        const gameArea = this.ui.createGameArea();

        const minButtons = 3;
        const maxButtons = 7;

        controls.btn.addEventListener("click", () => {
            const numButtons = Number(controls.input.value);

            if (
                !Number.isInteger(numButtons) ||
                numButtons < minButtons ||
                numButtons > maxButtons
            ) {
                alert(STRINGS.INVALID_INPUT(minButtons, maxButtons));

                controls.input.focus();
                controls.input.select();

                return;
            }

            this.startGame(numButtons, gameArea, message);
        });
    }

    async startGame(numButtons, gameArea, message) {
        this.game = new MemoryGame(numButtons);
        this.buttons = [];

        gameArea.replaceChildren();
        message.textContent = "";

        const buttonData = this.game.createButtonData();

        for (const data of buttonData) {
            const button = this.ui.createMemoryButton(data.number, data.color);

            gameArea.appendChild(button);
            this.buttons.push(button);

            button.addEventListener("click", () => {
                this.handleButtonClick(button, message);
            });
        }

        this.placeButtonsInRow();

        await this.wait(numButtons * 1000);

        for (let move = 0; move < numButtons; move++) {
            this.moveButtonsRandomly(gameArea);

            if (move < numButtons - 1) {
                await this.wait(700);
            }
        }

        for (const button of this.buttons) {
            this.ui.hideButtonNumber(button);
            this.ui.enableButton(button);
        }

        message.textContent = STRINGS.INSTRUCTIONS;
    }

    handleButtonClick(button, message) {
        const number = Number(button.dataset.number);
        const result = this.game.selectButton(number);

        if (!result.correct) {
            message.textContent = STRINGS.WRONG_BUTTON;

            for (const gameButton of this.buttons) {
                this.ui.revealButtonNumber(gameButton);
                this.ui.disableButton(gameButton);
            }

            return;
        }

        this.ui.revealButtonNumber(button);
        this.ui.disableButton(button);

        if (result.complete) {
            message.textContent = STRINGS.WIN_MSG;
        }
    }

    placeButtonsInRow() {
        const gameArea = document.querySelector("#game-area");

        gameArea.style.display = "flex";
        gameArea.style.flexWrap = "wrap";
        gameArea.style.gap = "10px";

        for (const button of this.buttons) {
            button.style.position = "static";
        }
    }

    moveButtonsRandomly(gameArea) {
        gameArea.style.display = "block";

        const areaWidth = gameArea.clientWidth;
        const areaHeight = gameArea.clientHeight;

        for (const button of this.buttons) {
            const buttonWidth = button.offsetWidth;
            const buttonHeight = button.offsetHeight;

            const maxLeft = Math.max(0, areaWidth - buttonWidth);
            const maxTop = Math.max(0, areaHeight - buttonHeight);

            const left = Math.floor(Math.random() * (maxLeft + 1));
            const top = Math.floor(Math.random() * (maxTop + 1));

            button.style.position = "absolute";
            button.style.left = `${left}px`;
            button.style.top = `${top}px`;
        }
    }

    wait(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
}
