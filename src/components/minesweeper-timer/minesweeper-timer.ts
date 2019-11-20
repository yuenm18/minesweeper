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

    /**
     * The disconnected callback
     */
    disconnectedCallback(): void {
        this.stop();
    }

    /**
     * Whether or not the timer has started
     *
     * @returns true if the timer has started, false otherwise
     */
    isStarted(): boolean {
        return !!this.timerInterval;
    }

    /**
     * Resets the timer
     */
    reset(): void {
        this.stop();

        this.timerCount = 0;
        this.displayElement.textContent = this.getCount();
    }

    /**
     * Starts the timer
     * If the timer has already started then do nothing
     */
    start(): void {
        if (this.isStarted()) return;

        this.timerInterval = <number><any>setInterval(() => {
            this.timerCount++;
            this.displayElement.textContent = this.getCount();
        }, ONE_SECOND_MS);
    }

    /**
     * Stops the timer
     */
    stop(): void {
        if (this.isStarted()) {
            clearInterval(this.timerInterval);
            this.timerInterval = 0;
        }
    }

    /**
     * Gets the current time on the timer
     *
     * @returns the timer's count
     */
    getTime(): number {
        return this.timerCount;
    }

    /**
     * Formats the current timer count
     *
     * @returns The formatted timer count
     */
    private getCount(): string {
        return String(this.timerCount).padStart(DISPLAY_DIGITS, '0');
    }
}

if (!customElements.get('minesweeper-timer')) {
    customElements.define('minesweeper-timer', MinesweeperTimerElement);
}