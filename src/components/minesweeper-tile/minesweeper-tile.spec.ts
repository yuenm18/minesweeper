import { MinesweeperTileElement } from './minesweeper-tile';

describe('Minesweeper tile element', () => {
    let minesweeperTileElement: MinesweeperTileElement;

    beforeEach(() => {
        minesweeperTileElement = <MinesweeperTileElement>document.createElement('minesweeper-tile');
        document.body.appendChild(minesweeperTileElement);
    });

    it('should be an instance of a minesweeper tile', () => {
        const element = document.querySelector('minesweeper-tile');        
        expect(element.constructor.name).toBe(MinesweeperTileElement.name);
    });

    it('should reflect properties to attributes', () => {
        const x = 1, y = 2, value = '3';
        minesweeperTileElement.x = x;
        minesweeperTileElement.y = y;
        minesweeperTileElement.value = value;

        expect(minesweeperTileElement.getAttribute('x')).toEqual(String(x));
        expect(minesweeperTileElement.getAttribute('y')).toEqual(String(y));
        expect(minesweeperTileElement.getAttribute('value')).toEqual(value);
    });

    it('should reflect attributes to properties', () => {
        const x = 1, y = 2, value = '3';
        minesweeperTileElement.setAttribute('x', String(x));
        minesweeperTileElement.setAttribute('y', String(y));
        minesweeperTileElement.setAttribute('value', value);

        expect(minesweeperTileElement.x).toEqual(x);
        expect(minesweeperTileElement.y).toEqual(y);
        expect(minesweeperTileElement.value).toEqual(value);
    });

    describe('should not focus', () => {
        it('when disabled', () => {
            minesweeperTileElement.focus();

            minesweeperTileElement.disable();

            expect(minesweeperTileElement.getAttribute('tabindex')).toBe('-1');
            expect(document.activeElement).not.toBe(minesweeperTileElement);
        });

        it('on mouse down', () => {
            const mouseDownEvent = new MouseEvent('mousedown');
            Object.defineProperty(mouseDownEvent, 'buttons', {
                value: 1
            });

            minesweeperTileElement.dispatchEvent(mouseDownEvent);

            expect(document.activeElement).not.toBe(minesweeperTileElement);
        });
    });

    describe('should be pressed', () => {
        it('on mouse down', () => {
            const mouseDownEvent = new MouseEvent('mousedown');
            Object.defineProperty(mouseDownEvent, 'buttons', {
                value: 1
            });

            minesweeperTileElement.dispatchEvent(mouseDownEvent);

            expect(minesweeperTileElement.hasAttribute('pressed')).toBeTruthy();
        });

        it('on mouse over', () => {
            const mouseOverEvent = new MouseEvent('mouseover');
            Object.defineProperty(mouseOverEvent, 'buttons', {
                value: 1
            });

            minesweeperTileElement.dispatchEvent(mouseOverEvent);

            expect(minesweeperTileElement.hasAttribute('pressed')).toBeTruthy();
        });
    });

    describe('should not be pressed', () => {
        it('on mouse out', () => {
            minesweeperTileElement.setAttribute('pressed', '');
            const mouseOutEvent = new MouseEvent('mouseout');

            minesweeperTileElement.dispatchEvent(mouseOutEvent);

            expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
        });

        it('mouse over when disabled', () => {
            minesweeperTileElement.disable();
            const mouseOverEvent = new MouseEvent('mouseover');
            Object.defineProperty(mouseOverEvent, 'buttons', {
                value: 1
            });

            minesweeperTileElement.dispatchEvent(mouseOverEvent);

            expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
        });

        it('on mouse down when disabled', () => {
            minesweeperTileElement.disable();
            const mousedownEvent = new MouseEvent('mousedown');
            Object.defineProperty(mousedownEvent, 'buttons', {
                value: 1
            });

            minesweeperTileElement.dispatchEvent(mousedownEvent);

            expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
        });

        it('on mouse over when flagged', () => {
            minesweeperTileElement.flag();
            const mouseOverEvent = new MouseEvent('mouseover');
            Object.defineProperty(mouseOverEvent, 'buttons', {
                value: 1
            });

            minesweeperTileElement.dispatchEvent(mouseOverEvent);

            expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
        });

        it('on mouse out when flagged', () => {
            minesweeperTileElement.flag();
            const mouseOutEvent = new MouseEvent('mouseout');
            minesweeperTileElement.dispatchEvent(mouseOutEvent);

            expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
        });

        it('on mouse down when flagged', () => {
            minesweeperTileElement.flag();
            const mouseDownEvent = new MouseEvent('mousedown');
            Object.defineProperty(mouseDownEvent, 'buttons', {
                value: 1
            });

            minesweeperTileElement.dispatchEvent(mouseDownEvent);

            expect(minesweeperTileElement.hasAttribute('pressed')).toBeFalsy();
        });
    });

    describe('should flag', () => {
        it('when flag() method is called', () => {
            const tileFlagCallback = jasmine.createSpy('tileFlagCallback');
            minesweeperTileElement.addEventListener('tile-flag', tileFlagCallback);

            minesweeperTileElement.flag();

            expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe('🚩');
            expect(minesweeperTileElement.value).toBe('🚩');
            expect(minesweeperTileElement.getAttribute('value')).toBe('🚩');
            expect(minesweeperTileElement.isFlagged()).toBeTruthy();
            expect(tileFlagCallback).toHaveBeenCalledWith(jasmine.objectContaining({ bubbles: true, cancelable: true, composed: true }));
        });

        it('on context menu', () => {
            const contextmenuEvent = new MouseEvent('contextmenu');

            minesweeperTileElement.dispatchEvent(contextmenuEvent);

            expect(minesweeperTileElement.isFlagged()).toBeTruthy();
        });

        it('when pressing "f" key', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: 'f' });

            minesweeperTileElement.dispatchEvent(keydownEvent);

            expect(minesweeperTileElement.isFlagged()).toBeTruthy();
        });
    });

    describe('should not flag', () => {
        it('when "tile-flag" event is canceled', () => {
            const tileFlagCallback = jasmine.createSpy('tileFlagCallback', e => e.preventDefault()).and.callThrough();
            minesweeperTileElement.addEventListener('tile-flag', tileFlagCallback);

            minesweeperTileElement.flag();

            expect(minesweeperTileElement.isFlagged()).toBeFalsy();
        });

        it('when disabled', () => {
            minesweeperTileElement.disable();
            const tileFlagCallback = jasmine.createSpy('tileFlagCallback');
            minesweeperTileElement.addEventListener('tile-flag', tileFlagCallback);

            minesweeperTileElement.flag();

            expect(tileFlagCallback).not.toHaveBeenCalled();
        });

        it('when already flagged', () => {
            minesweeperTileElement.flag();
            const tileFlagCallback = jasmine.createSpy('tileFlagCallback');
            minesweeperTileElement.addEventListener('tile-flag', tileFlagCallback);

            minesweeperTileElement.flag();

            expect(tileFlagCallback).not.toHaveBeenCalled();
        });
    });

    describe('should unflag', () => {
        beforeEach(() => {
            minesweeperTileElement.flag();
        });

        it('when unflag() method is called', () => {
            const tileUnflagCallback = jasmine.createSpy('tileFlagCallback');
            minesweeperTileElement.addEventListener('tile-unflag', tileUnflagCallback);

            minesweeperTileElement.unflag();

            expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBeFalsy();
            expect(minesweeperTileElement.value).toBeFalsy();
            expect(minesweeperTileElement.getAttribute('value')).toBeFalsy();
            expect(minesweeperTileElement.isFlagged()).toBeFalsy();
            expect(tileUnflagCallback).toHaveBeenCalledWith(jasmine.objectContaining({ bubbles: true, cancelable: true, composed: true }));
        });

        it('on context menu', () => {
            const contextmenuEvent = new MouseEvent('contextmenu');

            minesweeperTileElement.dispatchEvent(contextmenuEvent);

            expect(minesweeperTileElement.isFlagged()).toBeFalsy();
        });

        it('when pressing "f" key', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: 'f' });

            minesweeperTileElement.dispatchEvent(keydownEvent);

            expect(minesweeperTileElement.isFlagged()).toBeFalsy();
        });

    });

    describe('should not unflag', () => {
        beforeEach(() => {
            minesweeperTileElement.flag();
        });

        it('when "tile-unflag" event is canceled', () => {
            const tileUnflagCallback = jasmine.createSpy('tileFlagCallback', e => e.preventDefault()).and.callThrough();
            minesweeperTileElement.addEventListener('tile-unflag', tileUnflagCallback);

            minesweeperTileElement.unflag();

            expect(minesweeperTileElement.isFlagged()).toBeTruthy();
        });

        it('when disabled', () => {
            minesweeperTileElement.disable();
            const tileUnflagCallback = jasmine.createSpy('tileFlagCallback');
            minesweeperTileElement.addEventListener('tile-unflag', tileUnflagCallback);

            minesweeperTileElement.unflag();

            expect(tileUnflagCallback).not.toHaveBeenCalled();
        });

        it('when already flagged', () => {
            minesweeperTileElement.unflag();
            const tileUnflagCallback = jasmine.createSpy('tileFlagCallback');
            minesweeperTileElement.addEventListener('tile-unflag', tileUnflagCallback);

            minesweeperTileElement.unflag();

            expect(tileUnflagCallback).not.toHaveBeenCalled();
        });
    });

    describe('should dispatch "tile-select"', () => {
        let tileSelectCallback: jasmine.Func;

        beforeEach(() => {
            tileSelectCallback = jasmine.createSpy('tileSelectCallback');
            minesweeperTileElement.addEventListener('tile-select', tileSelectCallback);
        });

        it('on mouseup', () => {
            const mouseUpEvent = new MouseEvent('mouseup');

            minesweeperTileElement.dispatchEvent(mouseUpEvent);

            expect(tileSelectCallback).toHaveBeenCalledWith(jasmine.objectContaining({ bubbles: true, composed: true }));
        });

        it('on space key', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: ' ' });

            minesweeperTileElement.dispatchEvent(keydownEvent);

            expect(tileSelectCallback).toHaveBeenCalledWith(jasmine.objectContaining({ bubbles: true, composed: true }));
        });

        it('on enter key', () => {
            const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });

            minesweeperTileElement.dispatchEvent(keydownEvent);

            expect(tileSelectCallback).toHaveBeenCalledWith(jasmine.objectContaining({ bubbles: true, composed: true }));
        });
    });

    describe('should not dispatch "tile-select"', () => {
        let tileSelectCallback: jasmine.Func;
        let mouseUpEvent: MouseEvent;

        beforeEach(() => {
            tileSelectCallback = jasmine.createSpy('tileSelectCallback');
            minesweeperTileElement.addEventListener('tile-select', tileSelectCallback);
            mouseUpEvent = new MouseEvent('mouseup');
        });

        it('when tile is disabled', () => {
            minesweeperTileElement.disable();

            minesweeperTileElement.dispatchEvent(mouseUpEvent);

            expect(tileSelectCallback).not.toHaveBeenCalled();
        });

        it('when tile is flagged', () => {
            minesweeperTileElement.flag();

            minesweeperTileElement.dispatchEvent(mouseUpEvent);

            expect(tileSelectCallback).not.toHaveBeenCalled();
        });
    });

    describe('should reveal', () => {
        it('mine', () => {
            minesweeperTileElement.revealMine();

            expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe('💣');
            expect(minesweeperTileElement.value).toBe('💣');
            expect(minesweeperTileElement.getAttribute('value')).toBe('💣');
            expect(minesweeperTileElement.hasAttribute('exploded')).toBeFalsy();
            expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
            expect(minesweeperTileElement.visited).toBeTruthy();
            expect(minesweeperTileElement.isDisabled()).toBeTruthy();
        });

        it('mine and its source', () => {
            minesweeperTileElement.revealMine(true);

            expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe('💣');
            expect(minesweeperTileElement.value).toBe('💣');
            expect(minesweeperTileElement.getAttribute('value')).toBe('💣');
            expect(minesweeperTileElement.hasAttribute('exploded')).toBeTruthy();
            expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
            expect(minesweeperTileElement.visited).toBeTruthy();
            expect(minesweeperTileElement.isDisabled()).toBeTruthy();
        });

        it('not mine', () => {
            minesweeperTileElement.revealNotMine();

            expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe('❌');
            expect(minesweeperTileElement.value).toBe('❌');
            expect(minesweeperTileElement.getAttribute('value')).toBe('❌');
            expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
            expect(minesweeperTileElement.visited).toBeTruthy();
            expect(minesweeperTileElement.isDisabled()).toBeTruthy();
        });

        it('tile count', () => {
            const tileCount = 9;
            minesweeperTileElement.revealTileCount(tileCount);

            expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBe(String(tileCount));
            expect(minesweeperTileElement.value).toBe(String(tileCount));
            expect(minesweeperTileElement.getAttribute('value')).toBe(String(tileCount));
            expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
            expect(minesweeperTileElement.visited).toBeTruthy();
            expect(minesweeperTileElement.isDisabled()).toBeTruthy();
        });

        it('empty tile count if 0', () => {
            minesweeperTileElement.revealTileCount(0);

            expect(minesweeperTileElement.shadowRoot.getElementById('display').textContent).toBeFalsy();
            expect(minesweeperTileElement.value).toBe('0');
            expect(minesweeperTileElement.getAttribute('value')).toBe('0');
            expect(minesweeperTileElement.hasAttribute('visited')).toBeTruthy();
            expect(minesweeperTileElement.visited).toBeTruthy();
            expect(minesweeperTileElement.isDisabled()).toBeTruthy();
        });
    });

    afterEach(() => {
        document.body.removeChild(minesweeperTileElement);
    });
});