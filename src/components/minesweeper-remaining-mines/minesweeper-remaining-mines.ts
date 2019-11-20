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

    #display {
        white-space: pre;
    }
</style>
<div id="display"></div>
`;

const DISPLAY_DIGITS = 3;

export class MinesweeperRemainingMinesElement extends HTMLElement {
    private displayElement: HTMLElement;

    get count(): number {
        return +this.getAttribute('count');
    }

    set count(count: number) {
        this.setAttribute('count', String(count));
    }

    static get observedAttributes(): Array<string> {
        return ['count'];
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.displayElement = this.shadowRoot.getElementById('display');
    }

    /**
     * Callback when an observed attribute is changed
     *
     * @param attrName The attribute that is changed
     * @param oldVal The old value
     * @param newVal The new value
     */
    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
        switch (attrName) {
            case 'count':
                this.displayElement.textContent = this.getCount();
                break;
        }
    }

    /**
     * Resets the mine count
     *
     * @param numMines The number of mines to reset to
     */
    reset(numMines: number): void {
        this.count = numMines;
    }

    /**
     * Increases the mine count
     */
    increase(): void {
        this.count++;
    }

    /**
     * Decreases the mine count
     */
    decrease(): void {
        this.count--;
    }

    /**
     * Formats the current mine count
     *
     * @returns The formatted mine count
     */
    private getCount(): string {
        return this.count >= 0 ? String(this.count).padStart(DISPLAY_DIGITS, '0') : String(this.count).padStart(DISPLAY_DIGITS, ' ');
    }
}

if (!customElements.get('minesweeper-remaining-mines')) {
    customElements.define('minesweeper-remaining-mines', MinesweeperRemainingMinesElement);
}