import { MinesweeperConfigurationElement } from './minesweeper-configuration';
import { ConfigurationStore } from '../../utilities/configuration-store';

describe('Minesweeper configuration', () => {
    let minesweeperConfigurationElement: MinesweeperConfigurationElement;

    beforeEach(() => {
        minesweeperConfigurationElement = <MinesweeperConfigurationElement>document.createElement('minesweeper-configuration');
        document.body.appendChild(minesweeperConfigurationElement);
    });

    it('should be an instance of a minesweeper configuration', () => {
        const element = document.querySelector('minesweeper-configuration');
        expect(element.constructor.name).toBe(MinesweeperConfigurationElement.name);
    });

    it('should not focus on mouse down', () => {
        const mouseDownEvent = new MouseEvent('mousedown');
        Object.defineProperty(mouseDownEvent, 'buttons', {
            value: 1
        });

        minesweeperConfigurationElement.dispatchEvent(mouseDownEvent);

        expect(document.activeElement).not.toBe(minesweeperConfigurationElement);
    });
    
    it('should update high score', () => {
        const newHighScore = 100;
        spyOn(ConfigurationStore, 'addOrUpdateConfiguration').and.callThrough();

        minesweeperConfigurationElement.updateHighScore(newHighScore);
        
        expect(ConfigurationStore.addOrUpdateConfiguration).toHaveBeenCalledTimes(1);
        expect(ConfigurationStore.addOrUpdateConfiguration).toHaveBeenCalledWith(jasmine.objectContaining({ highScore: newHighScore }));
    });

    it('should start new game when button is clicked', () => {
        const newGameCallback = jasmine.createSpy('newGameCallback');
        minesweeperConfigurationElement.addEventListener('new-game', newGameCallback);
        const clickEvent = new MouseEvent('click', { bubbles: true });

        minesweeperConfigurationElement.shadowRoot.getElementById('display').dispatchEvent(clickEvent);

        expect(newGameCallback).toHaveBeenCalled();
    });

    describe('should display', () => {
        let displayElement: HTMLElement;

        beforeEach(() => {
            displayElement = minesweeperConfigurationElement.shadowRoot.getElementById('display');
        });

        it('happy by default', () => {
            expect(displayElement.textContent).toBe('😊');
        });

        it('happy', () => {
            minesweeperConfigurationElement.displayWon();

            minesweeperConfigurationElement.displayHappy();

            expect(displayElement.textContent).toBe('😊');
        });

        it('lost', () => {
            minesweeperConfigurationElement.displayLost();

            expect(displayElement.textContent).toBe('☹️');
        });

        it('surprise', () => {
            minesweeperConfigurationElement.displaySurprise();

            expect(displayElement.textContent).toBe('😮');
        });

        it('won', () => {
            minesweeperConfigurationElement.displayWon();

            expect(displayElement.textContent).toBe('😎');
        });
    });

    describe('should show list of games', () => {
        let setupDropdown: HTMLElement;

        beforeEach(() => {
            setupDropdown = minesweeperConfigurationElement.shadowRoot.getElementById('setup-dropdown');
        });

        it('when contextmenu is shown', () => {
            const contextmenuEvent = new MouseEvent('contextmenu', { bubbles: true });

            minesweeperConfigurationElement.dispatchEvent(contextmenuEvent);

            expect(setupDropdown).toHaveClass('visible');
        });

        it('when an alphanumeric key is clicked', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });

            minesweeperConfigurationElement.dispatchEvent(keydownEvent);

            expect(setupDropdown).toHaveClass('visible');
        });

    });

    describe('should hide list of games', () => {
        let setupDropdown: HTMLElement;

        beforeEach(() => {
            setupDropdown = minesweeperConfigurationElement.shadowRoot.getElementById('setup-dropdown');

            const contextmenuEvent = new MouseEvent('contextmenu', { bubbles: true });
            minesweeperConfigurationElement.dispatchEvent(contextmenuEvent);
        });

        it('when contextmenu is shown', () => {
            const contextmenuEvent = new MouseEvent('contextmenu', { bubbles: true });

            minesweeperConfigurationElement.dispatchEvent(contextmenuEvent);

            expect(setupDropdown).not.toHaveClass('visible');
        });

        it('when an alphanumeric key is clicked', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });

            minesweeperConfigurationElement.dispatchEvent(keydownEvent);

            expect(setupDropdown).not.toHaveClass('visible');
        });

        it('when the Escape key is clicked', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });

            minesweeperConfigurationElement.dispatchEvent(keydownEvent);

            expect(setupDropdown).not.toHaveClass('visible');
        });
    });

    describe('should start new game new advanced game', () => {
        let newGameCallback: jasmine.Func;
        let advancedGameOption: HTMLElement;

        beforeEach(() => {
            advancedGameOption = minesweeperConfigurationElement.shadowRoot.getElementById('3');
            
            newGameCallback = jasmine.createSpy('newGameCallback');
            minesweeperConfigurationElement.addEventListener('new-game', newGameCallback);
        });

        it('should start', () => {
            const clickEvent = new MouseEvent('click', { bubbles: true });

            advancedGameOption.dispatchEvent(clickEvent);

            expect(newGameCallback).toHaveBeenCalledWith(jasmine.objectContaining({ detail: jasmine.objectContaining({ id: 3 }) }));
        });


        it('when space key is pressed', () => {
            const keyboardEvent = new KeyboardEvent('click', { key: ' ', bubbles: true });

            advancedGameOption.dispatchEvent(keyboardEvent);

            expect(newGameCallback).toHaveBeenCalledWith(jasmine.objectContaining({ detail: jasmine.objectContaining({ id: 3 }) }));
        });

        it('when Enter key is pressed', () => {
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });

            advancedGameOption.dispatchEvent(keyboardEvent);

            expect(newGameCallback).toHaveBeenCalledWith(jasmine.objectContaining({ detail: jasmine.objectContaining({ id: 3 }) }));
        });
    });

    afterEach(() => {
        document.body.removeChild(minesweeperConfigurationElement);
    });
});