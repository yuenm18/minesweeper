import { ConfigurationStore } from './configuration-store';

describe('Configuration store', () => {
    let localStorageFake: Map<string, string>;
    const LOCAL_STORAGE_KEY = 'minesweeper_configuration';

    beforeEach(() => {
        spyOn(localStorage, 'getItem').and.callFake((key: string) => {
            return localStorageFake.get(key);
        });

        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
            return localStorageFake.set(key, value);
        });

        localStorageFake = new Map<string, string>();
    });

    it('should get default configuration is none exists in local storage', () => {
        const displayLength = 3;

        const configurations = ConfigurationStore.getConfigurations();

        expect(configurations.length).toBe(displayLength);
        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should get configuration if it exists in local storage', () => {
        localStorageFake.set(LOCAL_STORAGE_KEY, JSON.stringify(
            [{
                id: 1,
                name: 'Beginner',
                width: 9,
                height: 9,
                mines: 10,
                highScore: Infinity

            }]));

        const configurations = ConfigurationStore.getConfigurations();

        expect(configurations.length).toBe(1);
        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should add configuration', () => {
        const configuration = {
            id: 1,
            name: 'Beginner',
            width: 9,
            height: 9,
            mines: 10,
            highScore: Infinity
        };

        ConfigurationStore.addOrUpdateConfiguration(configuration);

        expect(JSON.parse(localStorageFake.get(LOCAL_STORAGE_KEY)).length).toBe(1);
        expect(JSON.parse(localStorageFake.get(LOCAL_STORAGE_KEY))[0].highScore).toEqual(null);
    });

    it('should update configuration', () => {
        let configuration = {
            id: 1,
            name: 'Beginner',
            width: 9,
            height: 9,
            mines: 10,
            highScore: Infinity
        };
        ConfigurationStore.addOrUpdateConfiguration(configuration);

        configuration = {
            id: 1,
            name: 'Beginner',
            width: 9,
            height: 9,
            mines: 10,
            highScore: 10
        };
        ConfigurationStore.addOrUpdateConfiguration(configuration);

        expect(JSON.parse(localStorageFake.get(LOCAL_STORAGE_KEY)).length).toBe(1);
        expect(JSON.parse(localStorageFake.get(LOCAL_STORAGE_KEY))[0].highScore).toEqual(configuration.highScore);
    });
});