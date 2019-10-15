import { Configuration } from '../../utilities/configuration';
import { ConfigurationStore } from '../../utilities/configuration-store';

const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        font-size: 1.5rem;
        user-select: none;
        -moz-user-select: none;
    }

    :host[hidden] {
        display: none;
    }

    #display:active {
        border-style: inset;
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
    }

    .setup-dropdown *:hover {
        background-color: darkgrey;
    }

    .setup-dropdown *:active {
        background-color: grey;
    }

    .setup-dropdown * {
        padding: 0.5rem;
    }

    span {
        font-size: 50%;
    }
</style>
<button id="display"></button>
<dl id="setup-dropdown" class="setup-dropdown">
</dl>
`;

export class MinesweeperConfigurationElement extends HTMLElement {
    private displayElement: HTMLElement;
    private setupDropdownElement: HTMLElement;
    private currentConfiguration: Configuration;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.displayElement = this.shadowRoot.getElementById('display');
        this.setupDropdownElement = this.shadowRoot.getElementById('setup-dropdown');
        this.buildSetupList();

        this.shadowRoot.addEventListener('contextmenu', e => {
            if (this.setupDropdownElement.classList.contains('visible')) {
                this.setupDropdownElement.classList.remove('visible');
            }
            else {
                this.setupDropdownElement.classList.add('visible');
            }

            e.preventDefault();
        });

        this.displayElement.addEventListener('click', e => {
            this.setupDropdownElement.classList.remove('visible');
            this.dispatchEvent(new CustomEvent('new-game', {
                detail: this.currentConfiguration,
                bubbles: true
            }));
        });

        this.currentConfiguration = ConfigurationStore.getCurrentConfiguration();
        this.displayHappy();
    }

    connectedCallback() {
        this.dispatchEvent(new CustomEvent('new-game', {
            detail: this.currentConfiguration,
            bubbles: true
        }));
    }

    displayHappy() {
        this.displayElement.textContent = '😊';
    }

    displayLost() {
        this.displayElement.textContent = '☹️';
    }

    displaySurprise() {
        this.displayElement.textContent = '😮';
    }

    displayWon() {
        this.displayElement.textContent = '😎';
    }

    updateHighScore(score: number) {
        this.currentConfiguration.highScore = score;
        ConfigurationStore.addOrUpdateConfiguration(this.currentConfiguration);
        this.buildSetupList();
    }

    private buildSetupList() {
        while (this.setupDropdownElement.firstChild) {
            this.setupDropdownElement.removeChild(this.setupDropdownElement.firstChild);
        }

        for (let configuration of ConfigurationStore.getConfigurations()) {
            const configurationElement = document.createElement('dt');
            const configurationDetailsElement = document.createElement('span');
            configurationElement.id = String(configuration.id);
            configurationElement.textContent = configuration.name;
            configurationDetailsElement.textContent = `${configuration.width} x ${configuration.height} board with ${configuration.mines} mines${configuration.highScore === Infinity ? '' : ` (High score: ${configuration.highScore})`}`;
            configurationElement.appendChild(configurationDetailsElement);

            configurationElement.addEventListener('click', e => {
                this.setupDropdownElement.classList.remove('visible');
                this.currentConfiguration = configuration;
                this.dispatchEvent(new CustomEvent('new-game', {
                    detail: this.currentConfiguration,
                    bubbles: true
                }));
            });

            this.setupDropdownElement.appendChild(configurationElement);
        }
    }
}


customElements.define('minesweeper-configuration', MinesweeperConfigurationElement);