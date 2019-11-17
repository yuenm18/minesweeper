describe('Minesweeper custom element should not throw error when registering', () => {
    it('minesweeper-tile', async () => {
        await expectAsync(import('./components/minesweeper-tile/minesweeper-tile')).not.toBeRejected();
    });
    
    it('minesweeper-board', async () => {
        await expectAsync(import('./components/minesweeper-board/minesweeper-board')).not.toBeRejected();
    });
    
    it('minesweeper-configuration', async () => {
        await expectAsync(import('./components/minesweeper-configuration/minesweeper-configuration')).not.toBeRejected();
    });
    
    it('minesweeper-game', async () => {
        await expectAsync(import('./components/minesweeper-game/minesweeper-game')).not.toBeRejected();
    });
    
    it('minesweeper-timer', async () => {
        await expectAsync(import('./components/minesweeper-timer/minesweeper-timer')).not.toBeRejected();
    });

    it('minesweeper-remaining-mines', async () => {
        await expectAsync(import('./components/minesweeper-remaining-mines/minesweeper-remaining-mines')).not.toBeRejected();
    });
});