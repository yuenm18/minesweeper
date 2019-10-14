import './minesweeper-tile';
import { MinesweeperTileElement } from './minesweeper-tile';

describe('Minesweeper tile element', () => {
    let minesweeperTileElement: MinesweeperTileElement;

    beforeEach(() => {
        minesweeperTileElement = <MinesweeperTileElement>document.createElement('minesweeper-tile');
        document.body.appendChild(minesweeperTileElement);
    });

    it('should be an instance of a minesweeper tile', () => {
        let element = document.querySelector('minesweeper-tile');
        expect(element.constructor).toBe(MinesweeperTileElement);
    });

    it('should reflect properties to attributes', () => {
        minesweeperTileElement.x = 1;
        minesweeperTileElement.y = 2;
        minesweeperTileElement.value = '3';

        expect(minesweeperTileElement.getAttribute('x')).toEqual('1');
        expect(minesweeperTileElement.getAttribute('y')).toEqual('2');
        expect(minesweeperTileElement.getAttribute('value')).toEqual('3');
    });

    it('should reflect properties to attributes', () => {
        minesweeperTileElement.setAttribute('x', '1');
        minesweeperTileElement.setAttribute('y', '2');
        minesweeperTileElement.setAttribute('value', '3');

        expect(minesweeperTileElement.x).toEqual(1);
        expect(minesweeperTileElement.y).toEqual(2);
        expect(minesweeperTileElement.value).toEqual('3');
    });

    it('should be pressed on mouse down', () => {
        const mouseDownEvent = new MouseEvent('mousedown');
        Object.defineProperty(mouseDownEvent, 'buttons', {
            value: 1
        });

        minesweeperTileElement.dispatchEvent(mouseDownEvent);

        expect(minesweeperTileElement.hasAttribute('pressed')).toBeTruthy();
    });

    it('should be pressed on mouse over', () => {
        const mouseOverEvent = new MouseEvent('mouseover');
        Object.defineProperty(mouseOverEvent, 'buttons', {
            value: 1
        });

        minesweeperTileElement.dispatchEvent(mouseOverEvent);

        expect(minesweeperTileElement.hasAttribute('pressed')).toBeTruthy();
    });

    it('should not be pressed on mouse out', () => {
        minesweeperTileElement.setAttribute('pressed', '');
        expect(minesweeperTileElement.hasAttribute('pressed')).toBeTruthy();
        
        const mouseOutEvent = new MouseEvent('mouseout');
        minesweeperTileElement.dispatchEvent(mouseOutEvent);
        expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
    });

    it('should flag and unflag', () => {
        expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBeFalsy();
        expect(minesweeperTileElement.value).toBeFalsy();
        expect(minesweeperTileElement.getAttribute('value')).toBeFalsy();
        expect(minesweeperTileElement.isFlagged).toBeFalsy();

        minesweeperTileElement.flag();
        expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe('🚩');
        expect(minesweeperTileElement.value).toBe('🚩');
        expect(minesweeperTileElement.getAttribute('value')).toBe('🚩');
        expect(minesweeperTileElement.isFlagged).toBeTruthy();
        
        minesweeperTileElement.unflag();
        expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBeFalsy();
        expect(minesweeperTileElement.value).toBeFalsy();
        expect(minesweeperTileElement.getAttribute('value')).toBeFalsy();
        expect(minesweeperTileElement.isFlagged).toBeFalsy();
        
        const mouseOutEvent = new MouseEvent('mouseout');
        minesweeperTileElement.dispatchEvent(mouseOutEvent);
        expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
    });
    
    it('should not be able to be pressed when flagged', () => {
        minesweeperTileElement.flag();
        
        const mouseOutEvent = new MouseEvent('mouseout');
        minesweeperTileElement.dispatchEvent(mouseOutEvent);
        expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
    });

    it('should reveal mine', () => {
        minesweeperTileElement.revealMine();
        expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe('💣');
        expect(minesweeperTileElement.value).toBe('💣');
        expect(minesweeperTileElement.getAttribute('value')).toBe('💣');
        expect(minesweeperTileElement.hasAttribute('mine')).toBeFalsy();
        expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
        expect(minesweeperTileElement.visited).toBeTruthy();
    });

    it('should reveal mine and its source', () => {
        minesweeperTileElement.revealMine(true);
        expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe('💣');
        expect(minesweeperTileElement.value).toBe('💣');
        expect(minesweeperTileElement.getAttribute('value')).toBe('💣');
        expect(minesweeperTileElement.hasAttribute('mine')).toBeTruthy();
        expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
        expect(minesweeperTileElement.visited).toBeTruthy();
    });

    it('should reveal not mine', () => {
        minesweeperTileElement.revealNotMine();
        expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe('❌');
        expect(minesweeperTileElement.value).toBe('❌');
        expect(minesweeperTileElement.getAttribute('value')).toBe('❌');
        expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
        expect(minesweeperTileElement.visited).toBeTruthy();
    });

    it('should reveal tile count', () => {
        minesweeperTileElement.revealTileCount(9);
        expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe('9');
        expect(minesweeperTileElement.value).toBe('9');
        expect(minesweeperTileElement.getAttribute('value')).toBe('9');
        expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
        expect(minesweeperTileElement.visited).toBeTruthy();
    });

    it('should have an empty tile count if 0', () => {
        minesweeperTileElement.revealTileCount(0);
        expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBeFalsy();
        expect(minesweeperTileElement.value).toBe('0');
        expect(minesweeperTileElement.getAttribute('value')).toBe('0');
        expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
        expect(minesweeperTileElement.visited).toBeTruthy();
    });

    it('should click on disable', () => {
        minesweeperTileElement.disable();
        
        const mouseDownEvent = new MouseEvent('mousedown');
        Object.defineProperty(mouseDownEvent, 'buttons', {
            value: 1
        });

        minesweeperTileElement.dispatchEvent(mouseDownEvent);

        expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
        
        const mouseOverEvent = new MouseEvent('mouseover');
        Object.defineProperty(mouseOverEvent, 'buttons', {
            value: 1
        });

        minesweeperTileElement.dispatchEvent(mouseOverEvent);

        expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
    });

    afterEach(() => {
        document.body.removeChild(minesweeperTileElement);
    });
});