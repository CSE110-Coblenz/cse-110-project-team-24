

export class GameStateManager {

    //Create the singleton instance
    private static instance: GameStateManager;

    //Handles the current number of lives remaining
    private lives: number = 3;

    constructor() {
        //Get the singleton instance
        GameStateManager.instance = this;
    }

    //Allow for retrieving the singleton instance
    public static getInstance(): GameStateManager {

        if (!GameStateManager.instance) {
          console.log("There is no current gamestate instance to retrieve.");
        }

        return GameStateManager.instance;
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
    }

    //Handle losing a minigame
    public MinigameLost(cityID : string): void {
        console.log(`Minigame for city ${cityID} lost!`);
        this.decreaseLives();
    }


}