import './components/minesweeper-game/minesweeper-game';
import './components/minesweeper-board/minesweeper-board';
import './components/minesweeper-tile/minesweeper-tile';
import './components/minesweeper-timer/minesweeper-timer';
import './components/minesweeper-remaining-mines/minesweeper-remaining-mines';
import './components/minesweeper-configuration/minesweeper-configuration';

import './style.css';

function main() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js').then(registration => {
                console.log('Service Worker registration successful with scope: ', registration);
            }, err => {
                console.log('Service Worker registration failed: ', err);
            });
        });
    }
    const minesweeper = document.createElement('minesweeper-game');
    document.body.appendChild(minesweeper);
}

main();