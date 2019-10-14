const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.5rem;
        width: 1.5rem;
        font-family: arial;
        font-weight: 900;
        border: .25rem outset lightgrey;
        background-color: lightgrey;
        cursor: pointer;
        user-select: none;
        -moz-user-select: none;
    }

    :host[hidden] {
        display: none;
    }

    :host([pressed]) {
        border: none;
    }

    :host([mine]) {
        background-color: red;
    }

    :host([visited]) {
        border: none;
    }

    :host([value='1']) {
        color: var(--minesweeper-tile-one-color, blue);
    }

    :host([value='2']) {
        color: var(--minesweeper-tile-two-color, green);
    }

    :host([value='3']) {
        color: var(--minesweeper-tile-three-color, red);
    }

    :host([value='4']) {
        color: var(--minesweeper-tile-four-color, purple);
    }

    :host([value='5']) {
        color: var(--minesweeper-tile-five-color, maroon);
    }

    :host([value='6']) {
        color: var(--minesweeper-tile-six-color, turquoise);
    }

    :host([value='7']) {
        color: var(--minesweeper-tile-seven-color, black);
    }

    :host([value='8']) {
        color: var(--minesweeper-tile-eight-color, grey);
    }
</style>
<div id="display"></div>
`;

export class MinesweeperTileElement extends HTMLElement {
    private displayElement: HTMLElement;
    private isDisabled: boolean;

    isMine: boolean;

    get x(): number {
        return +this.getAttribute('x');
    }
    set x(x: number) {
        this.setAttribute('x', String(x));
    }

    get y(): number {
        return +this.getAttribute('y');
    }
    set y(y: number) {
        this.setAttribute('y', String(y));
    }

    get value(): string {
        return this.getAttribute('value');
    }

    set value(value: string) {
        this.setAttribute('value', value);
        this.displayElement.textContent = this.value !== '0' ? this.value : '';
    }

    get visited(): boolean{
        return this.hasAttribute('visited');
    }

    get isFlagged(): boolean {
        return this.value === '🚩';
    }

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.displayElement = this.shadowRoot.getElementById('display');
        
        this.addEventListener('mousedown', e => {
            if (e.buttons === 1 && !this.isDisabled && !this.isFlagged) {
                this.setAttribute('pressed', '');
            }
        });

        this.addEventListener('mouseover', e => {
            if (e.buttons === 1 && !this.isDisabled && !this.isFlagged) {
                this.setAttribute('pressed', '');
            }
        });

        this.addEventListener('mouseout', e => {
            this.removeAttribute('pressed');
        });
    }


    connectedCallback(): void {
        this.x = +this.getAttribute('x');
        this.y = +this.getAttribute('y');
    }

    unflag(): void {
        this.value = '';
    }

    flag(): void {
        this.value = '🚩';
    }

    revealNotMine(): void {
        this.value = '❌';
        this.setAttribute('visited', '');
    }

    revealMine(clicked: boolean = false): void {
        if (clicked) {
            this.setAttribute('mine', '');
        }

        this.value = '💣';
        this.setAttribute('visited', '');
    }

    revealTileCount(numSurroundingMines: number): void {
        this.value = String(numSurroundingMines);
        this.setAttribute('visited', '');
    }

    disable(): void {
        this.isDisabled = true;
    }
}

customElements.define('minesweeper-tile', MinesweeperTileElement);