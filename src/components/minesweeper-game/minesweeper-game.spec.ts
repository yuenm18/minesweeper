import './minesweeper-game';
import { MinesweeperGameElement } from './minesweeper-game';
import { MinesweeperTimerElement } from '../minesweeper-timer/minesweeper-timer';
import { MinesweeperRemainingMinesElement } from '../minesweeper-remaining-mines/minesweeper-remaining-mines';
import { MinesweeperConfigurationElement } from '../minesweeper-configuration/minesweeper-configuration';
import { MinesweeperBoardElement } from '../minesweeper-board/minesweeper-board';

describe('Minesweeper game', () => {
    let minesweeperGameElement: MinesweeperGameElement;
    let minesweeperRemainingMinesElement: MinesweeperRemainingMinesElement;
    let minesweeperConfigurationElement: MinesweeperConfigurationElement;
    let minesweeperTimerElement: MinesweeperTimerElement;
    let minesweeperBoardElement: MinesweeperBoardElement;

    beforeEach(() => {
        minesweeperGameElement = <MinesweeperGameElement>document.createElement('minesweeper-game');
        document.body.appendChild(minesweeperGameElement);

        minesweeperRemainingMinesElement = <MinesweeperRemainingMinesElement>minesweeperGameElement.shadowRoot.getElementById('remaining-mines');
        minesweeperConfigurationElement = <MinesweeperConfigurationElement>minesweeperGameElement.shadowRoot.getElementById('configuration');
        minesweeperTimerElement = <MinesweeperTimerElement>minesweeperGameElement.shadowRoot.getElementById('timer');
        minesweeperBoardElement = <MinesweeperBoardElement>minesweeperGameElement.shadowRoot.getElementById('board');

        spyOn(minesweeperBoardElement, 'initializeBoard').and.callThrough();
        spyOn(minesweeperTimerElement, 'reset').and.callThrough();
        spyOn(minesweeperTimerElement, 'start').and.callThrough();
        spyOn(minesweeperTimerElement, 'stop').and.callThrough();
        spyOn(minesweeperConfigurationElement, 'displayHappy').and.callThrough();
        spyOn(minesweeperConfigurationElement, 'displaySurprise').and.callThrough();
        spyOn(minesweeperConfigurationElement, 'displayWon').and.callThrough();
        spyOn(minesweeperConfigurationElement, 'displayLost').and.callThrough();
        spyOn(minesweeperRemainingMinesElement, 'reset').and.callThrough();
        spyOn(minesweeperRemainingMinesElement, 'decrease').and.callThrough();
        spyOn(minesweeperRemainingMinesElement, 'increase').and.callThrough();


        jasmine.clock().install();
        jasmine.clock().tick(1);
    });

    it('should be instance of minesweeper game', () => {
        const element = document.querySelector('minesweeper-game');
        expect(element.constructor).toBe(MinesweeperGameElement);
    });

    it('should go to started state after receiving new game event', () => {
        const newGameEvent = new CustomEvent('new-game', {
            detail: {
                id: 1,
                name: 'Beginner',
                width: 9,
                height: 9,
                mines: 10,
                highScore: Infinity
            },
            bubbles: true
        });

        minesweeperConfigurationElement.dispatchEvent(newGameEvent);
        jasmine.clock().tick(1);

        expect(minesweeperBoardElement.initializeBoard).toHaveBeenCalled();
        expect(minesweeperTimerElement.reset).toHaveBeenCalled();
        expect(minesweeperConfigurationElement.displayHappy).toHaveBeenCalled();
        expect(minesweeperRemainingMinesElement.reset).toHaveBeenCalled();
    });

    it('should go to started state after receiving tile selected event', () => {
        const tileSelectedEvent = new CustomEvent('tile-selected', {
            bubbles: true
        });

        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);

        expect(minesweeperConfigurationElement.displayHappy).toHaveBeenCalled();
        expect(minesweeperTimerElement.start).toHaveBeenCalled();
    });

    it('should go to started state after receiving won event', () => {
        const wonEvent = new CustomEvent('won', {
            bubbles: true
        });

        minesweeperBoardElement.dispatchEvent(wonEvent);

        expect(minesweeperConfigurationElement.displayWon).toHaveBeenCalled();
        expect(minesweeperTimerElement.stop).toHaveBeenCalled();
    });

    it('should go to started state after receiving lost event', () => {
        const lostEvent = new CustomEvent('lost', {
            bubbles: true
        });

        minesweeperBoardElement.dispatchEvent(lostEvent);

        expect(minesweeperConfigurationElement.displayLost).toHaveBeenCalled();
        expect(minesweeperTimerElement.stop).toHaveBeenCalled();
    });

    it('should go decrease remaining mine count after receiving flag event', () => {
        const flagEvent = new CustomEvent('flag', {
            bubbles: true
        });

        minesweeperBoardElement.dispatchEvent(flagEvent);

        expect(minesweeperRemainingMinesElement.decrease).toHaveBeenCalled();
    });

    it('should go increase remaining mine count after receiving unflag event', () => {
        const unflagEvent = new CustomEvent('unflag', {
            bubbles: true
        });

        minesweeperBoardElement.dispatchEvent(unflagEvent);

        expect(minesweeperRemainingMinesElement.increase).toHaveBeenCalled();
    });

    it('should display surprise after receiving mousedown event from board', () => {
        const mousedownEvent = new MouseEvent('mousedown', {
            bubbles: true
        });

        const tileSelectedEvent = new CustomEvent('tile-selected', {
            bubbles: true
        });

        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);
        minesweeperBoardElement.dispatchEvent(mousedownEvent);

        expect(minesweeperConfigurationElement.displaySurprise).toHaveBeenCalled();
    });

    it('should display smile after receiving mouseup event from board', () => {
        const mouseupEvent = new MouseEvent('mouseup', {
            bubbles: true
        });
        
        const tileSelectedEvent = new CustomEvent('tile-selected', {
            bubbles: true
        });

        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);
        minesweeperBoardElement.dispatchEvent(mouseupEvent);

        expect(minesweeperConfigurationElement.displayHappy).toHaveBeenCalled();
    });

    afterEach(() => {
        document.body.removeChild(minesweeperGameElement);
        jasmine.clock().uninstall();
    });
});