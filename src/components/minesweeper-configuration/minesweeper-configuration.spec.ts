import { MinesweeperConfigurationElement } from './minesweeper-configuration';
import { ConfigurationStore } from '../../utilities/configuration-store';

describe('Minesweeper configuration', () => {
    let minesweeperConfigurationElement: MinesweeperConfigurationElement;
    let displayElement: HTMLElement;

    beforeEach(() => {
        minesweeperConfigurationElement = <MinesweeperConfigurationElement>document.createElement('minesweeper-configuration');
        displayElement = minesweeperConfigurationElement.shadowRoot.getElementById('display');
        document.body.appendChild(minesweeperConfigurationElement);
    });

    it('should be an instance of a minesweeper configuration', () => {
        const element = document.querySelector('minesweeper-configuration');
        expect(element.constructor.name).toBe(MinesweeperConfigurationElement.name);
    });

    it('should not focus on mouse down', () => {
        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, buttons: 1 });

        displayElement.dispatchEvent(mouseDownEvent);

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
            const contextmenuEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });

            displayElement.dispatchEvent(contextmenuEvent);

            expect(contextmenuEvent.defaultPrevented).toBe(true);
            expect(setupDropdown).toHaveClass('visible');
        });

        it('when an alphanumeric key is pressed', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });

            displayElement.dispatchEvent(keydownEvent);

            expect(setupDropdown).toHaveClass('visible');
        });
    });

    describe('should hide list of games', () => {
        let setupDropdown: HTMLElement;

        beforeEach(() => {
            setupDropdown = minesweeperConfigurationElement.shadowRoot.getElementById('setup-dropdown');

            const contextmenuEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
            displayElement.dispatchEvent(contextmenuEvent);
        });

        it('when contextmenu is shown', () => {
            const contextmenuEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
            displayElement.dispatchEvent(contextmenuEvent);

            expect(contextmenuEvent.defaultPrevented).toBe(true);
            expect(setupDropdown).not.toHaveClass('visible');
        });

        it('when an alphanumeric key is pressed', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });

            displayElement.dispatchEvent(keydownEvent);

            expect(setupDropdown).not.toHaveClass('visible');
        });

        it('when the Escape key is pressed', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });

            displayElement.dispatchEvent(keydownEvent);

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

        it('when clicked', () => {
            const clickEvent = new MouseEvent('click', { bubbles: true });

            advancedGameOption.dispatchEvent(clickEvent);

            expect(newGameCallback).toHaveBeenCalledWith(jasmine.objectContaining({ detail: jasmine.objectContaining({ id: 3 }) }));
        });


        it('when space key is pressed', () => {
            const keyboardEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });

            advancedGameOption.dispatchEvent(keyboardEvent);

            expect(newGameCallback).toHaveBeenCalledWith(jasmine.objectContaining({ detail: jasmine.objectContaining({ id: 3 }) }));
        });

        it('when Enter key is pressed', () => {
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });

            advancedGameOption.dispatchEvent(keyboardEvent);

            expect(newGameCallback).toHaveBeenCalledWith(jasmine.objectContaining({ detail: jasmine.objectContaining({ id: 3 }) }));
        });
    });

    describe('should not start new game new advanced game', () => {
        let newGameCallback: jasmine.Func;
        let configurationOptionsFrame: HTMLElement;

        beforeEach(() => {
            configurationOptionsFrame = minesweeperConfigurationElement.shadowRoot.querySelector('ul');

            newGameCallback = jasmine.createSpy('newGameCallback');
            minesweeperConfigurationElement.addEventListener('new-game', newGameCallback);
        });

        it('when enter key is pressed not on a configuration option', () => {
            const clickEvent = new MouseEvent('click', { bubbles: true });

            configurationOptionsFrame.dispatchEvent(clickEvent);

            expect(newGameCallback).not.toHaveBeenCalled();
        });

        it('when mouse clicked not on a configuration option', () => {
            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });

            configurationOptionsFrame.dispatchEvent(keyboardEvent);

            expect(newGameCallback).not.toHaveBeenCalled();
        });
    });

    describe('should handle firefox active issue', () => {
        it('by setting "firefox-active" on mouse down', () => {
            const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });

            displayElement.dispatchEvent(mousedownEvent);

            expect(displayElement).toHaveClass('firefox-active');
        });

        describe('by removing "firefox-active"', () => {
            beforeEach(() => {
                displayElement.classList.add('firefox-active');
            });

            it('on mouse up', () => {
                const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });

                displayElement.dispatchEvent(mouseupEvent);

                expect(displayElement).not.toHaveClass('firefox-active');
            });

            it('on mouse out', () => {
                const mouseoutEvent = new MouseEvent('mouseout', { bubbles: true });

                displayElement.dispatchEvent(mouseoutEvent);

                expect(displayElement).not.toHaveClass('firefox-active');
            });
        });
    });

    afterEach(() => {
        document.body.removeChild(minesweeperConfigurationElement);
    });
});