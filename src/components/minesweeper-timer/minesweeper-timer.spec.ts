import './minesweeper-timer';
import { MinesweeperTimerElement } from './minesweeper-timer';

const FIVE_SECONDS_MS = 5000;
const FIVE_SECONDS_S = 5;

describe('Minesweeper timer element', () => {
    let minesweeperTimerElement: MinesweeperTimerElement;

    beforeEach(() => {
        minesweeperTimerElement = <MinesweeperTimerElement>document.createElement('minesweeper-timer');
        document.body.appendChild(minesweeperTimerElement);

        jasmine.clock().install();
    });

    it('should be an instance of a minesweeper timer', () => {
        const element = document.querySelector('minesweeper-timer');
        expect(element.constructor).toBe(MinesweeperTimerElement);
    });

    it('should start timer', () => {
        expect(minesweeperTimerElement.getTime()).toBe(0);
        jasmine.clock().tick(FIVE_SECONDS_MS);
        expect(minesweeperTimerElement.getTime()).toBe(0);

        minesweeperTimerElement.start();
        jasmine.clock().tick(FIVE_SECONDS_MS);
        expect(minesweeperTimerElement.getTime()).toBe(FIVE_SECONDS_S);
        expect(minesweeperTimerElement.isStarted).toBeTruthy();
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
        expect(minesweeperTimerElement.getTime()).toBe(FIVE_SECONDS_S);
        
        minesweeperTimerElement.stop();
        jasmine.clock().tick(FIVE_SECONDS_MS);
        expect(minesweeperTimerElement.getTime()).toBe(FIVE_SECONDS_S);
    });

    it('should reset timer', () => {
        minesweeperTimerElement.start();
        jasmine.clock().tick(FIVE_SECONDS_MS);
        expect(minesweeperTimerElement.getTime()).toBe(FIVE_SECONDS_S);
        
        minesweeperTimerElement.reset();
        jasmine.clock().tick(FIVE_SECONDS_MS);
        expect(minesweeperTimerElement.getTime()).toBe(0);
    });

    afterEach(() => {
        document.body.removeChild(minesweeperTimerElement);
        
        jasmine.clock().uninstall();
    });
});