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

export class MinesweeperTimerElement extends HTMLElement {
    private timerInterval: number;
    private timerCount: number;
    private displayElement: HTMLElement;

    get isStarted(): boolean {
        return !!this.timerCount;
    }

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.displayElement = this.shadowRoot.getElementById('display');

        this.timerCount = 0;
    }

    disconnectedCallback() {
        this.stop();
    }

    reset() {
        this.stop();

        this.timerCount = 0;
        this.displayElement.textContent = this.getCount();
    }

    start() {
        if (this.timerInterval) return;
        this.timerInterval = <number><any>setInterval(() => {
            this.timerCount++;
            this.displayElement.textContent = this.getCount();
        }, 1000);
    }

    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = 0;
        }
    }

    getTime() {
        return this.timerCount;
    }

    private getCount() {
        return String(this.timerCount).padStart(3, '0');
    }
}

customElements.define('minesweeper-timer', MinesweeperTimerElement);