const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        font-family: arial;
        font-weight: 900;
        cursor: pointer;
        user-select: none;
        -moz-user-select: none;
        outline: none;
        -moz-outline: none;
    }

    :host[hidden] {
        display: none;
    }

    :host(:focus) > #display,
    #display[pressed] {
        border: none;
    }
    
    #display {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.5rem;
        width: 1.5rem;
        background-color: lightgrey;
        border: .25rem outset lightgrey;
    }

    #display[exploded] {
        background-color: red;
    }

    #display[visited] {
        border: none;
    }

    #display[value='1'] {
        color: var(--minesweeper-tile-one-color, blue);
    }

    #display[value='2'] {
        color: var(--minesweeper-tile-two-color, green);
    }

    #display[value='3'] {
        color: var(--minesweeper-tile-three-color, red);
    }

    #display[value='4'] {
        color: var(--minesweeper-tile-four-color, purple);
    }

    #display[value='5'] {
        color: var(--minesweeper-tile-five-color, maroon);
    }

    #display[value='6'] {
        color: var(--minesweeper-tile-six-color, turquoise);
    }

    #display[value='7'] {
        color: var(--minesweeper-tile-seven-color, black);
    }

    #display[value='8'] {
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

    // whether or not the tile is a mine
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
        return this.displayElement.getAttribute('value');
    }

    set value(value: string) {
        this.displayElement.setAttribute('value', value);
        this.displayElement.textContent = this.value !== '0' ? this.value : '';
    }

    get visited(): boolean {
        return this.displayElement.hasAttribute('visited');
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.displayElement = this.shadowRoot.getElementById('display');

        this.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            this.toggleFlag();
        });

        this.addEventListener('keydown', (e: KeyboardEvent) => {
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

        this.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault(); // prevent focus on all mouse events
            if (e.buttons === 1 && !this.disabled && !this.isFlagged()) {
                this.displayElement.setAttribute('pressed', '');
            }
        });

        this.addEventListener('mouseout', (e: MouseEvent) => {
            this.displayElement.removeAttribute('pressed');
        });

        this.addEventListener('mouseover', (e: MouseEvent) => {
            if (e.buttons === 1 && !this.disabled && !this.isFlagged()) {
                this.displayElement.setAttribute('pressed', '');
            }
        });

        this.addEventListener('mouseup', (e: MouseEvent) => {
            if (e.which === 1) {
                this.selectTile();
            }
        });
    }

    /**
     * The connected callback
     */
    connectedCallback(): void {
        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }
    }

    /**
     * Disables the tile
     */
    disable(): void {
        this.disabled = true;
        this.removeAttribute('tabindex');
        this.blur();
    }

    /**
     * Flags the tile if the tile is in a valid state to do so
     */
    flag(): void {
        if (this.disabled || this.isFlagged()) { return; }

        const flagEvent = new CustomEvent('tile-flag', { bubbles: true, cancelable: true, composed: true });
        if (this.dispatchEvent(flagEvent)) {
            this.value = '🚩';
        }
    }

    /**
     * Whether or not the tile is disabled
     *
     * @returns true if the tile is disabled, false otherwise
     */
    isDisabled(): boolean {
        return this.disabled;
    }

    /**
     * Whether or not the tile is flagged
     *
     * @returns true if the tile is flagged, false otherwise
     */
    isFlagged(): boolean {
        return this.value === '🚩';
    }

    /**
     * Whether or not the tile is a mine
     *
     * @returns true if the tile is a mine, false otherwise
     */
    isMine(): boolean {
        return this.mine;
    }

    /**
     * Reveals that the tile is a mine
     *
     * @param clicked Whether or not the tile was clicked
     */
    revealMine(clicked: boolean = false): void {
        if (clicked) {
            this.displayElement.setAttribute('exploded', '');
        }

        this.value = '💣';
        this.disable();
        this.displayElement.setAttribute('visited', '');
    }

    /**
     * Reveals that the tile was not a mine
     */
    revealNotMine(): void {
        this.value = '❌';
        this.disable();
        this.displayElement.setAttribute('visited', '');
    }

    /**
     * Reveals the surrounding mine count
     *
     * @param numSurroundingMines The number of surrounding mines
     */
    revealTileCount(numSurroundingMines: number): void {
        this.value = String(numSurroundingMines);
        this.disable();
        this.displayElement.setAttribute('visited', '');
    }

    /**
     * Sets the tile as a mine
     */
    setMine(): void {
        this.mine = true;
    }

    /**
     * Unflags the tile if the tile is in a valid state to do so
     */
    unflag(): void {
        if (this.disabled || !this.isFlagged()) { return; }

        const unflagEvent = new CustomEvent('tile-unflag', { bubbles: true, cancelable: true, composed: true });
        if (this.dispatchEvent(unflagEvent)) {
            this.value = '';
        }
    }

    /**
     * Toggles flagging the tile if the tile is in a valid state to do so
     */
    private toggleFlag(): void {
        if (this.disabled) { return; }

        if (this.isFlagged()) {
            this.unflag();
        } else {
            this.flag();
        }
    }

    /**
     * Dispatches a tile-select event if the tile is in a valid state to do so
     */
    private selectTile(): void {
        if (!this.disabled && !this.isFlagged()) {
            this.dispatchEvent(new CustomEvent('tile-select', { bubbles: true, composed: true }));
        }
    }
}

if (!customElements.get('minesweeper-tile')) {
    customElements.define('minesweeper-tile', MinesweeperTileElement);
}