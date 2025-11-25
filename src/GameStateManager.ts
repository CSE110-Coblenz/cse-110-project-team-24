
    //For saving/loading game state
    const SAVE_GAME_KEY = "citiesComplete";
export class GameStateManager {

    //Create the singleton instance
    private static instance: GameStateManager;

    //Handles the current number of lives remaining
    private lives: number = 3;

    //Dictionary which tracks which cities have been completed
    private completedCities: { [cityID: string]: boolean } = {};




    constructor() {
        //Get the singleton instance
        GameStateManager.instance = this;

        //Loads any saved game state
        this.loadGameState();

        //Initialize the completed city save is no save is found
        if (Object.keys(this.completedCities).length === 0) {
            this.completedCities = {};
            this.completedCities["newyork"] = false;
            this.completedCities["boston"] = false;
            this.completedCities["dc"] = false;
            this.completedCities["losangeles"] = false;
            this.completedCities["sandiego"] = false;
            this.completedCities["chicago"] = false;
        }
    }

    //Allow for retrieving the singleton instance
    public static getInstance(): GameStateManager {

        if (!GameStateManager.instance) {
          console.log("There is no current gamestate instance to retrieve.");
        }

        return GameStateManager.instance;
      }


    public checkSingletonPresence(): boolean {
        return GameStateManager.instance === this;
    }

    /* Manage Lives */

    //Get the current number of lives
    public getLives(): number {
        return this.lives;
    }

    //Decrease the number of lives by 1
    private decreaseLives(): void {
        this.lives -= 1;
        this.isGameOver();
    }

    //Check if game is over
    public isGameOver(): boolean {
        return this.lives <= 0;
    }



    /* Manage win/loss of minigames */

    //Handle winning a minigame
    public MinigameWon(cityID : string): void {
        console.log(`Minigame for city ${cityID} won!`);
        //No change to lives on win

        this.markCityCompleted(cityID);
        this.saveGameState();
    }

    //Handle losing a minigame
    public MinigameLost(cityID : string): void {
        console.log(`Minigame for city ${cityID} lost!`);
        this.decreaseLives();
    }

    /* Manage completed cities */
    //Provide way to retrieve completed cities
    public getCompletedCities(): { [cityID: string]: boolean } {
        return this.completedCities;
    }
    //Mark a city as completed
    public markCityCompleted(cityID: string): void {
        this.completedCities[cityID] = true;
        console.log(`City ${cityID} marked as completed.`);
    }

    /* Handle Saving and Loading Game State */
    //Save game state to local storage
    public saveGameState(): void {
        const gameState = {
            completedCities: this.completedCities
            //If there is anything else to save, add it here
        };
        localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameState));
        console.log("Game state saved.");
    }

    //Load game state from local storage
    public loadGameState(): void {
        const savedState = localStorage.getItem(SAVE_GAME_KEY);
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.completedCities = gameState.completedCities || this.completedCities;
            //If there is anything else to load, add it here
            console.log("Game state loaded.");
        } else {
            console.log("No saved game state found.");
        }
    }

    //For testing purposes
    public resetGameState(): void {
    
        this.completedCities["newyork"] = false;
        this.completedCities["boston"] = false;
        this.completedCities["dc"] = false;
        this.completedCities["losangeles"] = false;
        this.completedCities["sandiego"] = false;
        this.completedCities["chicago"] = false;

        localStorage.removeItem(SAVE_GAME_KEY);
        console.log("Game state reset.");
    }


}