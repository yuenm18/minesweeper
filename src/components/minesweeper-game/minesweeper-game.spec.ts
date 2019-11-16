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
        
        // need to uninstall first since we're mocking setInterval in some tests (even if they're outside this file)
        // https://github.com/jasmine/jasmine/issues/826#issuecomment-100028373
        jasmine.clock().uninstall();
        jasmine.clock().install();
        jasmine.clock().tick(1);

        minesweeperRemainingMinesElement = <MinesweeperRemainingMinesElement>minesweeperGameElement.shadowRoot.getElementById('remaining-mines');
        minesweeperConfigurationElement = <MinesweeperConfigurationElement>minesweeperGameElement.shadowRoot.getElementById('configuration');
        minesweeperTimerElement = <MinesweeperTimerElement>minesweeperGameElement.shadowRoot.getElementById('timer');
        minesweeperBoardElement = <MinesweeperBoardElement>minesweeperGameElement.shadowRoot.getElementById('board');

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

        spyOn(minesweeperBoardElement, 'initializeBoard').and.callThrough();
        spyOn(minesweeperTimerElement, 'reset').and.callThrough();
        spyOn(minesweeperTimerElement, 'start').and.callThrough();
        spyOn(minesweeperTimerElement, 'stop').and.callThrough();
        spyOn(minesweeperConfigurationElement, 'updateHighScore').and.callThrough();
        spyOn(minesweeperConfigurationElement, 'displayHappy').and.callThrough();
        spyOn(minesweeperConfigurationElement, 'displaySurprise').and.callThrough();
        spyOn(minesweeperConfigurationElement, 'displayWon').and.callThrough();
        spyOn(minesweeperConfigurationElement, 'displayLost').and.callThrough();
        spyOn(minesweeperRemainingMinesElement, 'reset').and.callThrough();
        spyOn(minesweeperRemainingMinesElement, 'decrease').and.callThrough();
        spyOn(minesweeperRemainingMinesElement, 'increase').and.callThrough();
    });

    it('should be instance of minesweeper game', () => {
        const element = document.querySelector('minesweeper-game');
        expect(element.constructor.name).toBe(MinesweeperGameElement.name);
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

    it('should go to in progress state after receiving tile select event', () => {
        const tileSelectedEvent = new CustomEvent('tile-select', { bubbles: true });

        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);

        expect(minesweeperConfigurationElement.displayHappy).toHaveBeenCalled();
        expect(minesweeperTimerElement.start).toHaveBeenCalled();
    });

    it('should go to won state after receiving won event', () => {
        const wonEvent = new CustomEvent('won', { bubbles: true });

        minesweeperBoardElement.dispatchEvent(wonEvent);

        expect(minesweeperConfigurationElement.displayWon).toHaveBeenCalled();
        expect(minesweeperTimerElement.stop).toHaveBeenCalled();
    });

    it('should go to lost state after receiving lost event', () => {
        const lostEvent = new CustomEvent('lost', { bubbles: true });

        minesweeperBoardElement.dispatchEvent(lostEvent);

        expect(minesweeperConfigurationElement.displayLost).toHaveBeenCalled();
        expect(minesweeperTimerElement.stop).toHaveBeenCalled();
    });

    it('should go decrease remaining mine count after receiving flag event', () => {
        const flagEvent = new CustomEvent('tile-flag', { bubbles: true });

        minesweeperBoardElement.dispatchEvent(flagEvent);

        expect(minesweeperRemainingMinesElement.decrease).toHaveBeenCalled();
    });

    it('should go increase remaining mine count after receiving unflag event', () => {
        const unflagEvent = new CustomEvent('tile-unflag', { bubbles: true });

        minesweeperBoardElement.dispatchEvent(unflagEvent);

        expect(minesweeperRemainingMinesElement.increase).toHaveBeenCalled();
    });

    it('should display surprise after receiving mousedown event from board', () => {
        const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
        const tileSelectedEvent = new CustomEvent('tile-select', { bubbles: true });

        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);
        minesweeperBoardElement.dispatchEvent(mousedownEvent);

        expect(minesweeperConfigurationElement.displaySurprise).toHaveBeenCalled();
    });

    it('should not display surprise after receiving mousedown event form board if game is over', () => {
        const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
        const wonEvent = new CustomEvent('won', { bubbles: true });

        minesweeperBoardElement.dispatchEvent(wonEvent);
        minesweeperBoardElement.dispatchEvent(mousedownEvent);

        expect(minesweeperConfigurationElement.displaySurprise).not.toHaveBeenCalled();
    });

    it('should not display happy after receiving mouseup event from board', () => {
        const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
        const wonEvent = new CustomEvent('won', { bubbles: true });

        minesweeperBoardElement.dispatchEvent(wonEvent);
        minesweeperBoardElement.dispatchEvent(mouseupEvent);

        expect(minesweeperConfigurationElement.displayHappy).not.toHaveBeenCalled();
    });

    it('should display happy after receiving mouseup event from board', () => {
        const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });
        const tileSelectedEvent = new CustomEvent('tile-select', { bubbles: true });

        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);
        minesweeperBoardElement.dispatchEvent(mouseupEvent);

        expect(minesweeperConfigurationElement.displayHappy).toHaveBeenCalled();
    });

    it('should not update high score if current time is less than high score', () => {
        const wonEvent = new CustomEvent('won', { bubbles: true });
        const tileSelectedEvent = new CustomEvent('tile-select', { bubbles: true });
        const newGameEvent = new CustomEvent('new-game', {
            detail: {
                id: 1,
                name: 'Beginner',
                width: 9,
                height: 9,
                mines: 10,
                highScore: 0
            },
            bubbles: true
        });

        minesweeperConfigurationElement.dispatchEvent(newGameEvent);
        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);
        minesweeperBoardElement.dispatchEvent(wonEvent);

        expect(minesweeperConfigurationElement.updateHighScore).not.toHaveBeenCalled();
    });

    it('should not update high score if current time is less than high score', () => {
        const wonEvent = new CustomEvent('won', { bubbles: true });
        const tileSelectedEvent = new CustomEvent('tile-select', { bubbles: true });
        
        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);
        minesweeperBoardElement.dispatchEvent(wonEvent);

        expect(minesweeperConfigurationElement.updateHighScore).toHaveBeenCalled();
    });

    it('should not start timer if timer is already started', () => {
        const tileSelectedEvent = new CustomEvent('tile-select', { bubbles: true });
        
        minesweeperTimerElement.start();
        (<jasmine.Spy>minesweeperTimerElement.start).calls.reset();
        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);

        expect(minesweeperTimerElement.start).not.toHaveBeenCalled();
    });

    it('should not set game state to in progress if the current state isn\'t started', () => {
        const wonEvent = new CustomEvent('won', { bubbles: true });
        const tileSelectedEvent = new CustomEvent('tile-select', { bubbles: true });
        
        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);
        minesweeperBoardElement.dispatchEvent(wonEvent);
        (<jasmine.Spy>minesweeperConfigurationElement.displayHappy).calls.reset();
        minesweeperBoardElement.dispatchEvent(tileSelectedEvent);

        expect(minesweeperConfigurationElement.displayHappy).not.toHaveBeenCalled();
    });

    afterEach(() => {
        document.body.removeChild(minesweeperGameElement);
        jasmine.clock().uninstall();
    });
});