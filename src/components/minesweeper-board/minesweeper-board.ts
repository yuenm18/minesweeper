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
    private active: boolean;

    private board: HTMLElement;
    private tiles: Array<MinesweeperTileElement>;

    static get observedAttributes() {
        return ['width', 'height', 'mines'];
    }

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

        this.board.addEventListener('mouseup', e => {
            const minesweeperTile: MinesweeperTileElement = <MinesweeperTileElement>e.target;
            if (minesweeperTile.tagName === 'MINESWEEPER-TILE' && e.which === 1 && this.active && !minesweeperTile.isFlagged) {
                this.dispatchEvent(new CustomEvent('tile-selected', { bubbles: true }));
                this.revealTiles(minesweeperTile);
                if (this.isGameFinished()) {
                    this.active = false;
                    this.flagAllMines();
                    this.dispatchEvent(new CustomEvent('won', { bubbles: true }));
                }
            }
        });

        this.board.addEventListener('contextmenu', e => {
            const minesweeperTile: MinesweeperTileElement = <MinesweeperTileElement>e.target;
            if (minesweeperTile.tagName === 'MINESWEEPER-TILE' && this.active && !minesweeperTile.visited) {
                if (minesweeperTile.isFlagged) {
                    minesweeperTile.unflag();
                    this.dispatchEvent(new CustomEvent('unflag', { bubbles: true }));
                }
                else {
                    minesweeperTile.flag();
                    this.dispatchEvent(new CustomEvent('flag', { bubbles: true }));
                }
            }

            e.preventDefault();
        });
    }

    connectedCallback(): void {
        this.width = +this.getAttribute('width');
        this.height = +this.getAttribute('height');
        this.mines = +this.getAttribute('mines');

        setTimeout(() => this.initializeBoard(this.width, this.height, this.mines));
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    }

    initializeBoard(boardWidth: number = this.width, boardHeight: number = this.height, numMines: number = this.mines): void {
        this.width = boardWidth;
        this.height = boardHeight;
        this.mines = numMines;
        this.active = true;

        if (this.mines > this.width * this.height) {
            console.error(`${this.mines} mines is greater than the number of places in a ${this.width} x ${this.height} board`);
            return;
        }

        while (this.board.firstChild) {
            this.board.removeChild(this.board.firstChild);
        }

        this.tiles = [];
        for (let i = 0; i < this.height; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < this.width; j++) {
                let tile = <MinesweeperTileElement>document.createElement('minesweeper-tile');
                tile.setAttribute('x', String(i));
                tile.setAttribute('y', String(j));
                this.tiles[i * this.width + j] = tile;

                const td = document.createElement('td');
                td.appendChild(tile);
                tr.appendChild(td);
            }

            this.board.appendChild(tr);
        }

        let numMinesPlaced = 0;
        while (numMinesPlaced < this.mines) {
            const index = Math.floor(Math.random() * (this.width * this.height));
            if (!this.tiles[index].isMine) {
                this.tiles[index].isMine = true;
                numMinesPlaced++;
            }
        }
    }

    private revealTiles(tile: MinesweeperTileElement): void {
        let tilesToCheck: Array<MinesweeperTileElement> = [];
        tilesToCheck.push(tile);

        while (tilesToCheck.length) {
            let tile = tilesToCheck.pop();
            if (tile.visited || tile.isFlagged) {
                continue;
            }

            if (tile.isMine) {
                tile.revealMine(true);
                this.active = false;
                this.revealAllMines();
                this.dispatchEvent(new CustomEvent('lost', { bubbles: true }));
                return;
            }

            let surroundingMinesCount = 0;
            this.checkSurroundingTiles(tile.x, tile.y, (xNeighbor: number, yNeighbor: number) => {
                if (this.tiles[xNeighbor * this.width + yNeighbor].isMine) {
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
    }

    private isGameFinished(): boolean {
        return this.tiles.every(tile => tile.isMine || (!tile.isMine && tile.visited));
    }

    private revealAllMines(): void {
        this.tiles.forEach(tile => {
            if (tile.isMine && !tile.isFlagged) {
                tile.revealMine();
            }

            if (!tile.isMine && tile.isFlagged) {
                tile.revealNotMine();
            }

            tile.disable();
        });
    }

    private flagAllMines(): void {
        this.tiles.forEach(tile => {
            if (tile.isMine && !tile.isFlagged) {
                tile.flag();
                this.dispatchEvent(new CustomEvent('flag', { bubbles: true }));
            }
        });
    }

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
}

customElements.define('minesweeper-board', MinesweeperBoardElement);