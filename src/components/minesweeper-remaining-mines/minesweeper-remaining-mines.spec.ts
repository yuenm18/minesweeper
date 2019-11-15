import { MinesweeperRemainingMinesElement } from './minesweeper-remaining-mines';

describe('Minesweeper remaining element', () => {
    let minesweeperRemainingMinesElement: MinesweeperRemainingMinesElement;

    beforeEach(() => {
        minesweeperRemainingMinesElement = <MinesweeperRemainingMinesElement>document.createElement('minesweeper-remaining-mines');
        document.body.appendChild(minesweeperRemainingMinesElement);

        jasmine.clock().install();
    });

    it('should be an instance of a minesweeper remaining mines', () => {
        const element = document.querySelector('minesweeper-remaining-mines');
        expect(element.constructor.name).toBe(MinesweeperRemainingMinesElement.name);
    });

    it('should reflect properties to attributes', () => {
        const count = 10;

        minesweeperRemainingMinesElement.count = count;
        
        expect(minesweeperRemainingMinesElement.getAttribute('count')).toBe(String(count));
    });

    it('should reflect attributes to properties', () => {
        const count = 10;

        minesweeperRemainingMinesElement.setAttribute('count', String(count));
        
        expect(minesweeperRemainingMinesElement.count).toBe(count);
    });

    it('should reset count', () => {
        const newCount = 10;

        minesweeperRemainingMinesElement.reset(newCount);
        
        expect(minesweeperRemainingMinesElement.count).toBe(newCount);
    });

    it('should increase count', () => {
        const initialCount = 10;
        const finalCount = initialCount + 1;
        minesweeperRemainingMinesElement.reset(initialCount);

        minesweeperRemainingMinesElement.increase();

        expect(minesweeperRemainingMinesElement.count).toBe(finalCount);
    });

    it('should decrease count', () => {
        const initialCount = 10;
        const finalCount = initialCount - 1;
        minesweeperRemainingMinesElement.reset(initialCount);
        
        minesweeperRemainingMinesElement.decrease();

        expect(minesweeperRemainingMinesElement.count).toBe(finalCount);
    });

    describe('should reflect count to display', () => {
        it('after reset', () => {
            const count = 10;
    
            minesweeperRemainingMinesElement.reset(count);

            expect(minesweeperRemainingMinesElement.shadowRoot.getElementById('display').textContent).toBe('010');
        });

        it('after decrease', () => {
            const initialCount = 10;
            minesweeperRemainingMinesElement.reset(initialCount);
    
            minesweeperRemainingMinesElement.decrease();

            expect(minesweeperRemainingMinesElement.shadowRoot.getElementById('display').textContent).toBe('009');
        });
        
        it('after increase', () => {
            const initialCount = 10;
            minesweeperRemainingMinesElement.reset(initialCount);
    
            minesweeperRemainingMinesElement.increase();

            expect(minesweeperRemainingMinesElement.shadowRoot.getElementById('display').textContent).toBe('011');
        });
    });

    afterEach(() => {
        document.body.removeChild(minesweeperRemainingMinesElement);
        
        jasmine.clock().uninstall();
    });
});