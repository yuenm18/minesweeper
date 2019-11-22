import { MinesweeperTileElement } from '../minesweeper-tile/minesweeper-tile';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        background-color: grey;
        border: .25rem lightgrey ridge;
    }

    :host[hidden] {
        display: none;
    }

    #board {
        border-collapse: collapse;
    }
</style>
<table id="board"></table>
`;

export class MinesweeperBoardElement extends HTMLElement {
    private board: HTMLElement;
    private tiles: Array<MinesweeperTileElement>;

    get mines(): number {
        return +this.getAttribute('mines');
    }

    set mines(mines) {
        this.setAttribute('mines', String(mines));
    }

    get width(): number {
        return +this.getAttribute('width');
    }

    set width(width: number) {
        this.setAttribute('width', String(width));
    }

    get height(): number {
        return +this.getAttribute('height');
    }

    set height(height: number) {
        this.setAttribute('height', String(height));
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.board = this.shadowRoot.getElementById('board');

        this.handleTileSelection();
        this.handleBoardNavigationWithArrowKeys();
        this.handlePreventingContextMenu();
    }

    /**
     * Initializes the minesweeper board
     *
     * @param boardWidth The width of the board
     * @param boardHeight The height of the board
     * @param numMines The number of mines in the board
     */
    initializeBoard(boardWidth: number = this.width, boardHeight: number = this.height, numMines: number = this.mines): void {
        if (numMines > boardWidth * boardHeight) {
            console.error(`${numMines} mines is greater than the number of places in a ${boardWidth} x ${boardHeight} board`);
            return;
        }

        this.width = boardWidth;
        this.height = boardHeight;
        this.mines = numMines;

        while (this.board.firstChild) {
            this.board.removeChild(this.board.firstChild);
        }

        // add generate a width by height grid
        this.tiles = [];
        for (let i = 0; i < this.height; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < this.width; j++) {
                const tile = <MinesweeperTileElement>document.createElement('minesweeper-tile');
                tile.setAttribute('x', String(i));
                tile.setAttribute('y', String(j));
                this.tiles[i * this.width + j] = tile;

                const td = document.createElement('td');
                td.appendChild(tile);
                tr.appendChild(td);
            }

            this.board.appendChild(tr);
        }

        // put mines in random tiles
        let numMinesPlaced = 0;
        while (numMinesPlaced < this.mines) {
            const index = Math.floor(Math.random() * (this.width * this.height));
            if (!this.tiles[index].isMine()) {
                this.tiles[index].setMine();
                numMinesPlaced++;
            }
        }
    }

    /**
     * Runs a function on all tiles surrounding a given tile
     *
     * @param x the x coordinate of the tile
     * @param y the y coordinate of the tile
     * @param fn the function to run on the surrounding tiles
     */
    private checkSurroundingTiles(x: number, y: number, fn: Function): void {
        if (x - 1 >= 0) fn(x - 1, y);
        if (x - 1 >= 0 && y - 1 >= 0) fn(x - 1, y - 1);
        if (x - 1 >= 0 && y + 1 < this.width) fn(x - 1, y + 1);
        if (y - 1 >= 0) fn(x, y - 1);
        if (y + 1 < this.width) fn(x, y + 1);
        if (x + 1 < this.height) fn(x + 1, y);
        if (x + 1 < this.height && y - 1 >= 0) fn(x + 1, y - 1);
        if (x + 1 < this.height && y + 1 < this.width) fn(x + 1, y + 1);
    }

    /**
     * Determines if the game is finished or not
     *
     * @returns True if all tiles that are not mines are visited
     */
    private isGameFinished(): boolean {
        return this.tiles.every(tile => tile.isMine() || tile.visited);
    }

    /**
     * Flags all tiles that are mines and not flagged
     */
    private flagAllMines(): void {
        this.tiles.forEach(tile => {
            if (tile.isMine() && !tile.isFlagged()) {
                tile.flag();
            }

            tile.disable();
        });
    }

    /**
     * Add event listeners for handling the navigating through the board using arrow keys
     */
    private handleBoardNavigationWithArrowKeys(): void {
        // allow navigation through the board with arrow keys
        this.shadowRoot.addEventListener('keydown', (e: KeyboardEvent) => {
            const focusedElement = this.shadowRoot.activeElement;
            if (focusedElement && focusedElement.constructor === MinesweeperTileElement) {
                const focusedElementIndex = this.tiles.findIndex(t => t === focusedElement);
                let row = Math.floor(focusedElementIndex / this.width);
                let column = focusedElementIndex % this.width;

                switch (e.key) {
                    case 'ArrowUp':
                        row = (this.height + row - 1) % this.height;
                        break;
                    case 'ArrowRight':
                        column = (column + 1) % this.width;
                        break;
                    case 'ArrowDown':
                        row = (row + 1) % this.height;
                        break;
                    case 'ArrowLeft':
                        column = (this.width + column - 1) % this.width;
                        break;
                }

                this.tiles[row * this.width + column].focus();
            }
        });
    }

    /**
     * Add event listeners for preventing showing the context menu
     */
    private handlePreventingContextMenu(): void {
        // prevent showing context menu if the user misflags a tile
        this.shadowRoot.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
        });
    }


    /**
     * Add event listeners for handling tile selection
     */
    private handleTileSelection(): void {
        // reveal the selected tile and emit won or lost events if the tile selected resulting in the player winning or losing the game
        this.shadowRoot.addEventListener('tile-select', (e: CustomEvent) => {
            const minesweeperTile: MinesweeperTileElement = <MinesweeperTileElement>e.target;
            const lost = this.revealTiles(minesweeperTile);
            if (lost) {
                this.revealAllMines();
                this.dispatchEvent(new CustomEvent('lost', { bubbles: true }));
            } else if (this.isGameFinished()) {
                this.flagAllMines();
                this.dispatchEvent(new CustomEvent('won', { bubbles: true }));
            }
        });
    }
    /**
     * Reveal all mines
     * 1. Disable all tiles
     * 2. Show mines that are not flagged that are mines
     * 3. Show X for tiles that are flagged that are not mines
     */
    private revealAllMines(): void {
        this.tiles.forEach(tile => {
            if (tile.isMine() && !tile.isFlagged()) {
                tile.revealMine();
            }

            if (!tile.isMine() && tile.isFlagged()) {
                tile.revealNotMine();
            }

            tile.disable();
        });
    }

    /**
     * Reveals mines from a click
     *
     * @param tile The tile that was clicked
     * @returns true if the tile was a mine or false if not
     */
    private revealTiles(tile: MinesweeperTileElement): boolean {
        const tilesToCheck: Array<MinesweeperTileElement> = [];
        tilesToCheck.push(tile);

        // Do a DFS to reveal the tile and surrounding tiles if the tiles have zero surrounding mines
        while (tilesToCheck.length) {
            const tile = tilesToCheck.pop();
            if (tile.visited || tile.isFlagged()) {
                continue;
            }

            if (tile.isMine()) {
                tile.revealMine(true);
                return true;
            }

            let surroundingMinesCount = 0;
            this.checkSurroundingTiles(tile.x, tile.y, (xNeighbor: number, yNeighbor: number) => {
                if (this.tiles[xNeighbor * this.width + yNeighbor].isMine()) {
                    surroundingMinesCount++;
                }
            });

            tile.revealTileCount(surroundingMinesCount);
            if (surroundingMinesCount !== 0) {
                continue;
            }

            this.checkSurroundingTiles(tile.x, tile.y, (xNeighbor: number, yNeighbor: number) => {
                const neighboringTile = this.tiles[xNeighbor * this.width + yNeighbor];
                if (!neighboringTile.visited) {
                    tilesToCheck.push(neighboringTile);
                }
            });
        }

        return false;
    }
}

if (!customElements.get('minesweeper-board')) {
    customElements.define('minesweeper-board', MinesweeperBoardElement);
}