import { Configuration } from './configuration';

export class ConfigurationStore {
    private static defaultConfigurations: Array<Configuration> = [
        {
            id: 1,
            name: 'Beginner',
            width: 9,
            height: 9,
            mines: 10,
            highScore: Infinity
        },
        {
            id: 2,
            name: 'Intermediate',
            width: 16,
            height: 16,
            mines: 40,
            highScore: Infinity
        },
        {
            id: 3,
            name: 'Expert',
            width: 30,
            height: 16,
            mines: 99,
            highScore: Infinity
        }
    ];

    private static LOCAL_STORAGE_KEY = 'minesweeper_configuration';

    /**
     * Gets the configurations
     * If no configurations exist then seed local storage with the default configurations
     *
     * @returns The list of configurations
     */
    static getConfigurations(): Array<Configuration> {
        const configurations = this.getConfigurationsFromLocalStorage();
        if (!configurations) {
            this.writeConfigurationsToLocalStorage(this.defaultConfigurations);
        }

        return configurations ?? this.defaultConfigurations;
    }

    /**
     * Gets the current configuration (currently the first one)
     *
     * @returns The current configuration
     */
    static getCurrentConfiguration(): Configuration {
        return this.defaultConfigurations[0];
    }

    /**
     * Adds or updates a configuration
     *
     * @param configuration The configuration to add or update
     */
    static addOrUpdateConfiguration(configuration: Configuration): void {
        const configurations = this.getConfigurationsFromLocalStorage() ?? [];

        const index = configurations.findIndex(c => c.id === configuration.id);
        if (index !== -1) {
            configurations.splice(index, 1, configuration);
        } else {
            configurations.push(configuration);
        }

        this.writeConfigurationsToLocalStorage(configurations);
    }

    /**
     * Gets the list of configurations from local storage
     *
     * @returns The list of configurations stored in local storage or null if it doesn't exist
     */
    private static getConfigurationsFromLocalStorage(): Array<Configuration | null> {
        const configuration = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        try {
            return (<Array<Configuration>>JSON.parse(configuration)).map(c => {
                c.highScore = c.highScore === null ? Infinity : c.highScore;
                return c;
            });
        }
        catch {
            return null;
        }
    }

    /**
     * Writes a list of configurations to local storage
     *
     * @param configurations The list of configurations
     */
    private static writeConfigurationsToLocalStorage(configurations: Array<Configuration>): void {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(configurations));
    }
}