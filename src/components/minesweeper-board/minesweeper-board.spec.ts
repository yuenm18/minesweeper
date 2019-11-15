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
        expect(element.constructor.name).toBe(MinesweeperBoardElement.name);
    });

    it('should reflect attributes to properties', () => {
        const width = 10, height = 15, mines = 20;
        minesweeperBoardElement.setAttribute('width', String(width));
        minesweeperBoardElement.setAttribute('height', String(height));
        minesweeperBoardElement.setAttribute('mines', String(mines));

        expect(minesweeperBoardElement.width).toEqual(width);
        expect(minesweeperBoardElement.height).toEqual(height);
        expect(minesweeperBoardElement.mines).toEqual(mines);
    });

    it('should reflect properties to attributes', () => {
        const width = 10, height = 15, mines = 20;
        minesweeperBoardElement.width = width;
        minesweeperBoardElement.height = height;
        minesweeperBoardElement.mines = mines;

        expect(minesweeperBoardElement.getAttribute('width')).toEqual(String(width));
        expect(minesweeperBoardElement.getAttribute('height')).toEqual(String(height));
        expect(minesweeperBoardElement.getAttribute('mines')).toEqual(String(mines));
    });

    it('should create a 10x10 board with 10 mines', () => {
        const width = 10, height = 11, mines = 10, total = width * height;
        minesweeperBoardElement.initializeBoard(width, height, mines);

        expect(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile').length).toBe(total);
        expect(minesweeperBoardElement.shadowRoot.querySelectorAll('tr').length).toBe(height);
        expect(minesweeperBoardElement.shadowRoot.querySelector('tr').querySelectorAll('td').length).toBe(width);
        expect([].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine()).length).toBe(mines);
    });

    it('should reveal tiles when clicking mine', () => {
        const width = 10, height = 10, mines = 10;
        minesweeperBoardElement.initializeBoard(width, height, mines);

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
        const width = 10, height = 10, mines = 1;
        minesweeperBoardElement.initializeBoard(width, height, mines);

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

        const width = 10, height = 10, mines = 1;
        minesweeperBoardElement.initializeBoard(width, height, mines);

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

        const width = 10, height = 10, mines = 1;
        minesweeperBoardElement.initializeBoard(width, height, mines);

        const clickEvent = new MouseEvent('mouseup', {
            bubbles: true
        });

        const notMineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine());

        for (const notMineTile of notMineTiles) {
            notMineTile.dispatchEvent(clickEvent);
        }

        expect([].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine())[0].value).toBe('🚩');
        expect(wonCallback).toHaveBeenCalled();
    });

    it('should trigger lose when clicking mine', () => {
        const lostCallback = jasmine.createSpy('lostCallback');
        minesweeperBoardElement.addEventListener('lost', lostCallback);

        const width = 10, height = 10, mines = 1;
        minesweeperBoardElement.initializeBoard(width, height, mines);

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

        const width = 1, height = 2, mines = 1;
        minesweeperBoardElement.initializeBoard(width, height, mines);

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

    describe('should navigate', () => {
        beforeEach(() => {
            const width = 3, height = 3, mines = 1;
            minesweeperBoardElement.initializeBoard(width, height, mines);
        });

        it('with arrow key up', () => {
            (<MinesweeperTileElement>minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="1"][y="0"]')).focus();
            const arrowUpKeyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowUp'
            });

            minesweeperBoardElement.dispatchEvent(arrowUpKeyEvent);

            expect(minesweeperBoardElement.shadowRoot.activeElement).toBe(minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="0"]'));
        });

        it('with arrow key up and wrap around', () => {
            (<MinesweeperTileElement>minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="0"]')).focus();
            const arrowUpKeyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowUp'
            });

            minesweeperBoardElement.dispatchEvent(arrowUpKeyEvent);

            expect(minesweeperBoardElement.shadowRoot.activeElement).toBe(minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="2"][y="0"]'));
        });

        it('with arrow key right', () => {
            (<MinesweeperTileElement>minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="0"]')).focus();
            const arrowRightKeyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight'
            });

            minesweeperBoardElement.dispatchEvent(arrowRightKeyEvent);

            expect(minesweeperBoardElement.shadowRoot.activeElement).toBe(minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="1"]'));
        });

        it('with arrow key right and wrap around', () => {
            (<MinesweeperTileElement>minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="2"]')).focus();
            const arrowRightKeyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight'
            });

            minesweeperBoardElement.dispatchEvent(arrowRightKeyEvent);

            expect(minesweeperBoardElement.shadowRoot.activeElement).toBe(minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="0"]'));
        });

        it('with arrow key down', () => {
            (<MinesweeperTileElement>minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="0"]')).focus();
            const arrowDownKeyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowDown'
            });

            minesweeperBoardElement.dispatchEvent(arrowDownKeyEvent);

            expect(minesweeperBoardElement.shadowRoot.activeElement).toBe(minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="1"][y="0"]'));
        });

        it('with arrow key down and wrap around', () => {
            (<MinesweeperTileElement>minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="2"][y="0"]')).focus();
            const arrowDownKeyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowDown'
            });

            minesweeperBoardElement.dispatchEvent(arrowDownKeyEvent);

            expect(minesweeperBoardElement.shadowRoot.activeElement).toBe(minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="0"]'));
        });
        
        it('with arrow key left', () => {
            (<MinesweeperTileElement>minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="1"]')).focus();
            const arrowLeftKeyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft'
            });

            minesweeperBoardElement.dispatchEvent(arrowLeftKeyEvent);

            expect(minesweeperBoardElement.shadowRoot.activeElement).toBe(minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="0"]'));
        });

        it('with arrow key left and wrap around', () => {
            (<MinesweeperTileElement>minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="0"]')).focus();
            const arrowLeftKeyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft'
            });

            minesweeperBoardElement.dispatchEvent(arrowLeftKeyEvent);

            expect(minesweeperBoardElement.shadowRoot.activeElement).toBe(minesweeperBoardElement.shadowRoot.querySelector('minesweeper-tile[x="0"][y="2"]'));
        });
    });
    
    afterEach(() => {
        document.body.removeChild(minesweeperBoardElement);
    });
});