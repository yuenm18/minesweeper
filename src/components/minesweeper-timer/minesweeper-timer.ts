const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        background-color: black;
        color: red;
        font-family: 'DSEG7-Classic';
        font-size: 2rem;
        user-select: none;
        -moz-user-select: none;
    }

    :host[hidden] {
        display: none;
    }
</style>
<div id="display"></div>
`;

const DISPLAY_DIGITS = 3;
const ONE_SECOND_MS = 1000;

export class MinesweeperTimerElement extends HTMLElement {
    private timerInterval: number;
    private timerCount: number;
    private displayElement: HTMLElement;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.displayElement = this.shadowRoot.getElementById('display');

        this.timerCount = 0;
    }

    disconnectedCallback() {
        this.stop();
    }

    isStarted(): boolean {
        return !!this.timerInterval;
    }

    reset() {
        this.stop();

        this.timerCount = 0;
        this.displayElement.textContent = this.getCount();
    }

    start() {
        if (this.isStarted()) return;
        this.timerInterval = <number><any>setInterval(() => {
            this.timerCount++;
            this.displayElement.textContent = this.getCount();
        }, ONE_SECOND_MS);
    }

    stop() {
        if (this.isStarted()) {
            clearInterval(this.timerInterval);
            this.timerInterval = 0;
        }
    }

    getTime() {
        return this.timerCount;
    }

    private getCount() {
        return String(this.timerCount).padStart(DISPLAY_DIGITS, '0');
    }
}

if (!customElements.get('minesweeper-timer')) {
    customElements.define('minesweeper-timer', MinesweeperTimerElement);
}