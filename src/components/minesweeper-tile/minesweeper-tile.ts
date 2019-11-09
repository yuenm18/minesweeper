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

    :host([pressed], :focus) {
        border: none;
        outline: none;
        -moz-outline: none;
    }

    :host([exploded]) {
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

    // tile should not be modified when disabled
    // tile is should be disabled when it is revealed or when the game is over
    private disabled: boolean;

    // whether or not this is a mine
    private mine: boolean;

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

    get visited(): boolean {
        return this.hasAttribute('visited');
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.displayElement = this.shadowRoot.getElementById('display');

        this.addEventListener('contextmenu', e => {
            e.preventDefault();
            this.toggleFlag();
        });

        this.addEventListener('keydown', e => {
            switch (e.key) {
                case 'f':
                    this.toggleFlag();
                    break;
                case ' ':
                case 'Enter':
                    this.selectTile();
                    break;
            }
        });

        this.addEventListener('mousedown', e => {
            e.preventDefault(); // prevent focus on all mouse events
            if (e.buttons === 1 && !this.disabled && !this.isFlagged()) {
                this.setAttribute('pressed', '');
            }
        });

        this.addEventListener('mouseout', e => {
            this.removeAttribute('pressed');
        });

        this.addEventListener('mouseover', e => {
            if (e.buttons === 1 && !this.disabled && !this.isFlagged()) {
                this.setAttribute('pressed', '');
            }
        });

        this.addEventListener('mouseup', e => {
            if (e.which === 1) {
                this.selectTile();
            }
        });
    }

    connectedCallback(): void {
        this.x = +this.getAttribute('x');
        this.y = +this.getAttribute('y');
        this.hasAttribute('tabindex') || this.setAttribute('tabindex', '0');
    }

    disable(): void {
        this.disabled = true;
        this.blur();
        this.setAttribute('tabindex', '-1');
    }

    flag(): void {
        if (this.disabled || this.isFlagged()) { return; }

        const flagEvent = new CustomEvent('tile-flag', { bubbles: true, cancelable: true, composed: true });
        if (this.dispatchEvent(flagEvent)) {
            this.value = '🚩';
        }
    }

    isDisabled(): boolean {
        return this.disabled;
    }

    isFlagged(): boolean {
        return this.value === '🚩';
    }

    isMine(): boolean {
        return this.mine;
    }

    revealMine(clicked: boolean = false): void {
        if (clicked) {
            this.setAttribute('exploded', '');
        }

        this.value = '💣';
        this.disable();
        this.setAttribute('visited', '');
    }

    revealNotMine(): void {
        this.value = '❌';
        this.disable();
        this.setAttribute('visited', '');
    }

    revealTileCount(numSurroundingMines: number): void {
        this.value = String(numSurroundingMines);
        this.disable();
        this.setAttribute('visited', '');
    }

    setMine(): void {
        this.mine = true;
    }

    unflag(): void {
        if (this.disabled || !this.isFlagged()) { return; }

        const unflagEvent = new CustomEvent('tile-unflag', { bubbles: true, cancelable: true, composed: true });
        if (this.dispatchEvent(unflagEvent)) {
            this.value = '';
        }
    }

    private toggleFlag() {
        if (this.disabled) { return; }

        if (this.isFlagged()) {
            this.unflag();
        } else {
            this.flag();
        }
    }

    private selectTile() {
        if (!this.disabled && !this.isFlagged()) {
            this.dispatchEvent(new CustomEvent('tile-select', { bubbles: true, composed: true }));
        }
    }
}

customElements.define('minesweeper-tile', MinesweeperTileElement);