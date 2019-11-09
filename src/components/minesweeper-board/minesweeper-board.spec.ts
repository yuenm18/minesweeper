import './minesweeper-board';
import { MinesweeperBoardElement } from './minesweeper-board';
import { MinesweeperTileElement } from '../minesweeper-tile/minesweeper-tile';

describe('Minesweeper board', () => {
    let minesweeperBoardElement: MinesweeperBoardElement;

    beforeEach(() => {
        minesweeperBoardElement = <MinesweeperBoardElement>document.createElement('minesweeper-board');
        document.body.appendChild(minesweeperBoardElement);
    });

    it('should be instance of minesweeper board', () => {
        const element = document.querySelector('minesweeper-board');
        expect(element.constructor).toBe(MinesweeperBoardElement);
    });
    

    it('should reflect properties to attributes', () => {
        minesweeperBoardElement.width = 10;
        minesweeperBoardElement.height = 15;
        minesweeperBoardElement.mines = 20;

        expect(minesweeperBoardElement.getAttribute('width')).toEqual('10');
        expect(minesweeperBoardElement.getAttribute('height')).toEqual('15');
        expect(minesweeperBoardElement.getAttribute('mines')).toEqual('20');
    });

    it('should create a 10x10 board with 10 mines', () => {
        minesweeperBoardElement.initializeBoard(10, 10, 10);

        expect(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile').length).toBe(100);
        expect(minesweeperBoardElement.shadowRoot.querySelectorAll('tr').length).toBe(10);
        expect(minesweeperBoardElement.shadowRoot.querySelector('tr').querySelectorAll('td').length).toBe(10);
        expect([].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine()).length).toBe(10);
    });

    it('should reveal tiles when clicking mine', () => {
        minesweeperBoardElement.initializeBoard(10, 10, 10);

        const clickEvent = new MouseEvent('mouseup', {
            bubbles: true
        });

        const rightClickEvent = new MouseEvent('contextmenu', {
            bubbles: true
        });

        const notMineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine());
        const mineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine());
        const flaggedNotMineTile = notMineTiles[0];
        const flaggedMineTile = mineTiles[0];
        const clickedTile = mineTiles[1];
        const notFlaggedMineTiles = mineTiles.filter((t: MinesweeperTileElement) => t !== flaggedMineTile);

        flaggedNotMineTile.dispatchEvent(rightClickEvent);
        flaggedMineTile.dispatchEvent(rightClickEvent);
        clickedTile.dispatchEvent(clickEvent);

        expect(flaggedNotMineTile.value).toBe('❌');
        expect(flaggedMineTile.value).toBe('🚩');
        expect(mineTiles.filter((t: MinesweeperTileElement) => t !== flaggedMineTile && t.value === '💣')).toEqual(notFlaggedMineTiles);
    });

    it('should reveal surrounding tiles if tile has no surrounding mines', () => {
        minesweeperBoardElement.initializeBoard(10, 10, 1);

        const clickEvent = new MouseEvent('mouseup', {
            bubbles: true
        });

        const notMineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine());

        let i = 0;
        do {
            notMineTiles[i].dispatchEvent(clickEvent);
            i++;
        } while (notMineTiles[i].value !== '0');

        expect(notMineTiles.filter((t: MinesweeperTileElement) => t.visited).length).toBeGreaterThan(i);
    });

    it('should trigger tile-select event when clicking tiles', () => {
        const tileSelectCallback = jasmine.createSpy('tileSelectCallback');
        minesweeperBoardElement.addEventListener('tile-select', tileSelectCallback);

        minesweeperBoardElement.initializeBoard(10, 10, 1);

        const clickEvent = new MouseEvent('mouseup', {
            bubbles: true
        });

        const tiles = minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile');
        tiles[0].dispatchEvent(clickEvent);

        expect(tileSelectCallback).toHaveBeenCalled();
    });

    it('should trigger win when clearing all tiles', () => {
        const wonCallback = jasmine.createSpy('wonCallback');
        minesweeperBoardElement.addEventListener('won', wonCallback);

        minesweeperBoardElement.initializeBoard(10, 10, 1);

        const clickEvent = new MouseEvent('mouseup', {
            bubbles: true
        });

        const notMineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine());

        for (let notMineTile of notMineTiles) {
            notMineTile.dispatchEvent(clickEvent);
        }

        expect([].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine())[0].value).toBe('🚩');
        expect(wonCallback).toHaveBeenCalled();
    });

    it('should trigger lose when clicking mine', () => {
        const lostCallback = jasmine.createSpy('lostCallback');
        minesweeperBoardElement.addEventListener('lost', lostCallback);

        minesweeperBoardElement.initializeBoard(10, 10, 1);

        const clickEvent = new MouseEvent('mouseup', {
            bubbles: true
        });

        const mineTile = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine())[0];
        mineTile.dispatchEvent(clickEvent);

        expect(lostCallback).toHaveBeenCalled();
    });

    it('should not do anything when clicking tiles after winning or losing', () => {
        const wonCallback = jasmine.createSpy('wonCallback');
        const lostCallback = jasmine.createSpy('lostCallback');
        const tileSelectCallback = jasmine.createSpy('tileSelectCallback');
        const flagCallback = jasmine.createSpy('flagCallback');
        const unflagCallback = jasmine.createSpy('unflagCallback');
        minesweeperBoardElement.addEventListener('won', wonCallback);
        minesweeperBoardElement.addEventListener('lost', lostCallback);
        minesweeperBoardElement.addEventListener('tile-select', tileSelectCallback);
        minesweeperBoardElement.addEventListener('tile-flag', flagCallback);
        minesweeperBoardElement.addEventListener('tile-unflag', unflagCallback);

        minesweeperBoardElement.initializeBoard(1, 2, 1);

        const clickEvent = new MouseEvent('mouseup', {
            bubbles: true
        });
        const leftClickEvent = new MouseEvent('contextmenu', {
            bubbles: true
        });

        const mineTile = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine())[0];
        const notMineTile = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine())[0];
        notMineTile.dispatchEvent(clickEvent);

        expect(tileSelectCallback).toHaveBeenCalledTimes(1);
        expect(wonCallback).toHaveBeenCalled();

        notMineTile.dispatchEvent(clickEvent);
        mineTile.dispatchEvent(clickEvent);
        mineTile.dispatchEvent(leftClickEvent);
        notMineTile.dispatchEvent(leftClickEvent);
        expect(tileSelectCallback).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        document.body.removeChild(minesweeperBoardElement);
    });
});