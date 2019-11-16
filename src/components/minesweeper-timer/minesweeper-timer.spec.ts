import { MinesweeperTimerElement } from './minesweeper-timer';

const FIVE_SECONDS_MS = 5000;
const FIVE_SECONDS_S = 5;

describe('Minesweeper timer element', () => {
    let minesweeperTimerElement: MinesweeperTimerElement;

    beforeEach(() => {
        minesweeperTimerElement = <MinesweeperTimerElement>document.createElement('minesweeper-timer');
        document.body.appendChild(minesweeperTimerElement);

        // need to uninstall first since we're mocking setInterval
        // https://github.com/jasmine/jasmine/issues/826#issuecomment-100028373
        jasmine.clock().uninstall();
        jasmine.clock().install();
    });

    it('should be an instance of a minesweeper timer', () => {
        const element = document.querySelector('minesweeper-timer');
        expect(element.constructor.name).toBe(MinesweeperTimerElement.name);
    });

    it('should start timer', () => {
        expect(minesweeperTimerElement.getTime()).toBe(0);
        spyOn(window, 'setInterval').and.callThrough();

        minesweeperTimerElement.start();
        jasmine.clock().tick(FIVE_SECONDS_MS);

        expect(minesweeperTimerElement.getTime()).toBe(FIVE_SECONDS_S);
        expect(setInterval).toHaveBeenCalled();
        expect(minesweeperTimerElement.isStarted()).toBeTruthy();
    });

    it('should not start timer if it is already started', () => {
        minesweeperTimerElement.start();
        spyOn(window, 'setInterval').and.callThrough();

        minesweeperTimerElement.start();
        jasmine.clock().tick(FIVE_SECONDS_MS);

        expect(setInterval).not.toHaveBeenCalled();
    });
    
    it('should display counts when counting', () => {
        minesweeperTimerElement.start();

        jasmine.clock().tick(FIVE_SECONDS_MS);

        expect(minesweeperTimerElement.getTime()).toBe(FIVE_SECONDS_S);
        expect(minesweeperTimerElement.shadowRoot.getElementById('display').textContent).toBe('005');
    });

    it('should stop timer', () => {
        minesweeperTimerElement.start();
        jasmine.clock().tick(FIVE_SECONDS_MS);
        
        minesweeperTimerElement.stop();
        jasmine.clock().tick(FIVE_SECONDS_MS);

        expect(minesweeperTimerElement.getTime()).toBe(FIVE_SECONDS_S);
    });

    it('should reset timer', () => {
        minesweeperTimerElement.start();
        jasmine.clock().tick(FIVE_SECONDS_MS);
        
        minesweeperTimerElement.reset();
        jasmine.clock().tick(FIVE_SECONDS_MS);

        expect(minesweeperTimerElement.getTime()).toBe(0);
    });

    afterEach(() => {
        document.body.removeChild(minesweeperTimerElement);
        
        jasmine.clock().uninstall();
    });
});