import './minesweeper-configuration';
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
        expect(element.constructor).toBe(MinesweeperConfigurationElement);
    });

    it('should display happy', () => {
        minesweeperConfigurationElement.displayHappy();
        expect(minesweeperConfigurationElement.shadowRoot.getElementById('display').textContent).toBe('😊');
    });

    it('should display lost', () => {
        minesweeperConfigurationElement.displayLost();
        expect(minesweeperConfigurationElement.shadowRoot.getElementById('display').textContent).toBe('☹️');
    });

    it('should display surprise', () => {
        minesweeperConfigurationElement.displaySurprise();
        expect(minesweeperConfigurationElement.shadowRoot.getElementById('display').textContent).toBe('😮');
    });

    it('should display won', () => {
        minesweeperConfigurationElement.displayWon();
        expect(minesweeperConfigurationElement.shadowRoot.getElementById('display').textContent).toBe('😎');
    });

    it('should update high score', () => {
        spyOn(ConfigurationStore, 'addOrUpdateConfiguration').and.callThrough();
        minesweeperConfigurationElement.updateHighScore(100);
        expect(ConfigurationStore.addOrUpdateConfiguration).toHaveBeenCalledTimes(1);
        expect(ConfigurationStore.addOrUpdateConfiguration).toHaveBeenCalledWith(jasmine.objectContaining({ highScore: 100 }));
    });

    it('should show and hide list of games when right clicked', () => {
        const rightClickElement = new MouseEvent('contextmenu', { bubbles: true });
        minesweeperConfigurationElement.shadowRoot.dispatchEvent(rightClickElement);
        expect(minesweeperConfigurationElement.shadowRoot.getElementById('setup-dropdown')).toHaveClass('visible');

        minesweeperConfigurationElement.shadowRoot.dispatchEvent(rightClickElement);
        expect(minesweeperConfigurationElement.shadowRoot.getElementById('setup-dropdown')).not.toHaveClass('visible');
    });

    it('should start new games when clicked', () => {
        const callback = jasmine.createSpy();
        minesweeperConfigurationElement.addEventListener('new-game', callback);
        const clickEvent = new MouseEvent('click', { bubbles: true });
        minesweeperConfigurationElement.shadowRoot.getElementById('display').dispatchEvent(clickEvent);
        expect(callback).toHaveBeenCalled();
    });

    it('should start new advanced game', () => {
        const callback = jasmine.createSpy();
        minesweeperConfigurationElement.addEventListener('new-game', callback);
        const clickEvent = new MouseEvent('click', { bubbles: true });
        minesweeperConfigurationElement.shadowRoot.getElementById('3').dispatchEvent(clickEvent);
        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(jasmine.objectContaining({ detail: jasmine.objectContaining({ id: 3 }) }));
    });

    afterEach(() => {
        document.body.removeChild(minesweeperConfigurationElement);
    });
});