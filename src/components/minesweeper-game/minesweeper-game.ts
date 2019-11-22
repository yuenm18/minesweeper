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

    main > * {
        overflow: auto;
        max-height: 100%;
        max-width: 100%;
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

        this.handleUpdatingMineCount();
        this.handleChangingState();
        this.handleChangingExpressionWhenPressingTile();
    }

    /**
     * Add event listeners for handling the emoji's expression changing when pressing the tiles
     */
    private handleChangingExpressionWhenPressingTile(): void {
        // only set the display to surprise when the game is in progress or started (before the first click)
        // because the display reflects the result of the game when the game is over
        this.boardElement.addEventListener('mousedown', (e: MouseEvent) => {
            if (this.gameState === 'started' || this.gameState === 'in progress') {
                this.configurationElement.displaySurprise();
            }
        });

        this.boardElement.addEventListener('mouseup', (e: MouseEvent) => {
            if (this.gameState === 'started' || this.gameState === 'in progress') {
                this.configurationElement.displayHappy();
            }
        });
    }

    /**
     * Add event listeners for handling state changes
     */
    private handleChangingState(): void {
        this.boardElement.addEventListener('lost', (e: CustomEvent) => {
            this.setStateLost();
        });

        this.configurationElement.addEventListener('new-game', (e: CustomEvent) => {
            this.configuration = <Configuration>e.detail;

            // need to change state in setTimeout() because this code is called synchonously before
            // the game state's child elements are created.  Change state needs to be called after all child
            // elements are created
            setTimeout(() => this.setStateStarted());
        });

        this.boardElement.addEventListener('tile-select', (e: CustomEvent) => {
            this.setStateInProgress();
        });

        this.boardElement.addEventListener('won', (e: CustomEvent) => {
            this.setStateWon();
        });
    }

    /**
     * Add event listeners for updaing the mine counts when flagging and unflagging mines
     */
    private handleUpdatingMineCount(): void {
        this.boardElement.addEventListener('tile-flag', (e: CustomEvent) => {
            this.remainingMinesElement.decrease();
        });

        this.boardElement.addEventListener('tile-unflag', (e: CustomEvent) => {
            this.remainingMinesElement.increase();
        });
    }

    /**
     * Sets the state to started
     */
    private setStateStarted(): void {
        this.boardElement.initializeBoard(this.configuration.width, this.configuration.height, this.configuration.mines);
        this.gameState = 'started';
        this.timerElement.reset();
        this.configurationElement.displayHappy();
        this.remainingMinesElement.reset(this.configuration.mines);
    }

    /**
     * Sets the state to in progress
     */
    private setStateInProgress(): void {
        // can only go into in progress state from started state
        if (this.gameState !== 'started') { return; }

        this.gameState = 'in progress';
        if (!this.timerElement.isStarted()) {
            this.timerElement.start();
        }

        this.configurationElement.displayHappy();
    }

    /**
     * Sets the state to won
     */
    private setStateWon(): void {
        this.gameState = 'won';
        this.timerElement.stop();
        this.configurationElement.displayWon();

        const score = this.timerElement.getTime();
        if (this.configuration.highScore > score) {
            this.configurationElement.updateHighScore(score);
        }
    }

    /**
     * Sets the state to lost
     */
    private setStateLost(): void {
        this.gameState = 'lost';
        this.timerElement.stop();
        this.configurationElement.displayLost();
    }
}

if (!customElements.get('minesweeper-game')) {
    customElements.define('minesweeper-game', MinesweeperGameElement);
}