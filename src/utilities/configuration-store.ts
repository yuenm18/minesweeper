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

    static getConfigurations(): Array<Configuration> {
        const configurations = this.getConfigurationsFromLocalStorage();
        if (!configurations) {
            this.writeConfigurationsToLocalStorage(this.defaultConfigurations);
        }

        return configurations || this.defaultConfigurations;
    }

    static getCurrentConfiguration(): Configuration {
        return this.defaultConfigurations[0];
    }

    static addOrUpdateConfiguration(configuration: Configuration): void {  
        const configurations = this.getConfigurationsFromLocalStorage() || [];
        
        const index = configurations.findIndex(c => c.id === configuration.id);
        if (index !== -1) {
            configurations.splice(index, 1, configuration);
        } else {
            configurations.push(configuration);
        }

        this.writeConfigurationsToLocalStorage(configurations);
    }
    
    private static getConfigurationsFromLocalStorage(): Array<Configuration> {
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

    private static writeConfigurationsToLocalStorage(configurations: Array<Configuration>): void {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(configurations));
    }
}