import './minesweeper-timer';
import { MinesweeperTimerElement } from './minesweeper-timer';

describe('Minesweeper timer element', () => {
    let minesweeperTimerElement: MinesweeperTimerElement;

    beforeEach(() => {
        minesweeperTimerElement = <MinesweeperTimerElement>document.createElement('minesweeper-timer');
        document.body.appendChild(minesweeperTimerElement);

        jasmine.clock().install();
    });

    it('should be an instance of a minesweeper timer', () => {
        let element = document.querySelector('minesweeper-timer');
        expect(element.constructor).toBe(MinesweeperTimerElement);
    });

    it('should start timer', () => {
        expect(minesweeperTimerElement.getTime()).toBe(0);
        jasmine.clock().tick(5000);
        expect(minesweeperTimerElement.getTime()).toBe(0);

        minesweeperTimerElement.start();
        jasmine.clock().tick(5000);
        expect(minesweeperTimerElement.getTime()).toBe(5);
        expect(minesweeperTimerElement.isStarted).toBeTruthy();
    });
    
    it('should display counts when counting', () => {
        minesweeperTimerElement.start();
        jasmine.clock().tick(5000);
        expect(minesweeperTimerElement.getTime()).toBe(5);
        expect(minesweeperTimerElement.shadowRoot.getElementById('display').textContent).toBe('005');
    });

    it('should stop timer', () => {
        minesweeperTimerElement.start();
        jasmine.clock().tick(5000);
        expect(minesweeperTimerElement.getTime()).toBe(5);
        
        minesweeperTimerElement.stop();
        jasmine.clock().tick(5000);
        expect(minesweeperTimerElement.getTime()).toBe(5);
    });

    it('should reset timer', () => {
        minesweeperTimerElement.start();
        jasmine.clock().tick(5000);
        expect(minesweeperTimerElement.getTime()).toBe(5);
        
        minesweeperTimerElement.reset();
        jasmine.clock().tick(5000);
        expect(minesweeperTimerElement.getTime()).toBe(0);
    });

    afterEach(() => {
        document.body.removeChild(minesweeperTimerElement);
        
        jasmine.clock().uninstall();
    });
});