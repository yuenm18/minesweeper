import { MinesweeperTimerElement } from '../minesweeper-timer/minesweeper-timer';
import { MinesweeperRemainingMinesElement } from '../minesweeper-remaining-mines/minesweeper-remaining-mines';
import { MinesweeperConfigurationElement } from '../minesweeper-configuration/minesweeper-configuration';
import { MinesweeperBoardElement } from '../minesweeper-board/minesweeper-board';
import { Configuration } from '../../utilities/configuration';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100vh;
        border: 1vh lightgrey outset;
        background-color: grey;
    }

    :host[hidden] {
        display: none;
    }
    
    header, main {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 1vh lightgrey inset;
        background-color: lightgrey;
    }

    main {
        height: 100%;
    }

    header {
        padding: 1vh;
    }
</style>
<header>
    <minesweeper-remaining-mines id="remaining-mines"></minesweeper-remaining-mines>
    <minesweeper-configuration id="configuration"></minesweeper-configuration>
    <minesweeper-timer id="timer"></minesweeper-timer>
</header>
<main>
    <minesweeper-board id="board"></minesweeper-board>
</main>
`;

export class MinesweeperGameElement extends HTMLElement {
    private configuration: Configuration;
    private gameState: 'started' | 'in progress' | 'won' | 'lost';

    private remainingMinesElement: MinesweeperRemainingMinesElement;
    private boardElement: MinesweeperBoardElement;
    private configurationElement: MinesweeperConfigurationElement;
    private timerElement: MinesweeperTimerElement;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.boardElement = <MinesweeperBoardElement>this.shadowRoot.getElementById('board');
        this.remainingMinesElement = <MinesweeperRemainingMinesElement>this.shadowRoot.getElementById('remaining-mines');
        this.configurationElement = <MinesweeperConfigurationElement>this.shadowRoot.getElementById('configuration');
        this.timerElement = <MinesweeperTimerElement>this.shadowRoot.getElementById('timer');

        this.boardElement.addEventListener('won', e => {
            this.setStateWon();
        });

        this.boardElement.addEventListener('tile-select', e => {
            this.setStateInProgress();
        });

        this.boardElement.addEventListener('lost', e => {
            this.setStateLost();
        });

        this.boardElement.addEventListener('tile-flag', e => {
            this.remainingMinesElement.decrease();
        });

        this.boardElement.addEventListener('tile-unflag', e => {
            this.remainingMinesElement.increase();
        });

        this.boardElement.addEventListener('mousedown', e => {
            if (this.gameState === 'in progress') {
                this.configurationElement.displaySurprise();
            }
        });

        this.boardElement.addEventListener('mouseup', e => {
            if (this.gameState === 'in progress') {
                this.configurationElement.displayHappy();
            }
        });

        this.configurationElement.addEventListener('new-game', (e: CustomEvent) => {
            this.configuration = <Configuration>e.detail;
            setTimeout(() => this.setStateStarted());
        });
    }

    private setStateStarted(): void {
        this.boardElement.initializeBoard(this.configuration.width, this.configuration.height, this.configuration.mines);
        this.gameState = 'started';
        this.timerElement.reset();
        this.configurationElement.displayHappy();
        this.remainingMinesElement.reset(this.configuration.mines);
    }

    private setStateInProgress(): void {
        if (this.gameState !== 'started') { return; }
        this.gameState = 'in progress';
        if (!this.timerElement.isStarted()) {
            this.timerElement.start();
        }

        this.configurationElement.displayHappy();
    }

    private setStateWon(): void {
        this.gameState = 'won';
        this.timerElement.stop();
        this.configurationElement.displayWon();

        const score = this.timerElement.getTime();
        if (this.configuration.highScore > score) {
            this.configurationElement.updateHighScore(score);
        }
    }

    private setStateLost(): void {
        this.gameState = 'lost';
        this.timerElement.stop();
        this.configurationElement.displayLost();
    }
}

if (!customElements.get('minesweeper-game')) {
    customElements.define('minesweeper-game', MinesweeperGameElement);
}