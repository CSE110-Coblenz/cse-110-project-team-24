import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MenuScreenView } from "./StartScreenView.ts";
import { GameStateManager } from "../../GameStateManager.ts";

/**
 * MenuScreenController - Handles menu interactions and navigation
 * 
 * This controller manages the start/menu screen, handling user interactions
 * with the START GAME and ABOUT buttons. It coordinates between the view
 * (which renders the UI) and the screen switcher (which manages screen transitions).
 */
export class MenuScreenController extends ScreenController {
  // The view component that renders the menu screen UI
  private view: MenuScreenView;
  // The screen switcher used to navigate between different screens
  private screenSwitcher: ScreenSwitcher;

  /**
   * Constructor - Initializes the menu screen controller
   * 
   * @param screenSwitcher - The screen switcher instance used to navigate to other screens
   */
  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    // Create the view and pass callback functions for button clicks
    // These callbacks handle navigation to the game or about screens
    this.view = new MenuScreenView(
      () => this.handleStartClick(),
      () => this.handleAboutClick(),
      () => this.handleResetClick()
    );
  }

  /**
   * Handle start button click - Navigates to the home screen
   * 
   * Called when the user clicks the "START GAME" button on the menu screen.
   * This triggers the screen switcher to transition to the home screen (map/city selection).
   */
  private handleStartClick(): void {
    this.screenSwitcher.switchToScreen({ type: "home" });
  }

  /**
   * Handle about button click - Navigates to the about screen
   * 
   * Called when the user clicks the "ABOUT" button on the menu screen.
   * This triggers the screen switcher to transition to the about screen,
   * where users can learn more about the game.
   */
  private handleAboutClick(): void {
    this.screenSwitcher.switchToScreen({ type: "about" });
  }

  /**
   * Handle reset button click - Resets all game progress
   * 
   * Called when the user clicks the "RESET" button on the menu screen.
   * This resets all completed cities and clears saved game state.
   */
  private handleResetClick(): void {
    console.log("handleResetClick called!");
    const gameStateManager = GameStateManager.getInstance();
    if (!gameStateManager) {
      console.error("GameStateManager instance not found!");
      return;
    }
    gameStateManager.resetGameState();
    console.log("Game progress reset! Completed cities:", gameStateManager.getCompletedCities());
    alert("Game progress has been reset!");
  }

  /**
   * Get the view component
   * 
   * @returns The MenuScreenView instance that renders the menu screen UI
   */
  getView(): MenuScreenView {
    return this.view;
  }
}
