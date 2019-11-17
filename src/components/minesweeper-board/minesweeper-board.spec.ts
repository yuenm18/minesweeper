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

    it('should not show contextmenu', () => {
        const contextmenuEvent = new MouseEvent('contextmenu', { cancelable: true });

        minesweeperBoardElement.dispatchEvent(contextmenuEvent);

        expect(contextmenuEvent.defaultPrevented).toBeTruthy();
    });

    describe('should initialized board', () => {
        it('that is 10x11 with 10 mines', () => {
            const width = 10, height = 11, mines = 10, total = width * height;
            minesweeperBoardElement.initializeBoard(width, height, mines);

            expect(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile').length).toBe(total);
            expect(minesweeperBoardElement.shadowRoot.querySelectorAll('tr').length).toBe(height);
            expect(minesweeperBoardElement.shadowRoot.querySelector('tr').querySelectorAll('td').length).toBe(width);
            expect([].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine()).length).toBe(mines);
        });


        it('with current width, height and mines if they are not provided', () => {
            const width = 10, height = 11, mines = 10, total = width * height;
            minesweeperBoardElement.width = width;
            minesweeperBoardElement.height = height;
            minesweeperBoardElement.mines = mines;
            minesweeperBoardElement.initializeBoard();

            expect(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile').length).toBe(total);
            expect(minesweeperBoardElement.shadowRoot.querySelectorAll('tr').length).toBe(height);
            expect(minesweeperBoardElement.shadowRoot.querySelector('tr').querySelectorAll('td').length).toBe(width);
            expect([].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine()).length).toBe(mines);
        });
    });

    describe('should not initialize board', () => {
        it('if the number of mines is greater than the number of tiles', () => {
            spyOn(console, 'error');
            const oldWidth = 10, oldHeight = 10, oldMines = 10;
            minesweeperBoardElement.initializeBoard(oldWidth, oldHeight, oldMines);
            const newWidth = 11, newHeight = 11, newMines = 122;

            minesweeperBoardElement.initializeBoard(newWidth, newHeight, newMines);

            expect(minesweeperBoardElement.height).toBe(oldHeight);
            expect(minesweeperBoardElement.width).toBe(oldWidth);
            expect(minesweeperBoardElement.mines).toBe(oldMines);
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('should reveal', () => {
        it('all mines when clicking mine', () => {
            const width = 10, height = 10, mines = 10;
            minesweeperBoardElement.initializeBoard(width, height, mines);
            const notMineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine());
            const mineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine());
            const flaggedNotMineTile = notMineTiles[0];
            const flaggedMineTile = mineTiles[0];
            const clickedTile = mineTiles[1];
            const notFlaggedMineTiles = mineTiles.filter((t: MinesweeperTileElement) => t !== flaggedMineTile);
            const tileSelectEvent = new CustomEvent('tile-select', { bubbles: true, composed: true });
            flaggedNotMineTile.flag();
            flaggedMineTile.flag();
    
            clickedTile.dispatchEvent(tileSelectEvent);
    
            expect(flaggedNotMineTile.value).toBe('❌');
            expect(flaggedMineTile.value).toBe('🚩');
            expect(mineTiles.filter((t: MinesweeperTileElement) => t !== flaggedMineTile && t.value === '💣')).toEqual(notFlaggedMineTiles);
        });
    
        it('surrounding tiles if tile has no surrounding mines', () => {
            const width = 10, height = 10, mines = 1;
            minesweeperBoardElement.initializeBoard(width, height, mines);
            const tileSelectEvent = new CustomEvent('tile-select', { bubbles: true, composed: true });
            const notMineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine());
    
            let i = 0;
            do {
                notMineTiles[i].dispatchEvent(tileSelectEvent);
                i++;
            } while (notMineTiles[i].value !== '0');
    
            expect(notMineTiles.filter((t: MinesweeperTileElement) => t.visited).length).toBeGreaterThan(i);
        });
        
        it('not all tiles when one is clicked', () => {
            const width = 10, height = 10, mines = 98;
            minesweeperBoardElement.initializeBoard(width, height, mines);
            const notMineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine());
            const clickedTile = notMineTiles[0];
            const tileSelectEvent = new CustomEvent('tile-select', { bubbles: true, composed: true });
            const wonCallback = jasmine.createSpy('wonCallback');
            minesweeperBoardElement.addEventListener('won', wonCallback);
    
            clickedTile.dispatchEvent(tileSelectEvent);
    
            expect(wonCallback).not.toHaveBeenCalled();
        });
    });

    describe('should trigger', () => {
        let tileSelectEvent: CustomEvent;

        beforeEach(() => {
            const width = 10, height = 10, mines = 1;
            minesweeperBoardElement.initializeBoard(width, height, mines);
            tileSelectEvent = new CustomEvent('tile-select', { bubbles: true, composed: true });
        });

        it('should trigger win when clearing all tiles', () => {
            const wonCallback = jasmine.createSpy('wonCallback');
            minesweeperBoardElement.addEventListener('won', wonCallback);
            const notMineTiles = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine());
    
            for (const notMineTile of notMineTiles) {
                notMineTile.dispatchEvent(tileSelectEvent);
            }
    
            expect([].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine())[0].value).toBe('🚩');
            expect(wonCallback).toHaveBeenCalled();
        });
    
        it('should trigger lose when clicking mine', () => {
            const lostCallback = jasmine.createSpy('lostCallback');
            minesweeperBoardElement.addEventListener('lost', lostCallback);
    
            const mineTile = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine())[0];
            mineTile.dispatchEvent(tileSelectEvent);
    
            expect(lostCallback).toHaveBeenCalled();
        });
    });

    describe('should set all tiles to disabled after', () => {
        let tiles: NodeList;
        let tileSelectEvent: CustomEvent;

        beforeEach(() => {
            const width = 1, height = 2, mines = 1;
            minesweeperBoardElement.initializeBoard(width, height, mines);
            tiles = minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile');
            tileSelectEvent = new CustomEvent('tile-select', { bubbles: true, composed: true });
        });

        it('losing', () => {
            const notMineTile = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => !t.isMine())[0];

            // trigger lose
            notMineTile.dispatchEvent(tileSelectEvent);

            tiles.forEach(t => expect((<MinesweeperTileElement>t).isDisabled()).toBeTruthy());
        });

        it('winning', () => {
            const mineTile = [].filter.call(minesweeperBoardElement.shadowRoot.querySelectorAll('minesweeper-tile'), (t: MinesweeperTileElement) => t.isMine())[0];

            // trigger win
            mineTile.dispatchEvent(tileSelectEvent);

            tiles.forEach(t => expect((<MinesweeperTileElement>t).isDisabled()).toBeTruthy());
        });
    });

    it('should not error if trying to navigate when element is not focused', () => {
        const arrowUpKeyEvent = new KeyboardEvent('keydown', {
            key: 'ArrowUp'
        });

        expect(() => minesweeperBoardElement.dispatchEvent(arrowUpKeyEvent)).not.toThrow();
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