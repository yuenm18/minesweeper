import './components/minesweeper-game/minesweeper-game';
import './components/minesweeper-board/minesweeper-board';
import './components/minesweeper-tile/minesweeper-tile';
import './components/minesweeper-timer/minesweeper-timer';
import './components/minesweeper-remaining-mines/minesweeper-remaining-mines';
import './components/minesweeper-configuration/minesweeper-configuration';

function main() {
    const minesweeper = document.createElement('minesweeper-game');
    document.getElementById('minesweeper').appendChild(minesweeper);
}

main();