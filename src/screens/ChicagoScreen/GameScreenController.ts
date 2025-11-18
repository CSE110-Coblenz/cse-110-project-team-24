import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { GameScreenModel } from "./GameScreenModel.ts";
import { GameScreenView } from "./GameScreenView.ts";

/**
 * GameScreenController - Coordinates museum fact matching logic
 */
export class GameScreenController extends ScreenController {
  private readonly model: GameScreenModel;
  private readonly view: GameScreenView;
  private readonly screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new GameScreenModel();
    this.view = new GameScreenView(
      (museumId) => this.handleFactDrop(museumId),
      () => this.handleNextRequest()
    );
  }

  /**
   * Start the game session
   */
  startGame(): void {
    this.model.reset();
    this.view.setMuseums(this.model.getMuseums());
    this.view.hideNextButton();
    this.view.show();
    this.view.showPrompt();
    const firstFact = this.model.getCurrentFact();
    this.view.setFact(firstFact, { draggable: true });
    if (firstFact) {
      this.view.unlockFactCard();
    } else {
      this.view.lockFactCard();
    }
  }

  /**
   * Handle the player dropping the fact onto a museum target
   */
  private handleFactDrop(museumId: string): void {
    const currentFact = this.model.getCurrentFact();
    if (!currentFact) {
      return;
    }

    if (currentFact.museumId === museumId) {
      this.view.markMuseumMatched(museumId);
      this.view.showDetail(currentFact.detail);
      this.model.markCurrentFactMatched(museumId);
      this.view.lockFactCard();

      const hasNext = this.model.hasNextFact();
      this.view.showNextButton(hasNext ? "Next" : "Finish");
    } else {
      this.model.recordWrongGuess();
      const remaining = this.model.getRemainingAttempts();

      if (remaining > 0) {
        const triesLabel = remaining === 1 ? "try" : "tries";
        this.view.showDetail(`Not quite—${remaining} ${triesLabel} left.`);
      } else {
        this.view.showDetail(
          "That's three misses—tour's over! Let's try again."
        );
        this.view.lockFactCard();
        this.endGame({
          outcome: "loss",
          message: "You ran out of guesses. Tap Play Again to restart.",
        });
        return;
      }
    }
  }

  private handleNextRequest(): void {
    this.view.hideNextButton();

    if (!this.model.hasNextFact()) {
      this.model.advanceToNextFact();
      this.endGame({
        outcome: "win",
        message: "Chicago’s museums are no match for you!",
      });
      return;
    }

    const nextFact = this.model.advanceToNextFact();
    if (!nextFact) {
      this.endGame({
        outcome: "win",
        message: "Chicago’s museums are no match for you!",
      });
      return;
    }

    this.view.showPrompt();
    this.view.setFact(nextFact, { draggable: true });
    this.view.unlockFactCard();
  }

  /**
   * End the game and transition to the results screen
   */
  private endGame(options?: {
    outcome?: "win" | "loss";
    message?: string;
  }): void {
    const outcome = options?.outcome ?? "win";
    const message =
      options?.message ??
      (outcome === "win"
        ? "You matched every Chicago museum fact!"
        : "Out of attempts—give it another go.");

    this.screenSwitcher.switchToScreen({
      type: "result",
      score: this.model.getMatchedCount(),
      outcome,
      message,
    });
  }

  /**
   * Get the active view
   */
  getView(): GameScreenView {
    return this.view;
  }
}
