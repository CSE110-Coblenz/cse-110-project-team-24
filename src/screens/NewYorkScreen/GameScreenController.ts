import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { GameScreenModel } from "./GameScreenModel.ts";
import { GameScreenView } from "./GameScreenView.ts";
import { GAME_DURATION } from "../../constants.ts";
import { getFactPairByIndex, getCorrectFactIndex } from "./NewYorkFacts.ts";

/**
 * GameScreenController - Coordinates game logic between Model and View
 */
export class GameScreenController extends ScreenController {
  private model: GameScreenModel;
  private view: GameScreenView;
  private screenSwitcher: ScreenSwitcher;
  private gameTimer: number | null = null;

  private squeezeSound: HTMLAudioElement;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new GameScreenModel();
    this.view = new GameScreenView(
      () => this.handleTaxiClick(1),
      () => this.handleTaxiClick(2)
    );

    // TODO: Task 4 - Initialize squeeze sound audio
    this.squeezeSound = new Audio("/squeeze.mp3"); // Placeholder
  }

  /**
   * Start the game
   */
  startGame(): void {
    // Reset model state
    this.model.reset();

    // Update score display
    this.view.updateScore(this.model.getScore());

    // Show the view
    this.view.show();

    // Timer disabled for viewing the background only
    // this.startTimer();
  }

  /**
   * Start the countdown timer
   */
  private startTimer(): void {
    let timeRemaining = GAME_DURATION;
    // TODO: Task 3 - Implement countdown timer using setInterval
    this.gameTimer = setInterval(() => {
      timeRemaining--;
      // Timer display removed for now
      if (timeRemaining <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  /**
   * Stop the timer
   */
  private stopTimer(): void {
    // TODO: Task 3 - Stop the timer using clearInterval
    if (this.gameTimer !== null) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  }

  /**
   * Handle taxi click event
   * @param taxiNumber - 1 for taxi1 (fact1), 2 for taxi2 (fact2)
   */
  private handleTaxiClick(taxiNumber: 1 | 2): void {
    // Get current fact pair
    const currentFactIndex = this.view.getCurrentFactIndex();
    const factPair = getFactPairByIndex(currentFactIndex);

    // Check which taxi has the correct answer
    const correctTaxi = getCorrectFactIndex(factPair);

    // If clicked taxi is correct, increment score
    if (taxiNumber === correctTaxi) {
      this.model.incrementScore();
      this.view.updateScore(this.model.getScore());
      // TODO: Play success sound
      // this.successSound.play();
    } else {
      // Wrong answer - no points
      // TODO: Play wrong answer sound
      // this.wrongSound.play();
    }
  }

  /**
   * End the game
   */
  private endGame(): void {
    this.stopTimer();

    // Switch to results screen with final score
    this.screenSwitcher.switchToScreen({
      type: "result",
      score: this.model.getScore(),
    });
  }

  /**
   * Get final score
   */
  getFinalScore(): number {
    return this.model.getScore();
  }

  /**
   * Get the view group
   */
  getView(): GameScreenView {
    return this.view;
  }
}
