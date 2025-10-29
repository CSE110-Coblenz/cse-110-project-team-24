import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { GameScreenModel } from "./GameScreenModel.ts";
import { GameScreenView } from "./GameScreenView.ts";
import { GAME_DURATION } from "../../constants.ts";

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
    this.view = new GameScreenView(() => this.handleLemonClick());

    // TODO: Task 4 - Initialize squeeze sound audio
    this.squeezeSound = new Audio("/squeeze.mp3"); // Placeholder
  }

  /**
   * Start the game
   */
  startGame(): void {
    // Reset model state
    this.model.reset();

    // Update view
    this.view.updateScore(this.model.getScore());
    this.view.updateTimer(GAME_DURATION);
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
      this.view.updateTimer(timeRemaining);
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
   * Handle lemon click event
   */
  private handleLemonClick(): void {
    // Update model
    this.model.incrementScore();

    // Update view
    this.view.updateScore(this.model.getScore());
    this.view.randomizeLemonPosition();

    // TODO: Task 4 - Play the squeeze sound
    this.squeezeSound.play();
    this.squeezeSound.currentTime = 0;
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
