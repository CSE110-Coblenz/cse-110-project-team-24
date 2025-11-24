import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { ResultsScreenModel } from "./ResultsScreenModel.ts";
import { ResultsScreenView, type ResultOutcome } from "./ResultsScreenView.ts";

/**
 * ResultsScreenController - Handles results screen interactions
 */
export class ResultsScreenController extends ScreenController {
  private model: ResultsScreenModel;
  private view: ResultsScreenView;
  private screenSwitcher: ScreenSwitcher;
  private pendingOutcome: ResultOutcome = "win";
  private pendingMessage: string | undefined;

  private gameOverSound: HTMLAudioElement;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.model = new ResultsScreenModel();
    this.view = new ResultsScreenView(() => this.handlePlayAgainClick());

    // TODO: Task 4 - Initialize game over sound audio
    this.gameOverSound = new Audio("/gameover.mp3"); // Placeholder
  }

  /**
   * Show results screen with final score
   */
  setOutcomeContext(outcome?: ResultOutcome, message?: string): void {
    this.pendingOutcome = outcome ?? "win";
    this.pendingMessage = message;
  }

  showResults(finalScore: number): void {
    const outcome = this.pendingOutcome;
    const message = this.pendingMessage;
    this.pendingOutcome = "win";
    this.pendingMessage = undefined;
    this.model.setFinalScore(finalScore);
    this.view.updateFinalScore(finalScore);
    this.view.updateOutcome(outcome, message);

    this.view.show();

    // TODO: Task 4 - Play the game over sound
    this.gameOverSound.play();
    this.gameOverSound.currentTime = 0;
  }

  /**
   * Handle play again button click
   */
  private handlePlayAgainClick(): void {
    this.screenSwitcher.switchToScreen({ type: "menu" });
  }

  /**
   * Get the view
   */
  getView(): ResultsScreenView {
    return this.view;
  }
}
