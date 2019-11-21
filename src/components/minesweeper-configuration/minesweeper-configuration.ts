import { Configuration } from '../../utilities/configuration';
import { ConfigurationStore } from '../../utilities/configuration-store';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        font-size: 1.5rem;
        user-select: none;
        -moz-user-select: none;
        outline: none;
    }

    :host[hidden] {
        display: none;
    }

    *:focus {
        outline: none;
    }
    
    #display {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        height: 2.5rem;
        width: 2.5rem;
        border: .25rem lightgrey outset;
        cursor: pointer;
    }

    #display:active, #display:focus, #display.firefox-active {
        border-style: inset;
    }

    #display::-moz-focus-inner {
        border: 0;
    }

    .setup-dropdown {
        display: none;
        position: absolute;
        background-color: lightgrey;
        border: 1px solid grey;
        box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.5);
        cursor: pointer;
        margin: unset;
    }

    .setup-dropdown.visible {
        display: block;
        padding: 0;
    }

    .setup-dropdown *:hover, .setup-dropdown *:focus {
        background-color: darkgrey;
    }

    .setup-dropdown *:active {
        background-color: grey;
    }

    .setup-dropdown * {
        padding: 0.5rem;
    }

    span {
        font-size: 0.5em;
    }

    li {
        list-style: none;
    }
</style>
<button id="display"></button>
<ul id="setup-dropdown" class="setup-dropdown">
</ul>
`;

export class MinesweeperConfigurationElement extends HTMLElement {
    private displayElement: HTMLElement;
    private setupDropdownElement: HTMLElement;
    private currentConfiguration: Configuration;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.displayElement = this.shadowRoot.getElementById('display');
        this.setupDropdownElement = this.shadowRoot.getElementById('setup-dropdown');
        this.buildSetupList();

        this.shadowRoot.addEventListener('click', (e: MouseEvent) => {
            // new game if the user clicks the button
            if ((<HTMLElement>e.target).id === 'display') {
                this.dispatchNewGame();
                return;
            }

            // change configuration if the user clicks an option in the configuration dropdown
            const element = (<HTMLElement>e.target).closest('li');
            if (element) {
                this.dispatchNewGame(+element.id);
            }
        });


        this.shadowRoot.addEventListener('contextmenu', (e: MouseEvent) => {
            // right click toggles configuration menu
            e.preventDefault();
            this.toggleVisible();
        });

        this.shadowRoot.addEventListener('keydown', (e: KeyboardEvent) => {
            // hide configuration menu is esc is pressed
            if (e.key === 'Escape') {
                this.setupDropdownElement.classList.remove('visible');
                return;
            }

            // toggle visible if any normal key is pressed
            if (/^[a-z0-9]$/.test(e.key)) {
                this.toggleVisible();
                return;
            }

            // change configuration if the user selects an option in the configuration dropdown with the ' ' or 'Enter' key
            const element = (<HTMLElement>e.target).closest('li');
            if (element) {
                switch (e.key) {
                    case ' ':
                    case 'Enter':
                        this.dispatchNewGame(+element.id);
                        break;
                }
            }
        });

        // don't keep focus on mouse events
        this.shadowRoot.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault();
        });

        this.handleFirefoxActiveFlagIssue();

        this.currentConfiguration = ConfigurationStore.getCurrentConfiguration();
        this.displayHappy();
    }

    /**
     * Dispatch a new game event for the current configuration when the element loads
     */
    connectedCallback(): void {
        this.dispatchEvent(new CustomEvent('new-game', {
            detail: this.currentConfiguration,
            bubbles: true
        }));
    }

    /**
     * Displays the Happy face
     */
    displayHappy(): void {
        this.displayElement.textContent = '😊';
    }

    /**
     * Displays the Lost face
     */
    displayLost(): void {
        this.displayElement.textContent = '☹️';
    }

    /**
     * Displays the Surprise face
     */
    displaySurprise(): void {
        this.displayElement.textContent = '😮';
    }

    /**
     * Displays the Won face
     */
    displayWon(): void {
        this.displayElement.textContent = '😎';
    }

    /**
     * Updates the current configuration's high score
     *
     * @param score The updated score
     */
    updateHighScore(score: number): void {
        this.currentConfiguration.highScore = score;
        ConfigurationStore.addOrUpdateConfiguration(this.currentConfiguration);
        this.buildSetupList();
    }

    /**
     * Builds the list of configuration options
     */
    private buildSetupList(): void {
        while (this.setupDropdownElement.firstChild) {
            this.setupDropdownElement.removeChild(this.setupDropdownElement.firstChild);
        }

        for (const configuration of ConfigurationStore.getConfigurations()) {
            const configurationElement = document.createElement('li');
            const configurationDetailsElement = document.createElement('span');

            configurationElement.id = String(configuration.id);
            configurationElement.textContent = configuration.name;
            configurationElement.tabIndex = 0;

            configurationDetailsElement.textContent = `${configuration.width} x ${configuration.height} board with ${configuration.mines} mines${configuration.highScore === Infinity ? '' : ` (High score: ${configuration.highScore})`}`;

            configurationElement.appendChild(configurationDetailsElement);
            this.setupDropdownElement.appendChild(configurationElement);
        }
    }

    /**
     * Dispatches a new game event and hides the menu
     * Updates the current configuration if it is provided
     *
     * @param configurationId The configuration id of the configuration to send
     */
    private dispatchNewGame(configurationId?: number): void {
        if (configurationId) {
            this.currentConfiguration = ConfigurationStore.getConfigurations().find(c => c.id === configurationId);
        }

        this.setupDropdownElement.classList.remove('visible');
        this.dispatchEvent(new CustomEvent('new-game', {
            detail: this.currentConfiguration,
            bubbles: true
        }));
    }

    /**
     * firefox doesn't set the display element to active if prevent default is called on mousedown
     * https://github.com/w3c/csswg-drafts/issues/2262#issuecomment-362868260
     */
    private handleFirefoxActiveFlagIssue(): void {
        this.shadowRoot.addEventListener('mousedown', (e: MouseEvent) => {
            this.displayElement.classList.add('firefox-active');
        });
        
        this.shadowRoot.addEventListener('mouseup', (e: MouseEvent) => {
            this.displayElement.classList.remove('firefox-active');
        });
        
        this.shadowRoot.addEventListener('mouseout', (e: MouseEvent) => {
            this.displayElement.classList.remove('firefox-active');
        });
    }

    /**
     * Toggles the configuration options dropdown visibility
     */
    private toggleVisible(): void {
        if (this.setupDropdownElement.classList.contains('visible')) {
            this.setupDropdownElement.classList.remove('visible');
        } else {
            this.setupDropdownElement.classList.add('visible');
        }
    }
}

if (!customElements.get('minesweeper-configuration')) {
    customElements.define('minesweeper-configuration', MinesweeperConfigurationElement);
}