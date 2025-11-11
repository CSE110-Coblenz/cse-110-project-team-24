import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { GameScreenModel } from "./GameScreenModel.ts";
import { GameScreenView } from "./GameScreenView.ts";

/**
 * GameScreenController - Coordinates Wordle game logic between Model and View
 */
export class GameScreenController extends ScreenController {
  private model: GameScreenModel;
  private view: GameScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new GameScreenModel();
    this.view = new GameScreenView();

    // Set up view handlers
    this.view.setHandlers(
      (letter: string) => this.handleLetterInput(letter),
      () => this.handleBackspace(),
      () => this.handleEnter(),
      () => this.handleMenuClick()
    );
  }

  /**
   * Start the game
   */
  startGame(): void {
    // Reset model
    this.model.reset();

    // Hide win screen if visible
    this.view.hideWinScreen();

    // Reset view
    this.view.showMessage("Guess a 5-letter word about San Diego! (Any 5 letters!)", "#333");
    this.updateView();

    // Show the view
    this.view.show();
  }

  /**
   * Handle letter input
   */
  private handleLetterInput(letter: string): void {
    if (this.model.isGameOver()) {
      return;
    }

    const added = this.model.addLetter(letter);
    if (added) {
      this.updateView();
    }
  }

  /**
   * Handle backspace
   */
  private handleBackspace(): void {
    if (this.model.isGameOver()) {
      return;
    }

    this.model.removeLetter();
    this.updateView();
  }

  /**
   * Handle enter (submit guess)
   */
  private handleEnter(): void {
    // If game is won, don't allow restart via ENTER (use MENU button instead)
    if (this.model.isGameWon()) {
      return;
    }

    if (this.model.isGameOver()) {
      // Game lost - allow restart
      this.startGame();
      return;
    }

    const submitted = this.model.submitGuess();
    if (!submitted) {
      // Only reason it fails now is if guess is not 5 letters
      const currentGuess = this.model.getCurrentGuess();
      if (currentGuess.length < 5) {
        this.view.showMessage("Word must be 5 letters!", "#D32F2F");
        setTimeout(() => {
          this.view.showMessage("Guess a 5-letter word about San Diego! (Any 5 letters!)", "#333");
        }, 2000);
      }
    } else {
      // Guess was submitted successfully
      this.updateView();

      if (this.model.isGameWon()) {
        const guessCount = this.model.getGuessCount();
        // Show win screen
        this.view.showWinScreen(guessCount);
      } else if (this.model.isGameOver()) {
        const targetWord = this.model.getTargetWord();
        this.view.showMessage(
          `Game Over! The word was: ${targetWord}. Press ENTER to play again.`,
          "#D32F2F"
        );
      } else {
        this.view.showMessage("Guess a 5-letter word about San Diego! (Any 5 letters!)", "#333");
      }
    }
  }

  /**
   * Handle menu button click
   */
  private handleMenuClick(): void {
    // Navigate back to home screen
    this.screenSwitcher.switchToScreen({ type: "home" });
  }

  /**
   * Update the view with current game state
   */
  private updateView(): void {
    const guesses = this.model.getGuesses();
    const currentGuess = this.model.getCurrentGuess();
    
    this.view.updateGuesses(guesses, currentGuess);
    this.view.updateKeyboard(guesses);
  }

  /**
   * Get the view group
   */
  getView(): GameScreenView {
    return this.view;
  }
}
