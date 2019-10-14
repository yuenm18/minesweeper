import './minesweeper-remaining-mines';
import { MinesweeperRemainingMinesElement } from './minesweeper-remaining-mines';

describe('Minesweeper remaining element', () => {
    let minesweeperRemainingMinesElement: MinesweeperRemainingMinesElement;

    beforeEach(() => {
        minesweeperRemainingMinesElement = <MinesweeperRemainingMinesElement>document.createElement('minesweeper-remaining-mines');
        document.body.appendChild(minesweeperRemainingMinesElement);

        jasmine.clock().install();
    });

    it('should be an instance of a minesweeper remaining mines', () => {
        let element = document.querySelector('minesweeper-remaining-mines');
        expect(element.constructor).toBe(MinesweeperRemainingMinesElement);
    });

    it('should reflect properties to attributes', () => {
        minesweeperRemainingMinesElement.count = 10;
        expect(minesweeperRemainingMinesElement.getAttribute('count')).toBe('10');
    });

    it('should reflect attributes to properties', () => {
        minesweeperRemainingMinesElement.setAttribute('count', '10');
        expect(minesweeperRemainingMinesElement.count).toBe(10);
    });

    it('should reset count', () => {
        minesweeperRemainingMinesElement.reset(10);
        expect(minesweeperRemainingMinesElement.count).toBe(10);
    });

    it('should increase count', () => {
        minesweeperRemainingMinesElement.reset(10);
        expect(minesweeperRemainingMinesElement.count).toBe(10);

        minesweeperRemainingMinesElement.increase();
        expect(minesweeperRemainingMinesElement.count).toBe(11);
    });

    it('should descrease count', () => {
        minesweeperRemainingMinesElement.reset(10);
        expect(minesweeperRemainingMinesElement.count).toBe(10);
        
        minesweeperRemainingMinesElement.decrease();
        expect(minesweeperRemainingMinesElement.count).toBe(9);
    });

    it('should reflect count to display', () => {
        minesweeperRemainingMinesElement.reset(10);
        expect(minesweeperRemainingMinesElement.shadowRoot.getElementById('display').textContent).toBe('010');
        
        minesweeperRemainingMinesElement.increase();
        expect(minesweeperRemainingMinesElement.shadowRoot.getElementById('display').textContent).toBe('011');
    });

    afterEach(() => {
        document.body.removeChild(minesweeperRemainingMinesElement);
        
        jasmine.clock().uninstall();
    });
});