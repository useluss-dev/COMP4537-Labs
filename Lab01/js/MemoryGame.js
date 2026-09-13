export class MemoryGame {
    constructor(numButtons) {
        this.numButtons = numButtons;
        this.buttons = [];
        this.nextNum = 1;
        this.gameOver = false;
    }

    createButtonData() {
        this.buttons = [];

        for (let number = 1; number <= this.numButtons; number++) {
            this.buttons.push({
                number,
                color: this.createRandomColor(),
            });
        }

        return this.buttons;
    }

    isCorrectButton(number) {
        return number === this.nextNum;
    }

    selectButton(number) {
        if (this.gameOver) {
            return {
                correct: false,
                complete: false,
            };
        }

        if (!this.isCorrectButton(number)) {
            this.gameOver = true;

            return {
                correct: false,
                complete: false,
            };
        }

        this.nextNum++;

        const complete = this.nextNum > this.numButtons;

        if (complete) {
            this.gameOver = true;
        }

        return {
            correct: true,
            complete,
        };
    }

    createRandomColor() {
        const red = this.randomNumber(50, 220);
        const green = this.randomNumber(50, 220);
        const blue = this.randomNumber(50, 220);

        return `rgb(${red}, ${green}, ${blue})`;
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
