import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { AboutScreenView } from "./AboutScreenView.ts";

/**
 * AboutScreenController - Handles the about screen interactions and navigation
 * 
 * This controller manages the about screen, which displays information about the game.
 * It handles the back button click to return to the menu screen.
 */
export class AboutScreenController extends ScreenController {
	// The view component that renders the about screen UI
	private view: AboutScreenView;
	// The screen switcher used to navigate between different screens
	private screenSwitcher: ScreenSwitcher;

	/**
	 * Constructor - Initializes the about screen controller
	 * 
	 * @param screenSwitcher - The screen switcher instance used to navigate to other screens
	 */
	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		// Create the view and pass a callback function for the back button click
		// This callback handles navigation back to the menu screen
		this.view = new AboutScreenView(() => this.handleBack());
	}

	/**
	 * Handle back button click - Navigates back to the menu screen
	 * 
	 * Called when the user clicks the "BACK" button on the about screen.
	 * This triggers the screen switcher to transition back to the menu screen.
	 */
	private handleBack(): void {
		this.screenSwitcher.switchToScreen({ type: "menu" });
	}

	/**
	 * Get the view component
	 * 
	 * @returns The AboutScreenView instance that renders the about screen UI
	 */
	getView(): AboutScreenView {
		return this.view;
	}
}


