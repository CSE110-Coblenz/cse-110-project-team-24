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
  private detailTimeout: number | null = null;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new GameScreenModel();
    this.view = new GameScreenView((museumId) => this.handleFactDrop(museumId));
  }

  /**
   * Start the game session
   */
  startGame(): void {
    this.model.reset();
    this.view.showPrompt();
    this.view.setMuseums(this.model.getMuseums());
    this.view.setFact(this.model.getCurrentFact());
    this.view.show();
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
      const nextFact = this.model.markMatch(museumId);

      if (this.detailTimeout !== null) {
        window.clearTimeout(this.detailTimeout);
        this.detailTimeout = null;
      }

      if (this.model.isComplete()) {
        this.detailTimeout = window.setTimeout(() => {
          this.endGame();
        }, 1800);
      } else if (nextFact) {
        this.detailTimeout = window.setTimeout(() => {
          this.view.showPrompt();
          this.view.setFact(nextFact);
        }, 1800);
      }
    } else {
      this.view.showDetail("Not quite—try again!");
    }
  }

  /**
   * End the game and transition to the results screen
   */
  private endGame(): void {
    if (this.detailTimeout !== null) {
      window.clearTimeout(this.detailTimeout);
      this.detailTimeout = null;
    }

    this.screenSwitcher.switchToScreen({
      type: "result",
      score: this.model.getMatchedCount(),
    });
  }

  /**
   * Get the active view
   */
  getView(): GameScreenView {
    return this.view;
  }
}
