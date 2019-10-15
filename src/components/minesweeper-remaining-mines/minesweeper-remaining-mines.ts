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

export class MinesweeperRemainingMinesElement extends HTMLElement {
    private displayElement: HTMLElement;

    get count(): number {
        return +this.getAttribute('count');
    }

    set count(count: number) {
        this.setAttribute('count', String(count));
    }

    static get observedAttributes() {
        return ['count'];
    }

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.displayElement = this.shadowRoot.getElementById('display');
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
        switch (attrName) {
        case 'count':
            this.displayElement.textContent = this.getCount();
            break;
        }
    }

    reset(numMines: number): void {
        this.count = numMines;
    }

    increase(): void {
        this.count++;
    }

    decrease(): void {
        this.count--;
    }

    private getCount(): string {
        return this.count >= 0 ? String(this.count).padStart(3, '0') : String(this.count).padStart(3, '\xa0');
    }
}

customElements.define('minesweeper-remaining-mines', MinesweeperRemainingMinesElement);